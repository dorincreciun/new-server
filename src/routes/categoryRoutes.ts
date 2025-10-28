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
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: ID-ul unic al categoriei
 *           example: 1
 *         slug:
 *           type: string
 *           description: Identificator URL-friendly al categoriei
 *           example: "carne"
 *         name:
 *           type: string
 *           description: Numele categoriei
 *           example: "Carne"
 *         description:
 *           type: string
 *           description: Descrierea categoriei
 *           example: "Produse din carne de porc, vită, pui"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data și ora creării
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data și ora ultimei actualizări
 *           example: "2024-01-15T10:30:00Z"
 *     
 *     CreateCategoryRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Numele categoriei
 *           example: "Carne"
 *         description:
 *           type: string
 *           description: Descrierea categoriei
 *           example: "Produse din carne de porc, vită, pui"
 *     
 *     UpdateCategoryRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Numele categoriei
 *           example: "Carne și mezeluri"
 *         description:
 *           type: string
 *           description: Descrierea categoriei
 *           example: "Produse din carne și mezeluri"
 *     
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Categoria a fost creată cu succes"
 *         data:
 *           $ref: '#/components/schemas/Category'
 *     
 *     CategoryListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Categoriile au fost obținute cu succes"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *         count:
 *           type: integer
 *           example: 5
 *     
 *     CategoryStatsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Statisticile categoriilor au fost obținute cu succes"
 *         data:
 *           type: object
 *           properties:
 *             totalCategories:
 *               type: integer
 *               example: 10
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Eroare de validare"
 */

// ELIMINAT: POST /categories - funcționalitate administrativă

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obține toate categoriile
 *     description: Returnează o listă cu toate categoriile din sistem, sortate alfabetic după nume.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista cu toate categoriile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Eroare internă a serverului
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               ServerError:
 *                 summary: Eroare server
 *                 value:
 *                   error: "Eroare internă a serverului"
 */
router.get('/', (req, res) => categoryController.getAllCategories(req, res));
/**
 * @swagger
 * /categories/{slug}:
 *   get:
 *     summary: Obține o categorie după slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug-ul categoriei ("toate" nu este permis)
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
