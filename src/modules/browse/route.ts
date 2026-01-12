import { Router } from 'express';
import { browseController } from './controller';
import { validate } from '../../shared/middleware/validate';
import { browseProductsSchema, browseFiltersSchema, searchSuggestSchema } from './dto';

const router = Router();

router.get('/products', validate({ query: browseProductsSchema }), browseController.getProducts);
router.get('/filters', validate({ query: browseFiltersSchema }), browseController.getFilters);
router.get('/suggest', validate({ query: searchSuggestSchema }), browseController.getSuggestions);

export default router;
