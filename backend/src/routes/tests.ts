import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all test series (public)
router.get('/', async (_req: any, res: Response) => {
    try {
        const testSeries = await prisma.testSeries.findMany({
            where: { isPublished: true },
            include: {
                course: { select: { title: true, category: true } },
                _count: { select: { testAttempts: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, testSeries });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch test series.' });
    }
});

// Admin: Create test series
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, courseId, totalQuestions, duration } = req.body;
        const testSeries = await prisma.testSeries.create({
            data: {
                title,
                description,
                courseId: courseId || null,
                totalQuestions: parseInt(totalQuestions || '0'),
                duration: parseInt(duration || '60'),
                isPublished: true,
            },
        });
        res.status(201).json({ success: true, testSeries });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create test series.' });
    }
});

// Submit test attempt
router.post('/attempts', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { testSeriesId, score, totalMarks } = req.body;
        const attempt = await prisma.testAttempt.create({
            data: {
                userId: req.user!.id,
                testSeriesId,
                score: parseInt(score || '0'),
                totalMarks: parseInt(totalMarks || '0'),
            },
        });
        res.status(201).json({ success: true, attempt });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to submit test.' });
    }
});

// Get my test attempts
router.get('/attempts/my', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const attempts = await prisma.testAttempt.findMany({
            where: { userId: req.user!.id },
            include: { testSeries: { select: { title: true } } },
            orderBy: { completedAt: 'desc' },
        });
        res.json({ success: true, attempts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch attempts.' });
    }
});

export default router;
