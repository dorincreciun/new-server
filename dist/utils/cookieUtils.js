"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAccessToken = readAccessToken;
exports.readRefreshToken = readRefreshToken;
exports.setAuthCookies = setAuthCookies;
exports.clearAuthCookies = clearAuthCookies;
const config_1 = require("../config");
/**
 * Citește access token din cookie
 */
function readAccessToken(req) {
    return req.cookies?.access_token || null;
}
/**
 * Citește refresh token din cookie
 */
function readRefreshToken(req) {
    return req.cookies?.refresh_token || null;
}
/**
 * Setează cookie-urile pentru access și refresh token
 */
function setAuthCookies(res, accessToken, refreshToken) {
    const isLocalhost = !config_1.config.cookieDomain || config_1.config.cookieDomain === 'localhost' || /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(config_1.config.cookieDomain);
    // Access token cookie - path: "/"
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: config_1.config.cookieSameSite === 'none' ? true : config_1.config.cookieSecure, // SameSite=None necesită Secure
        sameSite: config_1.config.cookieSameSite,
        maxAge: config_1.config.accessTokenTtlSeconds * 1000,
        ...(isLocalhost ? {} : { domain: config_1.config.cookieDomain }),
        path: '/',
    });
    // Refresh token cookie - path: "/" pentru a funcționa pe /api/auth și /auth
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: config_1.config.cookieSameSite === 'none' ? true : config_1.config.cookieSecure,
        sameSite: config_1.config.cookieSameSite,
        maxAge: config_1.config.refreshTokenTtlSeconds * 1000,
        ...(isLocalhost ? {} : { domain: config_1.config.cookieDomain }),
        path: '/',
    });
}
/**
 * Șterge cookie-urile de autentificare
 */
function clearAuthCookies(res) {
    const isLocalhost = !config_1.config.cookieDomain || config_1.config.cookieDomain === 'localhost' || /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(config_1.config.cookieDomain);
    // Clear access token cookie
    res.cookie('access_token', '', {
        httpOnly: true,
        secure: config_1.config.cookieSameSite === 'none' ? true : config_1.config.cookieSecure,
        sameSite: config_1.config.cookieSameSite,
        maxAge: 0,
        ...(isLocalhost ? {} : { domain: config_1.config.cookieDomain }),
        path: '/'
    });
    // Clear refresh token cookie (calea /)
    res.cookie('refresh_token', '', {
        httpOnly: true,
        secure: config_1.config.cookieSameSite === 'none' ? true : config_1.config.cookieSecure,
        sameSite: config_1.config.cookieSameSite,
        maxAge: 0,
        ...(isLocalhost ? {} : { domain: config_1.config.cookieDomain }),
        path: '/'
    });
}
//# sourceMappingURL=cookieUtils.js.map