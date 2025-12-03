import { Router, Request, Response } from 'express';
import { authService, UserPayload } from '../services/authService';
import { setAuthCookies, clearAuthCookies, readRefreshToken } from '../utils/cookieUtils';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

type AuthSuccessResponse = {
  message: string;
  user: UserPayload;
};

type ValidationErrorDetail = {
  field: string;
  message: string;
};

function respondWithUser(res: Response, status: number, message: string, user: UserPayload): void {
  const payload: AuthSuccessResponse = { message, user };
  res.status(status).json(payload);
}

function respondWithValidationErrors(
  res: Response,
  status: number,
  details: ValidationErrorDetail[],
  message = 'Date invalide'
): Response {
  return res.status(status).json({ message, details });
}

function validatePassword(password: string): string[] {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Parola trebuie să aibă cel puțin 8 caractere');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Parola trebuie să conțină cel puțin o literă mică');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Parola trebuie să conțină cel puțin o literă mare');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Parola trebuie să conțină cel puțin o cifră');
  }
  if (!/[!@#$%^&*()[\]{}\-_=+;:'",.<>/?\\|`~]/.test(password)) {
    errors.push('Parola trebuie să conțină cel puțin un caracter special (ex: !,@,#,?)');
  }
  if (/\s/.test(password)) {
    errors.push('Parola nu trebuie să conțină spații');
  }

  return errors;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegisterPayload(body: unknown): { data?: { email: string; password: string; name?: string }; errors: ValidationErrorDetail[] } {
  const errors: ValidationErrorDetail[] = [];
  const payload = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;

  const rawEmail = typeof payload.email === 'string' ? payload.email.trim() : '';
  const normalizedEmail = rawEmail.toLowerCase();
  const password = typeof payload.password === 'string' ? payload.password : '';
  const hasNameField = Object.prototype.hasOwnProperty.call(payload, 'name');
  const rawName = typeof payload.name === 'string' ? payload.name.trim() : undefined;

  if (!rawEmail) {
    errors.push({ field: 'email', message: 'Emailul este obligatoriu' });
  } else if (!emailRegex.test(normalizedEmail)) {
    errors.push({ field: 'email', message: 'Adresa de email este invalidă' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Parola este obligatorie' });
  } else {
    const passwordErrors = validatePassword(password);
    passwordErrors.forEach((msg) => errors.push({ field: 'password', message: msg }));
  }

  if (hasNameField) {
    if (typeof payload.name !== 'string') {
      errors.push({ field: 'name', message: 'Numele trebuie să fie un șir de caractere' });
    } else if (!rawName) {
      errors.push({ field: 'name', message: 'Numele nu poate fi gol' });
    } else if (rawName.length > 120) {
      errors.push({ field: 'name', message: 'Numele poate avea cel mult 120 de caractere' });
    }
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      email: normalizedEmail,
      password,
      ...(rawName ? { name: rawName } : {})
    },
    errors
  };
}

function validateLoginPayload(body: unknown): { data?: { email: string; password: string }; errors: ValidationErrorDetail[] } {
  const errors: ValidationErrorDetail[] = [];
  const payload = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;

  const rawEmail = typeof payload.email === 'string' ? payload.email.trim() : '';
  const normalizedEmail = rawEmail.toLowerCase();
  const password = typeof payload.password === 'string' ? payload.password : '';

  if (!rawEmail) {
    errors.push({ field: 'email', message: 'Emailul este obligatoriu' });
  } else if (!emailRegex.test(normalizedEmail)) {
    errors.push({ field: 'email', message: 'Adresa de email este invalidă' });
  }

  if (!password) {
    errors.push({ field: 'password', message: 'Parola este obligatorie' });
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: {
      email: normalizedEmail,
      password
    },
    errors
  };
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       required:
 *         - id
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       required:
 *         - message
 *         - user
 *       properties:
 *         message:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/UserDTO'
 *     LogoutResponse:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *     AuthRegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *         name:
 *           type: string
 *     AuthLoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     Error:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 *   headers:
 *     SetCookieHeader:
 *       description: Header Set-Cookie care conține accesToken și refreshToken ca HTTP-only cookies
 *       schema:
 *         type: string
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         headers:
 *           Set-Cookie:
 *             $ref: '#/components/headers/SetCookieHeader'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input or account already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', async (req: Request, res: Response) => {
  const validation = validateRegisterPayload(req.body);
  if (validation.errors.length > 0 || !validation.data) {
    return respondWithValidationErrors(res, 400, validation.errors);
  }

  try {
    const { email, password, name } = validation.data;
    const result = await authService.register({ email, password, name: name ?? '' });
    
    // Setează cookie-urile
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

    respondWithUser(res, 201, 'Utilizator creat și autentificat', result.user);
  } catch (error: any) {
    if (error.message === 'Contul cu acest email există deja' || error.message === 'Email already exists') {
      return respondWithValidationErrors(res, 400, [{ field: 'email', message: 'Acest cont a fost deja înregistrat' }], 'Date invalide');
    }
    console.error('Register error:', error);
    res.status(500).json({ message: 'Eroare internă a serverului' });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             $ref: '#/components/headers/SetCookieHeader'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', async (req: Request, res: Response) => {
  const validation = validateLoginPayload(req.body);
  if (validation.errors.length > 0 || !validation.data) {
    return respondWithValidationErrors(res, 400, validation.errors);
  }

  try {
    const { email, password } = validation.data;
    const result = await authService.login({ email, password });
    
    // Setează cookie-urile
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

    respondWithUser(res, 200, 'Autentificare reușită', result.user);
  } catch (error: any) {
    if (error.message === 'Parola incorectă') {
      return respondWithValidationErrors(res, 401, [{ field: 'password', message: 'Parola incorectă' }], 'Autentificare eșuată');
    }
    if (error.message === 'Acest cont nu există') {
      return respondWithValidationErrors(res, 401, [{ field: 'email', message: 'Acest cont nu există' }], 'Autentificare eșuată');
    }
    console.error('Login error:', error);
    res.status(500).json({ message: 'Eroare internă a serverului' });
  }
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Reîmprospătează access token-ul folosind refresh token-ul din cookie
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Token nou generat
 *         headers:
 *           Set-Cookie:
 *             $ref: '#/components/headers/SetCookieHeader'
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Refresh token lipsă sau invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Eroare internă a serverului
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/refresh', async (req: Request, res: Response) => {
  const refreshToken = readRefreshToken(req);
  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const userAgent = req.get('user-agent') ?? undefined;
    const ipAddress = req.ip;
    const result = await authService.rotateRefreshToken(refreshToken, userAgent, ipAddress);
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);
    respondWithUser(res, 200, 'Token reîmprospătat', result.user);
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Returnează utilizatorul autentificat
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Reintrodus: GET /auth/me – returnează utilizatorul autentificat din access_token
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  respondWithUser(res, 200, 'Utilizator autentificat', req.user);
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logout successful
 *         headers:
 *           Set-Cookie:
 *             description: Cookies cleared (accessToken, refreshToken)
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const refreshToken = readRefreshToken(req);

    if (refreshToken) {
      try {
        const { sub: userId } = authService.verifyRefreshToken(refreshToken);
        // Revocă toate refresh token-urile pentru utilizator
        await authService.revokeAllRefreshTokens(userId);
      } catch (error) {
        // Ignoră eroarea - token-ul poate fi deja invalid
      }
    }

    // Șterge cookie-urile
    clearAuthCookies(res);

    res.json({ message: 'Logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    // Șterge cookie-urile oricum
    clearAuthCookies(res);
    res.json({ message: 'Logged out' });
  }
});

export default router;