import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all free resources (public)
router.get('/', async (_req: any, res: Response) => {
    try {
        const resources = await prisma.freeResource.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, resources });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch resources.' });
    }
});

// Admin: Create resource
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, fileUrl, category } = req.body;
        const resource = await prisma.freeResource.create({
            data: { title, description, fileUrl, category },
        });
        res.status(201).json({ success: true, resource });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create resource.' });
    }
});

// Admin: Delete resource
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        await prisma.freeResource.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Resource deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete resource.' });
    }
});

export default router;
