"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.optionalAuth = optionalAuth;
const authService_1 = require("../services/authService");
const cookieUtils_1 = require("../utils/cookieUtils");
/**
 * Middleware pentru autentificare JWT din cookie
 */
function authenticateToken(req, res, next) {
    // 1) Încearcă Authorization: Bearer <token>
    const authHeader = req.get('authorization') || req.get('Authorization');
    const bearerMatch = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring('Bearer '.length).trim()
        : '';
    // 2) Fallback: cookie http-only
    const cookieToken = (0, cookieUtils_1.readAccessToken)(req);
    const token = bearerMatch || cookieToken || '';
    if (!token) {
        return res.status(401).json({
            error: 'Token de acces necesar'
        });
    }
    try {
        const user = authService_1.authService.verifyAccessToken(token);
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(403).json({
            error: 'Token invalid'
        });
    }
}
/**
 * Middleware opțional pentru autentificare (nu returnează eroare dacă nu există token)
 */
function optionalAuth(req, res, next) {
    const authHeader = req.get('authorization') || req.get('Authorization');
    const bearerMatch = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring('Bearer '.length).trim()
        : '';
    const token = bearerMatch || (0, cookieUtils_1.readAccessToken)(req);
    if (token) {
        try {
            const user = authService_1.authService.verifyAccessToken(token);
            req.user = user;
        }
        catch (error) {
            // Ignoră eroarea pentru middleware-ul opțional
        }
    }
    next();
}
//# sourceMappingURL=auth.js.map