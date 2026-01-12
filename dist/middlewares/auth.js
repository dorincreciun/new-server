"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.optionalAuth = optionalAuth;
const service_1 = require("../modules/auth/service");
const cookieUtils_1 = require("../utils/cookieUtils");
const errors_1 = require("../shared/http/errors");
/**
 * Middleware pentru autentificare JWT din cookie sau Authorization header
 */
function authMiddleware(req, res, next) {
    try {
        // 1) Încearcă Authorization: Bearer <token>
        const authHeader = req.get('authorization') || req.get('Authorization');
        const bearerMatch = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring('Bearer '.length).trim()
            : '';
        // 2) Fallback: cookie http-only
        const cookieToken = (0, cookieUtils_1.readAccessToken)(req);
        const token = bearerMatch || cookieToken || '';
        if (!token) {
            throw new errors_1.UnauthorizedError('Token de acces necesar');
        }
        // Verify token
        const user = service_1.authService.verifyAccessToken(token);
        req.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
}
/**
 * Optional auth middleware - adaugă user dacă există token, dar nu eșuează dacă nu există
 */
function optionalAuth(req, res, next) {
    try {
        const authHeader = req.get('authorization') || req.get('Authorization');
        const bearerMatch = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring('Bearer '.length).trim()
            : '';
        const cookieToken = (0, cookieUtils_1.readAccessToken)(req);
        const token = bearerMatch || cookieToken || '';
        if (token) {
            const user = service_1.authService.verifyAccessToken(token);
            req.user = user;
        }
        next();
    }
    catch (error) {
        // Ignore errors for optional auth
        next();
    }
}
//# sourceMappingURL=auth.js.map