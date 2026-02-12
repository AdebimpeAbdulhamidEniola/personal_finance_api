// Placeholder for future validation middleware
// src/middleware/validateRequest.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from '@/utils/error.utils';

export const validateBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = schema.parse(req.body);
            req.body = validated; // Replace with validated data
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map(issue => ({
                    field: issue.path.join('.') || 'body',
                    message: issue.message
                }));

                next(new AppError('Validation failed', 400, errors));
            } else {
                next(error);
            }
        }
    };
};
