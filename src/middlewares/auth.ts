import { Request, Response, NextFunction } from 'express';
import { authService, UserPayload } from '../modules/auth/service';
import { readAccessToken } from '../utils/cookieUtils';
import { UnauthorizedError } from '../shared/http/errors';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

/**
 * Middleware pentru autentificare JWT din cookie sau Authorization header
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // 1) Încearcă Authorization: Bearer <token>
    const authHeader = req.get('authorization') || req.get('Authorization');
    const bearerMatch = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring('Bearer '.length).trim()
      : '';

    // 2) Fallback: cookie http-only
    const cookieToken = readAccessToken(req);
    const token = bearerMatch || cookieToken || '';

    if (!token) {
      throw new UnauthorizedError('Token de acces necesar');
    }

    // Verify token
    const user = authService.verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional auth middleware - adaugă user dacă există token, dar nu eșuează dacă nu există
 */
export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.get('authorization') || req.get('Authorization');
    const bearerMatch = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring('Bearer '.length).trim()
      : '';

    const cookieToken = readAccessToken(req);
    const token = bearerMatch || cookieToken || '';

    if (token) {
      const user = authService.verifyAccessToken(token);
      req.user = user;
    }
    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
}
