import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../application/errors/AppError';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: true,
            message: err.message,
        });
        return;
    }

    console.error('Erro interno no servidor:', err);
    res.status(500).json({
        error: true,
        message: 'Erro interno do servidor!',
    });
};