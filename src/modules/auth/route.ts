import { Router } from 'express';
import { authController } from './controller';
import { validate } from '../../shared/middleware/validate';
import { registerSchema, loginSchema } from './dto';
import { authMiddleware } from '../../shared/middleware/auth';

const router = Router();

router.post('/register', validate({ body: registerSchema }), authController.register);
router.post('/login', validate({ body: loginSchema }), authController.login);
router.post('/refresh', authController.refresh);
router.get('/me', authMiddleware, authController.me);
router.post('/logout', authMiddleware, authController.logout);

export default router;
