import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

/**
 * Middleware pentru autentificare JWT
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Token de acces necesar',
      message: 'Trebuie să furnizați un token de autentificare valid'
    });
  }

  try {
    const user = authService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Token invalid',
      message: 'Token-ul de autentificare este invalid sau a expirat'
    });
  }
}

/**
 * Middleware opțional pentru autentificare (nu returnează eroare dacă nu există token)
 */
export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const user = authService.verifyToken(token);
      req.user = user;
    } catch (error) {
      // Ignoră eroarea pentru middleware-ul opțional
    }
  }

  next();
}
