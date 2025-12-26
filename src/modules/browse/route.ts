import { Router } from 'express';
import { browseController } from './controller';
import { validate } from '../../shared/middleware/validate';
import { browseProductsSchema, browseFiltersSchema } from './dto';

const router = Router();

router.get('/products', validate({ query: browseProductsSchema }), browseController.getProducts);
router.get('/filters', validate({ query: browseFiltersSchema }), browseController.getFilters);

export default router;
