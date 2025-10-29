import { Request, Response, NextFunction } from 'express';
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
export declare function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Middleware opțional pentru autentificare (nu returnează eroare dacă nu există token)
 */
export declare function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map