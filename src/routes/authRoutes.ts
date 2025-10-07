import { Router } from 'express';
import authRouter from './auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operațiuni de autentificare și gestionare utilizatori cu cookie-uri HTTP-Only
 */

// Folosește rutele de autentificare cu cookie-uri
router.use('/', authRouter);

export { router as authRoutes };
