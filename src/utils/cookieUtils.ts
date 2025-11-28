import { Request, Response } from 'express';
import { config } from '../config';

/**
 * Citește access token din cookie
 */
export function readAccessToken(req: Request): string | null {
  return req.cookies?.access_token || null;
}

/**
 * Citește refresh token din cookie
 */
export function readRefreshToken(req: Request): string | null {
  return req.cookies?.refresh_token || null;
}

/**
 * Setează cookie-urile pentru access și refresh token
 */
export function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  const isLocalhost = !config.cookieDomain || config.cookieDomain === 'localhost' || /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(config.cookieDomain);

  // Access token cookie - path: "/"
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: config.cookieSameSite === 'none' ? true : config.cookieSecure, // SameSite=None necesită Secure
    sameSite: config.cookieSameSite,
    maxAge: config.accessTokenTtlSeconds * 1000,
    ...(isLocalhost ? {} : { domain: config.cookieDomain }),
    path: '/',
  });

  // Refresh token cookie - path: "/" pentru a funcționa pe /api/auth și /auth
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: config.cookieSameSite === 'none' ? true : config.cookieSecure,
    sameSite: config.cookieSameSite,
    maxAge: config.refreshTokenTtlSeconds * 1000,
    ...(isLocalhost ? {} : { domain: config.cookieDomain }),
    path: '/',
  });
}

/**
 * Șterge cookie-urile de autentificare
 */
export function clearAuthCookies(res: Response): void {
  const isLocalhost = !config.cookieDomain || config.cookieDomain === 'localhost' || /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(config.cookieDomain);
  // Clear access token cookie
  res.cookie('access_token', '', {
    httpOnly: true,
    secure: config.cookieSameSite === 'none' ? true : config.cookieSecure,
    sameSite: config.cookieSameSite,
    maxAge: 0,
    ...(isLocalhost ? {} : { domain: config.cookieDomain }),
    path: '/'
  });

  // Clear refresh token cookie (calea /)
  res.cookie('refresh_token', '', {
    httpOnly: true,
    secure: config.cookieSameSite === 'none' ? true : config.cookieSecure,
    sameSite: config.cookieSameSite,
    maxAge: 0,
    ...(isLocalhost ? {} : { domain: config.cookieDomain }),
    path: '/'
  });
}
