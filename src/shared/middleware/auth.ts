import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../../config';
import { UnauthorizedError } from '../http/errors';
import { readAccessToken } from '../../utils/cookieUtils';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = readAccessToken(req);

  if (!token) {
    return next(new UnauthorizedError('Access token lipsă'));
  }

  try {
    const decoded = jwt.verify(token, config.jwtAccessSecret) as any;
    (req as any).user = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch (error) {
    return next(new UnauthorizedError('Access token invalid sau expirat'));
  }
};
