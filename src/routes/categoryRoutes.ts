import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';

const router = Router();
const categoryController = new CategoryController();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gestionarea categoriilor de produse
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - id
 *         - slug
 *         - name
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: integer
 *           description: ID-ul unic al categoriei
 *         slug:
 *           type: string
 *           description: Identificator URL-friendly al categoriei
 *         name:
 *           type: string
 *           description: Numele categoriei
 *         description:
 *           type: string
 *           description: Descrierea categoriei
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data și ora creării
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data și ora ultimei actualizări
 *     
 *     CreateCategoryRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Numele categoriei
 *         description:
 *           type: string
 *           description: Descrierea categoriei
 *     
 *     UpdateCategoryRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Numele categoriei
 *         description:
 *           type: string
 *           description: Descrierea categoriei
 *     
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Category'
 *     
 *     CategoryListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *         count:
 *           type: integer
 *     
 *     CategoryStatsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             totalCategories:
 *               type: integer
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 */

// ELIMINAT: POST /categories - funcționalitate administrativă

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obține toate categoriile
 *     description: Returnează o listă cu toate categoriile din sistem, sortate alfabetic după nume.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Lista cu toate categoriile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Eroare internă a serverului
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', (req, res) => categoryController.getAllCategories(req, res));
/**
 * @swagger
 * /categories/{slug}:
 *   get:
 *     summary: Obține o categorie după slug
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug-ul categoriei (valoarea toate nu este permisă)
 *     responses:
 *       200:
 *         description: Categoria găsită
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Slug invalid
 *       404:
 *         description: Categoria nu a fost găsită
 */
router.get('/:slug', (req, res) => categoryController.getCategoryBySlug(req, res));


// Eliminat: /categories/stats - funcționalitate administrativă, nu pentru frontend

// ELIMINAT: GET /categories/:id - funcționalitate administrativă

// ELIMINAT: PUT /categories/:id - funcționalitate administrativă

// ELIMINAT: DELETE /categories/:id - funcționalitate administrativă

export { router as categoryRoutes };
