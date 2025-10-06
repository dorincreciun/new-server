import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
  name: string;
  password: string;
}

export class AuthService {
  /**
   * Înregistrează un utilizator nou
   */
  async register(data: RegisterData): Promise<{ user: UserPayload; token: string }> {
    const { email, name, password } = data;

    // Verifică dacă utilizatorul există deja
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Utilizatorul cu această adresă de email există deja');
    }

    // Criptează parola
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Creează utilizatorul
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      }
    });

    // Generează token JWT
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      name: user.name
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    };
  }

  /**
   * Autentifică un utilizator existent
   */
  async login(credentials: LoginCredentials): Promise<{ user: UserPayload; token: string }> {
    const { email, password } = credentials;

    // Găsește utilizatorul
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Credențiale invalide');
    }

    // Verifică parola
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credențiale invalide');
    }

    // Generează token JWT
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      name: user.name
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    };
  }

  /**
   * Verifică și decodează un token JWT
   */
  verifyToken(token: string): UserPayload {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as UserPayload;
      return decoded;
    } catch (error) {
      throw new Error('Token invalid sau expirat');
    }
  }

  /**
   * Generează un token JWT pentru un utilizator
   */
  private generateToken(payload: UserPayload): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn
    } as jwt.SignOptions);
  }
}

export const authService = new AuthService();
