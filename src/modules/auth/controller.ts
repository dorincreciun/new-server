import { Request, Response, NextFunction } from 'express';
import { authService } from './service';
import { sendSuccess } from '../../shared/http/response';
import { setAuthCookies, clearAuthCookies, readRefreshToken } from '../../utils/cookieUtils';
import { UnauthorizedError } from '../../shared/http/errors';
import { paths } from '../../docs/schema';

export class AuthController {
  async register(
    req: Request<any, any, paths['/auth/register']['post']['requestBody']['content']['application/json']>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { user, tokens } = await authService.register(req.body);
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
      return sendSuccess(res, user, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  async login(
    req: Request<any, any, paths['/auth/login']['post']['requestBody']['content']['application/json']>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { user, tokens } = await authService.login(req.body);
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
      return sendSuccess(res, user, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = readRefreshToken(req);
      if (!refreshToken) throw new UnauthorizedError('Refresh token missing');

      const { user, tokens } = await authService.rotateRefreshToken(refreshToken);
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
      return sendSuccess(res, user, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      // Utilizatorul ar trebui să fie deja atașat de middleware-ul de auth
      if (!(req as any).user) throw new UnauthorizedError();
      return sendSuccess(res, (req as any).user, 'Current user');
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (user) {
        await authService.logout(user.id);
      }
      clearAuthCookies(res);
      return sendSuccess(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
