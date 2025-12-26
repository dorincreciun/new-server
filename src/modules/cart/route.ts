import { Router } from 'express';
import { cartController } from './controller';
import { authMiddleware } from '../../middlewares/auth';
import { validate } from '../../shared/middleware/validate';
import { addToCartSchema, updateCartItemSchema } from './dto';

const router = Router();

router.use(authMiddleware);

router.get('/', cartController.getCart);
router.delete('/', cartController.clearCart);
router.post('/items', validate({ body: addToCartSchema }), cartController.addItem);
router.patch('/items/:itemId', validate({ body: updateCartItemSchema }), cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);

export default router;
