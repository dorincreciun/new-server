import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/http/errors';
import { sendError } from '../shared/http/response';
import { Prisma } from '@prisma/client';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[Error] ${err.message}`, err);

  // Handle AppError instances
  if (err instanceof AppError) {
    return sendError(res, err.message, err.code, err.status, err.details);
  }

  // Handle Prisma errors
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
}
