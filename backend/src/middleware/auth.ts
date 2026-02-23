import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        return;
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
        next();
    } catch {
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== 'ADMIN') {
        res.status(403).json({ success: false, message: 'Admin access required.' });
        return;
    }
    next();
};

export const requireStudent = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== 'STUDENT' && req.user?.role !== 'ADMIN') {
        res.status(403).json({ success: false, message: 'Access denied.' });
        return;
    }
    next();
};
