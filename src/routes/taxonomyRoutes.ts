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
 * /taxonomies/dough-types:
 *   get:
 *     summary: Listează tipurile de aluat
 *     tags: [Taxonomies]
 *   post:
 *     summary: Creează un tip de aluat
 *     tags: [Taxonomies]
 */
// Dough Types
router.get('/dough-types', (req, res) => controller.listDoughTypes(req, res));
router.post('/dough-types', (req, res) => controller.createDoughType(req, res));
router.put('/dough-types/:id', (req, res) => controller.updateDoughType(req, res));
router.delete('/dough-types/:id', (req, res) => controller.deleteDoughType(req, res));

/**
 * @swagger
 * /taxonomies/size-options:
 *   get:
 *     summary: Listează opțiunile de mărime
 *     tags: [Taxonomies]
 *   post:
 *     summary: Creează o opțiune de mărime
 *     tags: [Taxonomies]
 */
// Size Options
router.get('/size-options', (req, res) => controller.listSizeOptions(req, res));
router.post('/size-options', (req, res) => controller.createSizeOption(req, res));
router.put('/size-options/:id', (req, res) => controller.updateSizeOption(req, res));
router.delete('/size-options/:id', (req, res) => controller.deleteSizeOption(req, res));

export { router as taxonomyRoutes };


