import { Router, Request, Response } from 'express';
import { authService } from '../services/authService';
import { setAuthCookies, clearAuthCookies, readRefreshToken } from '../utils/cookieUtils';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       required: [id, email]
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/UserDTO'
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         headers:
 *           Set-Cookie:
 *             description: Access and refresh tokens set as HTTP-only cookies
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const result = await authService.register({ email, password, name });
    
    // Setează cookie-urile
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

    res.status(201).json({
      user: result.user
    });
  } catch (error: any) {
    if (error.message === 'Email already exists') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: Access and refresh tokens set as HTTP-only cookies
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await authService.login({ email, password });
    
    // Setează cookie-urile
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

    res.json({
      user: result.user
    });
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             description: New access and refresh tokens set as HTTP-only cookies
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = readRefreshToken(req);

    if (!refreshToken) {
      // Șterge cookie-urile pentru siguranță
      clearAuthCookies(res);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip || req.connection.remoteAddress;

    const result = await authService.rotateRefreshToken(refreshToken, userAgent, ipAddress);
    
    // Setează cookie-urile noi
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

    res.json({
      user: result.user
    });
  } catch (error: any) {
    // Șterge cookie-urile pentru siguranță
    clearAuthCookies(res);
    console.error('Refresh error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Support GET /refresh to address clients calling via GET
router.get('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = readRefreshToken(req);

    if (!refreshToken) {
      // Șterge cookie-urile pentru siguranță
      clearAuthCookies(res);
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip || (req.connection && req.connection.remoteAddress);

    const result = await authService.rotateRefreshToken(refreshToken, userAgent, ipAddress);

    // Setează cookie-urile noi
    setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken);

    res.json({
      user: result.user
    });
  } catch (error: any) {
    // Șterge cookie-urile pentru siguranță
    clearAuthCookies(res);
    console.error('Refresh (GET) error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Returnează utilizatorul autentificat
 *     tags: [Auth]
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
 */
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *         headers:
 *           Set-Cookie:
 *             description: Access and refresh tokens cleared
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
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