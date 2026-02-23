import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createOrder, verifyPaymentSignature, verifyWebhookSignature } from '../lib/razorpay';
import { sendPurchaseEmail } from '../lib/email';

const router = Router();
const prisma = new PrismaClient();

// Create Razorpay order
router.post('/create-order', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { courseId } = req.body;
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found.' });
            return;
        }

        // Check if already enrolled
        const existing = await prisma.enrollment.findUnique({
            where: { userId_courseId: { userId: req.user!.id, courseId } },
        });
        if (existing) {
            res.status(400).json({ success: false, message: 'Already enrolled in this course.' });
            return;
        }

        const order = await createOrder(course.price, courseId, req.user!.id);
        res.json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID,
            course: { title: course.title, price: course.price },
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ success: false, message: 'Failed to create order.' });
    }
});

// Verify payment after Razorpay checkout
router.post('/verify-payment', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

        const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
        if (!isValid) {
            res.status(400).json({ success: false, message: 'Payment verification failed.' });
            return;
        }

        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) {
            res.status(404).json({ success: false, message: 'Course not found.' });
            return;
        }

        // Create enrollment
        const enrollment = await prisma.enrollment.create({
            data: {
                userId: req.user!.id,
                courseId,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                amountPaid: course.price,
            },
        });

        // Send confirmation email (non-blocking)
        const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
        if (user) {
            sendPurchaseEmail(user.name, user.email, course.title, course.price).catch(console.error);
        }

        res.json({ success: true, enrollment });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ success: false, message: 'Payment verification failed.' });
    }
});

// Get my enrollments
router.get('/my', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { userId: req.user!.id },
            include: {
                course: {
                    include: {
                        _count: { select: { lectures: true } },
                    },
                },
            },
            orderBy: { enrolledAt: 'desc' },
        });

        // Add progress info
        const enriched = await Promise.all(
            enrollments.map(async (e) => {
                const completedCount = await prisma.progress.count({
                    where: { userId: req.user!.id, lecture: { courseId: e.courseId } },
                });
                return { ...e, completedLectures: completedCount };
            })
        );

        res.json({ success: true, enrollments: enriched });
    } catch (error) {
        console.error('Get enrollments error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch enrollments.' });
    }
});

// Razorpay webhook
router.post('/webhook/razorpay', async (req: Request, res: Response) => {
    try {
        const signature = req.headers['x-razorpay-signature'] as string;
        const body = JSON.stringify(req.body);

        if (!verifyWebhookSignature(body, signature)) {
            res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
            return;
        }

        const event = req.body.event;
        if (event === 'payment.captured') {
            const payment = req.body.payload.payment.entity;
            const { courseId, userId } = payment.notes;

            if (courseId && userId) {
                await prisma.enrollment.upsert({
                    where: { userId_courseId: { userId, courseId } },
                    create: {
                        userId,
                        courseId,
                        razorpayOrderId: payment.order_id,
                        razorpayPaymentId: payment.id,
                        amountPaid: payment.amount / 100,
                    },
                    update: {
                        razorpayPaymentId: payment.id,
                        status: 'active',
                    },
                });
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ success: false });
    }
});

export default router;
