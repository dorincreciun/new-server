import { Router } from 'express';
import { TaxonomyController } from '../controllers/taxonomyController';

const router = Router();
const controller = new TaxonomyController();

// TODO: protejează cu roluri admin/moderator când se activează RBAC

/**
 * @swagger
 * tags:
 *   name: Taxonomies
 *   description: Cataloge pentru ingrediente, flaguri și opțiuni de variante (fără permisiuni temporar)
 */

/**
 * @swagger
 * /taxonomies/ingredients:
 *   get:
 *     summary: Listează ingredientele
 *     tags: [Taxonomies]
 *   post:
 *     summary: Creează un ingredient
 *     tags: [Taxonomies]
 */
// Ingredients
router.get('/ingredients', (req, res) => controller.listIngredients(req, res));
router.post('/ingredients', (req, res) => controller.createIngredient(req, res));
router.put('/ingredients/:id', (req, res) => controller.updateIngredient(req, res));
router.delete('/ingredients/:id', (req, res) => controller.deleteIngredient(req, res));

/**
 * @swagger
 * /taxonomies/flags:
 *   get:
 *     summary: Listează flagurile
 *     tags: [Taxonomies]
 *   post:
 *     summary: Creează un flag
 *     tags: [Taxonomies]
 */
// Flags
router.get('/flags', (req, res) => controller.listFlags(req, res));
router.post('/flags', (req, res) => controller.createFlag(req, res));
router.put('/flags/:id', (req, res) => controller.updateFlag(req, res));
router.delete('/flags/:id', (req, res) => controller.deleteFlag(req, res));

/**
 * @swagger
 * /taxonomies/variants:
 *   get:
 *     summary: Listează opțiunile de variante
 *     tags: [Taxonomies]
 *   post:
 *     summary: Creează o opțiune de variantă
 *     tags: [Taxonomies]
 */
// Variant Options
router.get('/variants', (req, res) => controller.listVariantOptions(req, res));
router.post('/variants', (req, res) => controller.createVariantOption(req, res));
router.put('/variants/:id', (req, res) => controller.updateVariantOption(req, res));
router.delete('/variants/:id', (req, res) => controller.deleteVariantOption(req, res));

export { router as taxonomyRoutes };


