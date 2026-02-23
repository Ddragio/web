import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { getSignedVideoUrl, uploadToS3 } from '../lib/s3';
import multer from 'multer';

const router = Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

// Admin: Add lecture to course
router.post(
    '/courses/:courseId/lectures',
    authenticate,
    requireAdmin,
    upload.single('video'),
    async (req: AuthRequest, res: Response) => {
        try {
            const { courseId } = req.params;
            const { title, duration, order, isFree } = req.body;

            let videoUrl = req.body.videoUrl || null;

            // If file uploaded, push to S3
            if (req.file) {
                const key = `lectures/${courseId}/${Date.now()}-${req.file.originalname}`;
                videoUrl = await uploadToS3(req.file.buffer, key, req.file.mimetype);
            }

            const lecture = await prisma.lecture.create({
                data: {
                    courseId,
                    title,
                    videoUrl,
                    duration: parseInt(duration || '0'),
                    order: parseInt(order || '0'),
                    isFree: isFree === 'true' || isFree === true,
                },
            });

            res.status(201).json({ success: true, lecture });
        } catch (error) {
            console.error('Add lecture error:', error);
            res.status(500).json({ success: false, message: 'Failed to add lecture.' });
        }
    }
);

// Admin: Update lecture
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const data: any = { ...req.body };
        if (data.duration) data.duration = parseInt(data.duration);
        if (data.order) data.order = parseInt(data.order);
        if (data.isFree !== undefined) data.isFree = data.isFree === 'true' || data.isFree === true;

        const lecture = await prisma.lecture.update({
            where: { id: req.params.id },
            data,
        });
        res.json({ success: true, lecture });
    } catch (error) {
        console.error('Update lecture error:', error);
        res.status(500).json({ success: false, message: 'Failed to update lecture.' });
    }
});

// Admin: Delete lecture
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        await prisma.lecture.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Lecture deleted.' });
    } catch (error) {
        console.error('Delete lecture error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete lecture.' });
    }
});

// Get signed video URL (enrolled students only)
router.get('/:id/signed-url', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const lecture = await prisma.lecture.findUnique({
            where: { id: req.params.id },
            include: { course: true },
        });

        if (!lecture) {
            res.status(404).json({ success: false, message: 'Lecture not found.' });
            return;
        }

        // Free lectures accessible to everyone
        if (!lecture.isFree) {
            const enrollment = await prisma.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: req.user!.id,
                        courseId: lecture.courseId,
                    },
                },
            });

            if (!enrollment && req.user!.role !== 'ADMIN') {
                res.status(403).json({ success: false, message: 'You must enroll in this course.' });
                return;
            }
        }

        if (!lecture.videoUrl) {
            res.status(404).json({ success: false, message: 'No video available.' });
            return;
        }

        const signedUrl = await getSignedVideoUrl(lecture.videoUrl);
        res.json({ success: true, url: signedUrl });
    } catch (error) {
        console.error('Signed URL error:', error);
        res.status(500).json({ success: false, message: 'Failed to get video URL.' });
    }
});

export default router;
