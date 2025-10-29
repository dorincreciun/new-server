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
    const token = (0, cookieUtils_1.readAccessToken)(req);
    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    try {
        const user = authService_1.authService.verifyAccessToken(token);
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
}
/**
 * Middleware opțional pentru autentificare (nu returnează eroare dacă nu există token)
 */
function optionalAuth(req, res, next) {
    const token = (0, cookieUtils_1.readAccessToken)(req);
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