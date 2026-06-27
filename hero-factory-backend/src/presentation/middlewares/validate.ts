import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../../application/errors/AppError';

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const firstError = result.error.issues[0];
            const message = firstError
                ? `${firstError.path.join('.')}: ${firstError.message}`
                : 'Dados inválidos.';
            next(new AppError(message, 400));
            return;
        }

        req.body = result.data;
        next();
    };
};