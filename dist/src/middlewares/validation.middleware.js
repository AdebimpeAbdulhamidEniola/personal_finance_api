import { ZodError } from 'zod';
import { AppError } from '@/utils/error.utils';
export const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            const validated = schema.parse(req.body);
            req.body = validated; // Replace with validated data
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map(issue => ({
                    field: issue.path.join('.') || 'body',
                    message: issue.message
                }));
                next(new AppError('Validation failed', 400, errors));
            }
            else {
                next(error);
            }
        }
    };
};
