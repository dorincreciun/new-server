import { Request, Response } from 'express';
/**
 * Citește access token din cookie
 */
export declare function readAccessToken(req: Request): string | null;
/**
 * Citește refresh token din cookie
 */
export declare function readRefreshToken(req: Request): string | null;
/**
 * Setează cookie-urile pentru access și refresh token
 */
export declare function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void;
/**
 * Șterge cookie-urile de autentificare
 */
export declare function clearAuthCookies(res: Response): void;
//# sourceMappingURL=cookieUtils.d.ts.map