import { Router } from 'express';
import { orderController } from './controller';
import { authMiddleware } from '../../middlewares/auth';
import { validate } from '../../shared/middleware/validate';
import { checkoutSchema, getOrdersSchema } from './dto';

const router = Router();

// Toate rutele necesită autentificare
router.use(authMiddleware);

// POST /api/checkout
router.post('/checkout', validate({ body: checkoutSchema }), orderController.checkout);

// GET /api/orders
router.get('/orders', validate({ query: getOrdersSchema }), orderController.getOrders);

// GET /api/orders/:id
router.get('/orders/:id', orderController.getOrderDetails);

export default router;
