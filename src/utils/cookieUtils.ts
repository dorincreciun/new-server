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
  // Access token cookie - path: "/"
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
    maxAge: config.accessTokenTtlSeconds * 1000,
    domain: config.cookieDomain,
    path: '/'
  });

  // Refresh token cookie - path: "/auth"
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
    maxAge: config.refreshTokenTtlSeconds * 1000,
    domain: config.cookieDomain,
    path: '/auth'
  });
}

/**
 * Șterge cookie-urile de autentificare
 */
export function clearAuthCookies(res: Response): void {
  // Clear access token cookie
  res.cookie('access_token', '', {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
    maxAge: 0,
    domain: config.cookieDomain,
    path: '/'
  });

  // Clear refresh token cookie
  res.cookie('refresh_token', '', {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: config.cookieSameSite,
    maxAge: 0,
    domain: config.cookieDomain,
    path: '/auth'
  });
}
