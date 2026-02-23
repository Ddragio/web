import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all published courses (public, with filters)
router.get('/', async (req: Request, res: Response) => {
    try {
        const { category, language, minPrice, maxPrice, search } = req.query;
        const where: any = { isPublished: true };

        if (category) where.category = category;
        if (language) where.language = language;
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice as string);
            if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
        }
        if (search) {
            where.OR = [
                { title: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } },
            ];
        }

        const courses = await prisma.course.findMany({
            where,
            include: {
                _count: { select: { lectures: true, enrollments: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({ success: true, courses });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch courses.' });
    }
});

// Get single course with lectures
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const course = await prisma.course.findUnique({
            where: { id: req.params.id },
            include: {
                lectures: { orderBy: { order: 'asc' } },
                _count: { select: { enrollments: true } },
            },
        });

        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found.' });
            return;
        }

        // Hide video URLs for non-free lectures
        const lecturesWithAccess = course.lectures.map((l) => ({
            ...l,
            videoUrl: l.isFree ? l.videoUrl : null,
        }));

        res.json({ success: true, course: { ...course, lectures: lecturesWithAccess } });
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch course.' });
    }
});

// Admin: Create course
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, price, thumbnail, category, language, instructor } = req.body;
        const course = await prisma.course.create({
            data: { title, description, price: parseFloat(price), thumbnail, category, language, instructor },
        });
        res.status(201).json({ success: true, course });
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({ success: false, message: 'Failed to create course.' });
    }
});

// Admin: Update course
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const data: any = { ...req.body };
        if (data.price) data.price = parseFloat(data.price);

        const course = await prisma.course.update({
            where: { id: req.params.id },
            data,
        });
        res.json({ success: true, course });
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({ success: false, message: 'Failed to update course.' });
    }
});

// Admin: Delete course
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        await prisma.course.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Course deleted.' });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete course.' });
    }
});

export default router;
