"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const argon2_1 = __importDefault(require("argon2"));
const crypto_1 = require("crypto");
const client_1 = __importDefault(require("../../shared/prisma/client"));
const config_1 = require("../../config");
const errors_1 = require("../../shared/http/errors");
class AuthService {
    async register(data) {
        const { email, name, password } = data;
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await client_1.default.user.findUnique({
            where: { email: normalizedEmail }
        });
        if (existingUser) {
            throw new errors_1.ConflictError('Contul cu acest email există deja');
        }
        const hashedPassword = await argon2_1.default.hash(password);
        const user = await client_1.default.user.create({
            data: {
                email: normalizedEmail,
                name: name || null,
                passwordHash: hashedPassword,
            }
        });
        const tokens = await this.generateTokenPair(user.id);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name || ''
            },
            tokens
        };
    }
    async login(credentials) {
        const { email, password } = credentials;
        const normalizedEmail = email.trim().toLowerCase();
        const user = await client_1.default.user.findUnique({
            where: { email: normalizedEmail }
        });
        if (!user) {
            throw new errors_1.UnauthorizedError('Email sau parolă incorectă');
        }
        const isPasswordValid = await argon2_1.default.verify(user.passwordHash, password);
        if (!isPasswordValid) {
            throw new errors_1.UnauthorizedError('Email sau parolă incorectă');
        }
        const tokens = await this.generateTokenPair(user.id);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name || ''
            },
            tokens
        };
    }
    async rotateRefreshToken(refreshToken) {
        let payload;
        try {
            payload = jwt.verify(refreshToken, config_1.config.jwtRefreshSecret);
        }
        catch (e) {
            throw new errors_1.UnauthorizedError('Refresh token invalid sau expirat');
        }
        const { sub: userId, jti } = payload;
        const tokenRecord = await client_1.default.refreshToken.findUnique({
            where: { jti },
            include: { user: true }
        });
        if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
            throw new errors_1.UnauthorizedError('Refresh token invalid sau expirat');
        }
        // Revocă token-ul vechi
        await client_1.default.refreshToken.update({
            where: { id: tokenRecord.id },
            data: { revokedAt: new Date() }
        });
        // Generăm noi tokenuri
        const tokens = await this.generateTokenPair(userId);
        return {
            user: {
                id: tokenRecord.user.id,
                email: tokenRecord.user.email,
                name: tokenRecord.user.name || ''
            },
            tokens
        };
    }
    async logout(userId) {
        await this.revokeAllRefreshTokens(userId);
    }
    async revokeAllRefreshTokens(userId) {
        await client_1.default.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() }
        });
    }
    async generateTokenPair(userId) {
        const user = await client_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new errors_1.NotFoundError('Utilizatorul nu a fost găsit');
        const accessToken = jwt.sign({ sub: user.id, email: user.email, name: user.name || '' }, config_1.config.jwtAccessSecret, { expiresIn: config_1.config.accessTokenTtlSeconds });
        const jti = (0, crypto_1.randomUUID)();
        const refreshToken = jwt.sign({ sub: user.id, jti, type: 'refresh' }, config_1.config.jwtRefreshSecret, { expiresIn: config_1.config.refreshTokenTtlSeconds });
        // Stocăm JTI pentru revocare/rotație
        await client_1.default.refreshToken.create({
            data: {
                userId: user.id,
                jti,
                tokenHash: '', // Putem lăsa gol dacă folosim JTI validation, sau putem pune hash-ul JWT
                expiresAt: new Date(Date.now() + config_1.config.refreshTokenTtlSeconds * 1000),
            }
        });
        return { accessToken, refreshToken };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=service.js.map