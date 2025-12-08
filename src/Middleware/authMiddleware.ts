import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header is missing or malformed' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is missing' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        (req as any).user = decodedToken;
        return next();

    }
    catch (error: any) {
        return res.status(401).json({
            message: error.message,
            success: false
        })
    }
};