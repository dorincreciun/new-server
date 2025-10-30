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
  const token = readAccessToken(req);

  if (!token) {
    return res.status(401).json({ 
      error: 'Unauthorized'
    });
  }

  try {
    const user = authService.verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Unauthorized'
    });
  }
}

/**
 * Middleware opțional pentru autentificare (nu returnează eroare dacă nu există token)
 */
export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = readAccessToken(req);

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
