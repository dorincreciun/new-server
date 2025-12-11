import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { readAccessToken } from '../utils/cookieUtils';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

/**
 * Middleware pentru autentificare JWT din cookie
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // 1) Încearcă Authorization: Bearer <token>
  const authHeader = req.get('authorization') || req.get('Authorization');
  const bearerMatch = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring('Bearer '.length).trim()
    : '';

  // 2) Fallback: cookie http-only
  const cookieToken = readAccessToken(req);

  const token = bearerMatch || cookieToken || '';

  if (!token) {
    return res.status(401).json({ 
      error: 'Token de acces necesar'
    });
  }

  try {
    const user = authService.verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Token invalid'
    });
  }
}

/**
 * Middleware opțional pentru autentificare (nu returnează eroare dacă nu există token)
 */
export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.get('authorization') || req.get('Authorization');
  const bearerMatch = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring('Bearer '.length).trim()
    : '';
  const token = bearerMatch || readAccessToken(req);

  if (token) {
    try {
      const user = authService.verifyAccessToken(token);
      req.user = user;
    } catch (error) {
      // Ignoră eroarea pentru middleware-ul opțional
    }
  }

  next();
}
