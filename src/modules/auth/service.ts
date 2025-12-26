import * as jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { randomUUID } from 'crypto';
import prisma from '../../shared/prisma/client';
import { config } from '../../config';
import { RegisterInput, LoginInput } from './dto';
import { UnauthorizedError, ConflictError, NotFoundError } from '../../shared/http/errors';

export interface UserPayload {
  id: number;
  email: string;
  name: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  async register(data: RegisterInput): Promise<{ user: UserPayload; tokens: TokenPair }> {
    const { email, name, password } = data;
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      throw new ConflictError('Contul cu acest email există deja');
    }

    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
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

  async login(credentials: LoginInput): Promise<{ user: UserPayload; tokens: TokenPair }> {
    const { email, password } = credentials;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      throw new UnauthorizedError('Email sau parolă incorectă');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Email sau parolă incorectă');
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

  async rotateRefreshToken(refreshToken: string): Promise<{ user: UserPayload; tokens: TokenPair }> {
    let payload: any;
    try {
      payload = jwt.verify(refreshToken, config.jwtRefreshSecret);
    } catch (e) {
      throw new UnauthorizedError('Refresh token invalid sau expirat');
    }

    const { sub: userId, jti } = payload;

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { jti },
      include: { user: true }
    });

    if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token invalid sau expirat');
    }

    // Revocă token-ul vechi
    await prisma.refreshToken.update({
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

  async logout(userId: number): Promise<void> {
    await this.revokeAllRefreshTokens(userId);
  }

  async revokeAllRefreshTokens(userId: number): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }

  private async generateTokenPair(userId: number): Promise<TokenPair> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundError('Utilizatorul nu a fost găsit');

    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, name: user.name || '' },
      config.jwtAccessSecret,
      { expiresIn: config.accessTokenTtlSeconds }
    );

    const jti = randomUUID();
    const refreshToken = jwt.sign(
      { sub: user.id, jti, type: 'refresh' },
      config.jwtRefreshSecret,
      { expiresIn: config.refreshTokenTtlSeconds }
    );

    // Stocăm JTI pentru revocare/rotație
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        jti,
        tokenHash: '', // Putem lăsa gol dacă folosim JTI validation, sau putem pune hash-ul JWT
        expiresAt: new Date(Date.now() + config.refreshTokenTtlSeconds * 1000),
      }
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
