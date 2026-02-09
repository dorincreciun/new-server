import { Router } from 'express';
import { browseController } from './controller';
import { validate } from '../../shared/middleware/validate';
import { browseProductsSchema, searchProductsSchema } from './dto';

const router = Router();

// Endpoint pentru filtrare produse
router.get('/products', validate({ query: browseProductsSchema }), browseController.getProducts);

// Endpoint separat pentru căutare
router.get('/search', validate({ query: searchProductsSchema }), browseController.searchProducts);

export default router;
