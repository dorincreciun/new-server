"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const service_1 = require("./service");
const response_1 = require("../../shared/http/response");
const cookieUtils_1 = require("../../utils/cookieUtils");
const errors_1 = require("../../shared/http/errors");
class AuthController {
    async register(req, res, next) {
        try {
            const { user, tokens } = await service_1.authService.register(req.body);
            (0, cookieUtils_1.setAuthCookies)(res, tokens.accessToken, tokens.refreshToken);
            return (0, response_1.sendSuccess)(res, user, 'Registration successful', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { user, tokens } = await service_1.authService.login(req.body);
            (0, cookieUtils_1.setAuthCookies)(res, tokens.accessToken, tokens.refreshToken);
            return (0, response_1.sendSuccess)(res, user, 'Login successful');
        }
        catch (error) {
            next(error);
        }
    }
    async refresh(req, res, next) {
        try {
            const refreshToken = (0, cookieUtils_1.readRefreshToken)(req);
            if (!refreshToken)
                throw new errors_1.UnauthorizedError('Refresh token missing');
            const { user, tokens } = await service_1.authService.rotateRefreshToken(refreshToken);
            (0, cookieUtils_1.setAuthCookies)(res, tokens.accessToken, tokens.refreshToken);
            return (0, response_1.sendSuccess)(res, user, 'Token refreshed');
        }
        catch (error) {
            next(error);
        }
    }
    async me(req, res, next) {
        try {
            const user = req.user;
            if (!user)
                throw new errors_1.UnauthorizedError();
            return (0, response_1.sendSuccess)(res, user, 'Current user');
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const user = req.user;
            if (user) {
                await service_1.authService.logout(user.id);
            }
            (0, cookieUtils_1.clearAuthCookies)(res);
            return (0, response_1.sendSuccess)(res, null, 'Logout successful');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=controller.js.map