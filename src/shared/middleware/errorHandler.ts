import { Request, Response, NextFunction } from 'express';
import { AppError } from '../http/errors';
import { sendError } from '../http/response';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error] ${err.message}`, err);

  if (err instanceof AppError) {
    return sendError(res, err.message, err.code, err.status, err.details);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Map Prisma errors to AppErrors
    if (err.code === 'P2002') {
      return sendError(res, 'A record with these details already exists.', 'CONFLICT', 409);
    }
    if (err.code === 'P2025') {
      return sendError(res, 'Record not found.', 'NOT_FOUND', 404);
    }
  }

  // Fallback to internal server error
  const isProd = process.env.NODE_ENV === 'production';
  return sendError(
    res,
    isProd ? 'An internal server error occurred.' : err.message,
    'INTERNAL_ERROR',
    500
  );
};
