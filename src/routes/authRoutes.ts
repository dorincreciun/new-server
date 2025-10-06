import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autentificare
 *   description: Operațiuni de autentificare și gestionare utilizatori
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Rute publice
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

// Rute protejate
router.get('/me', authenticateToken, authController.getProfile.bind(authController));
router.post('/logout', authenticateToken, authController.logout.bind(authController));

export { router as authRoutes };
