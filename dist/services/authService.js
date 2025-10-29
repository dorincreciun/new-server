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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const prisma = new client_1.PrismaClient();
class AuthService {
    /**
     * Înregistrează un utilizator nou
     */
    async register(data) {
        const { email, name, password } = data;
        // Normalizează email-ul (trim + lowercase)
        const normalizedEmail = email.trim().toLowerCase();
        // Verifică dacă utilizatorul există deja
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });
        if (existingUser) {
            throw new Error('Contul cu acest email există deja');
        }
        // Criptează parola
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        // Creează utilizatorul
        const user = await prisma.user.create({
            data: {
                email: normalizedEmail,
                name: name || null,
                passwordHash: hashedPassword,
            }
        });
        // Generează tokenuri
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
    /**
     * Autentifică un utilizator existent
     */
    async login(credentials) {
        const { email, password } = credentials;
        // Normalizează email-ul (trim + lowercase)
        const normalizedEmail = email.trim().toLowerCase();
        // Găsește utilizatorul
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });
        if (!user) {
            throw new Error('Acest cont nu există');
        }
        // Verifică parola
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Parola incorectă');
        }
        // Generează tokenuri
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
    /**
     * Verifică și decodează un access token JWT
     */
    verifyAccessToken(token) {
        try {
            const decoded = jwt.verify(token, config_1.config.jwtAccessSecret);
            return {
                id: decoded.sub,
                email: decoded.email,
                name: decoded.name
            };
        }
        catch (error) {
            throw new Error('Token invalid sau expirat');
        }
    }
    /**
     * Verifică și decodează un refresh token JWT
     */
    verifyRefreshToken(token) {
        try {
            const decoded = jwt.verify(token, config_1.config.jwtRefreshSecret);
            return {
                sub: decoded.sub,
                jti: decoded.jti
            };
        }
        catch (error) {
            throw new Error('Refresh token invalid sau expirat');
        }
    }
    /**
     * Rotește refresh token-ul și returnează un nou set de tokenuri
     */
    async rotateRefreshToken(refreshToken, userAgent, ipAddress) {
        // Verifică refresh token-ul
        const { sub: userId, jti } = this.verifyRefreshToken(refreshToken);
        // Găsește refresh token-ul în baza de date
        const tokenRecord = await prisma.refreshToken.findUnique({
            where: { jti },
            include: { user: true }
        });
        if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
            throw new Error('Refresh token invalid sau expirat');
        }
        // Verifică binding-ul opțional (userAgent/IP)
        if (userAgent && tokenRecord.userAgent && tokenRecord.userAgent !== userAgent) {
            throw new Error('Refresh token compromis - userAgent mismatch');
        }
        if (ipAddress && tokenRecord.ipAddress && tokenRecord.ipAddress !== ipAddress) {
            throw new Error('Refresh token compromis - IP mismatch');
        }
        // Revocă refresh token-ul curent
        await prisma.refreshToken.update({
            where: { id: tokenRecord.id },
            data: { revokedAt: new Date() }
        });
        // Generează noi tokenuri
        const tokens = await this.generateTokenPair(userId, userAgent, ipAddress);
        return {
            user: {
                id: tokenRecord.user.id,
                email: tokenRecord.user.email,
                name: tokenRecord.user.name || ''
            },
            tokens
        };
    }
    /**
     * Revocă toate refresh token-urile pentru un utilizator
     */
    async revokeAllRefreshTokens(userId) {
        await prisma.refreshToken.updateMany({
            where: {
                userId,
                revokedAt: null
            },
            data: {
                revokedAt: new Date()
            }
        });
    }
    /**
     * Generează un pair de tokenuri (access + refresh)
     */
    async generateTokenPair(userId, userAgent, ipAddress) {
        // Găsește utilizatorul
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new Error('Utilizatorul nu a fost găsit');
        }
        // Generează access token
        const accessToken = jwt.sign({
            sub: user.id,
            email: user.email,
            name: user.name || ''
        }, config_1.config.jwtAccessSecret, {
            expiresIn: config_1.config.accessTokenTtlSeconds
        });
        // Generează refresh token cu JTI unic
        const jti = (0, crypto_1.randomUUID)();
        const refreshToken = jwt.sign({
            sub: user.id,
            jti,
            type: 'refresh'
        }, config_1.config.jwtRefreshSecret, {
            expiresIn: config_1.config.refreshTokenTtlSeconds
        });
        // Salvează refresh token-ul în baza de date (hash)
        const tokenHash = await bcryptjs_1.default.hash(refreshToken, 12);
        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                jti,
                tokenHash,
                expiresAt: new Date(Date.now() + config_1.config.refreshTokenTtlSeconds * 1000),
                userAgent: userAgent || null,
                ipAddress: ipAddress || null
            }
        });
        return {
            accessToken,
            refreshToken
        };
    }
    /**
     * Verifică dacă un refresh token este valid în baza de date
     */
    async validateRefreshToken(refreshToken) {
        try {
            const { jti } = this.verifyRefreshToken(refreshToken);
            const tokenRecord = await prisma.refreshToken.findUnique({
                where: { jti }
            });
            if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
                return false;
            }
            // Verifică hash-ul token-ului
            const isTokenValid = await bcryptjs_1.default.compare(refreshToken, tokenRecord.tokenHash);
            return isTokenValid;
        }
        catch (error) {
            return false;
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=authService.js.map