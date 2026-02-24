import { verifyToken } from "@/utils/auth.utils";
import {Request,Response, NextFunction } from "express";
import { AppError } from "@/utils/error.utils";
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Authorization header missing or malformed', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(token);
        req.userId = decoded.email; // Attach user email to request object
        req.name = decoded.name

        next();
    } catch (error) {
        return next(new AppError('Invalid or expired token', 401));

    }
};