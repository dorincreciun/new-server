import { Router } from 'express';
import { browseController } from './controller';
import { validate } from '../../shared/middleware/validate';
import { browseProductsSchema } from './dto';

const router = Router();

// Endpoint unic: listează produsele + filtrele aferente (flags, ingredients, doughTypes, sizeOptions, price)
router.get('/products', validate({ query: browseProductsSchema }), browseController.getProducts);

export default router;
