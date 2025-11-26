import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';

const prisma = new PrismaClient();

export interface UserPayload {
  id: number;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name?: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Înregistrează un utilizator nou
   */
  async register(data: RegisterData): Promise<{ user: UserPayload; tokens: TokenPair }> {
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
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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
  async login(credentials: LoginCredentials): Promise<{ user: UserPayload; tokens: TokenPair }> {
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
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
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
  verifyAccessToken(token: string): UserPayload {
    try {
      const decoded = jwt.verify(token, config.jwtAccessSecret) as any;
      return {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name
      };
    } catch (error) {
      throw new Error('Token invalid sau expirat');
    }
  }

  /**
   * Verifică și decodează un refresh token JWT
   */
  verifyRefreshToken(token: string): { sub: number; jti: string } {
    try {
      const decoded = jwt.verify(token, config.jwtRefreshSecret) as any;
      return {
        sub: decoded.sub,
        jti: decoded.jti
      };
    } catch (error) {
      throw new Error('Refresh token invalid sau expirat');
    }
  }

  /**
   * Rotește refresh token-ul și returnează un nou set de tokenuri
   */
  async rotateRefreshToken(refreshToken: string, userAgent?: string, ipAddress?: string): Promise<{ user: UserPayload; tokens: TokenPair }> {
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

    // Verifică hash-ul tokenului trimis față de cel stocat
    const tokenMatches = await bcrypt.compare(refreshToken, tokenRecord.tokenHash);
    if (!tokenMatches) {
      throw new Error('Refresh token invalid');
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
  async revokeAllRefreshTokens(userId: number): Promise<void> {
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
  private async generateTokenPair(userId: number, userAgent?: string, ipAddress?: string): Promise<TokenPair> {
    // Găsește utilizatorul
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Utilizatorul nu a fost găsit');
    }

    // Generează access token
    const accessToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        name: user.name || ''
      },
      config.jwtAccessSecret,
      {
        expiresIn: config.accessTokenTtlSeconds
      }
    );

    // Generează refresh token cu JTI unic
    const jti = randomUUID();
    const refreshToken = jwt.sign(
      {
        sub: user.id,
        jti,
        type: 'refresh'
      },
      config.jwtRefreshSecret,
      {
        expiresIn: config.refreshTokenTtlSeconds
      }
    );

    // Salvează refresh token-ul în baza de date (hash)
    const tokenHash = await bcrypt.hash(refreshToken, 12);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        jti,
        tokenHash,
        expiresAt: new Date(Date.now() + config.refreshTokenTtlSeconds * 1000),
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
  async validateRefreshToken(refreshToken: string): Promise<boolean> {
    try {
      const { jti } = this.verifyRefreshToken(refreshToken);
      
      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { jti }
      });

      if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
        return false;
      }

      // Verifică hash-ul token-ului
      const isTokenValid = await bcrypt.compare(refreshToken, tokenRecord.tokenHash);
      return isTokenValid;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();