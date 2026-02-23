import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { sendEmail } from '../lib/email';

const router = Router();
const prisma = new PrismaClient();

// Admin: Get dashboard stats
router.get('/stats', authenticate, requireAdmin, async (_req: AuthRequest, res: Response) => {
    try {
        const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
        const totalCourses = await prisma.course.count();
        const totalEnrollments = await prisma.enrollment.count();

        const revenueResult = await prisma.enrollment.aggregate({
            _sum: { amountPaid: true },
        });
        const totalRevenue = revenueResult._sum.amountPaid || 0;

        // This month stats
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyEnrollments = await prisma.enrollment.count({
            where: { enrolledAt: { gte: startOfMonth } },
        });
        const monthlyRevenue = await prisma.enrollment.aggregate({
            _sum: { amountPaid: true },
            where: { enrolledAt: { gte: startOfMonth } },
        });

        res.json({
            success: true,
            stats: {
                totalStudents,
                totalCourses,
                totalEnrollments,
                totalRevenue,
                monthlyEnrollments,
                monthlyRevenue: monthlyRevenue._sum.amountPaid || 0,
            },
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
    }
});

// Admin: List all students
router.get('/students', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const students = await prisma.user.findMany({
            where: { role: 'STUDENT' },
            select: {
                id: true,
                name: true,
                email: true,
                mobile: true,
                createdAt: true,
                _count: { select: { enrollments: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, students });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch students.' });
    }
});

// Admin: Grant/Revoke course access
router.put('/students/:userId/access', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const { courseId, action } = req.body; // action = 'grant' | 'revoke'

        if (action === 'grant') {
            await prisma.enrollment.upsert({
                where: { userId_courseId: { userId, courseId } },
                create: { userId, courseId, amountPaid: 0, status: 'granted' },
                update: { status: 'active' },
            });
        } else if (action === 'revoke') {
            await prisma.enrollment.updateMany({
                where: { userId, courseId },
                data: { status: 'revoked' },
            });
        }

        res.json({ success: true, message: `Access ${action}ed successfully.` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update access.' });
    }
});

// Admin: List all payments
router.get('/payments', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const payments = await prisma.enrollment.findMany({
            where: { amountPaid: { gt: 0 } },
            include: {
                user: { select: { name: true, email: true } },
                course: { select: { title: true } },
            },
            orderBy: { enrolledAt: 'desc' },
        });
        res.json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch payments.' });
    }
});

// Admin: Send bulk notification to course students
router.post('/send-notification', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { courseId, subject, message } = req.body;

        const enrollments = await prisma.enrollment.findMany({
            where: { courseId, status: 'active' },
            include: { user: { select: { email: true, name: true } } },
        });

        const emailPromises = enrollments.map((e) =>
            sendEmail(
                e.user.email,
                subject,
                `<div style="font-family: sans-serif; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1A7A3C, #1565C0); padding: 20px; text-align: center;">
            <h2 style="color: white; margin: 0;">ज्ञान सम्मान</h2>
          </div>
          <div style="padding: 20px; background: #F0FAF4;">
            <p>Dear ${e.user.name},</p>
            <p>${message}</p>
          </div>
        </div>`
            ).catch(console.error)
        );

        await Promise.all(emailPromises);
        res.json({ success: true, message: `Notification sent to ${enrollments.length} students.` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send notifications.' });
    }
});

export default router;
