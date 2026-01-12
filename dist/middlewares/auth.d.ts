import { Request, Response, NextFunction } from 'express';
import { UserPayload } from '../modules/auth/service';
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
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): void;
/**
 * Optional auth middleware - adaugă user dacă există token, dar nu eșuează dacă nu există
 */
export declare function optionalAuth(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map