import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Mark lecture as completed
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { lectureId } = req.body;

        const lecture = await prisma.lecture.findUnique({ where: { id: lectureId } });
        if (!lecture) {
            res.status(404).json({ success: false, message: 'Lecture not found.' });
            return;
        }

        // Check enrollment
        const enrollment = await prisma.enrollment.findUnique({
            where: { userId_courseId: { userId: req.user!.id, courseId: lecture.courseId } },
        });
        if (!enrollment && req.user!.role !== 'ADMIN') {
            res.status(403).json({ success: false, message: 'Not enrolled.' });
            return;
        }

        const progress = await prisma.progress.upsert({
            where: { userId_lectureId: { userId: req.user!.id, lectureId } },
            create: { userId: req.user!.id, lectureId },
            update: { completedAt: new Date() },
        });

        res.json({ success: true, progress });
    } catch (error) {
        console.error('Progress error:', error);
        res.status(500).json({ success: false, message: 'Failed to update progress.' });
    }
});

// Get course progress
router.get('/:courseId', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { courseId } = req.params;

        const totalLectures = await prisma.lecture.count({ where: { courseId } });
        const completedLectures = await prisma.progress.count({
            where: { userId: req.user!.id, lecture: { courseId } },
        });

        const completedIds = await prisma.progress.findMany({
            where: { userId: req.user!.id, lecture: { courseId } },
            select: { lectureId: true },
        });

        res.json({
            success: true,
            totalLectures,
            completedLectures,
            percentage: totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0,
            completedLectureIds: completedIds.map((p) => p.lectureId),
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch progress.' });
    }
});

export default router;
