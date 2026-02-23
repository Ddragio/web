import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../lib/email';

const router = Router();
const prisma = new PrismaClient();

// Register
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, mobile, password } = req.body;
        if (!name || !email || !mobile || !password) {
            res.status(400).json({ success: false, message: 'All fields are required.' });
            return;
        }

        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { mobile }] },
        });
        if (existingUser) {
            res.status(409).json({ success: false, message: 'Email or mobile already registered.' });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { name, email, mobile, passwordHash },
        });

        const jwtSecret: jwt.Secret = process.env.JWT_SECRET || 'secret';
        const jwtOptions: jwt.SignOptions = { expiresIn: 604800 }; // 7 days in seconds
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            jwtSecret,
            jwtOptions
        );

        // Send welcome email (non-blocking)
        sendWelcomeEmail(name, email).catch(console.error);

        res.status(201).json({
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Registration failed.' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Email and password required.' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid credentials.' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials.' });
            return;
        }

        const jwtSecret: jwt.Secret = process.env.JWT_SECRET || 'secret';
        const jwtOptions: jwt.SignOptions = { expiresIn: 604800 }; // 7 days in seconds
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            jwtSecret,
            jwtOptions
        );

        res.json({
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed.' });
    }
});

// Forgot Password (sends OTP via email)
router.post('/forgot-password', async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Don't reveal if email exists
            res.json({ success: true, message: 'If the email exists, an OTP has been sent.' });
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // In production, store OTP in Redis with TTL
        console.log(`OTP for ${email}: ${otp}`);

        const { sendEmail } = require('../lib/email');
        await sendEmail(
            email,
            'Password Reset OTP - Gyan Sammaan',
            `<div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #1A7A3C;">Password Reset OTP</h2>
        <p>Your OTP is: <strong style="font-size: 24px; color: #1565C0;">${otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
      </div>`
        );

        res.json({ success: true, message: 'OTP sent to your email.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP.' });
    }
});

// Get current user profile
router.get('/me', async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ success: false, message: 'No token' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true, mobile: true, role: true, createdAt: true },
        });
        res.json({ success: true, user });
    } catch {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
});

export default router;
