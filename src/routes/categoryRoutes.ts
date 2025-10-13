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

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Creează o nouă categorie
 *     description: Creează o nouă categorie în sistem. Numele categoriei trebuie să fie unic.
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *           examples:
 *             Carne:
 *               summary: Categorie pentru carne
 *               value:
 *                 name: "Carne"
 *                 description: "Produse din carne de porc, vită, pui"
 *             Branza:
 *               summary: Categorie pentru brânzeturi
 *               value:
 *                 name: "Branza"
 *                 description: "Brânze de diferite tipuri"
 *     responses:
 *       201:
 *         description: Categoria a fost creată cu succes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *             examples:
 *               Success:
 *                 summary: Categoria creată cu succes
 *                 value:
 *                   message: "Categoria a fost creată cu succes"
 *                   data:
 *                     id: 1
 *                     name: "Carne"
 *                     description: "Produse din carne de porc, vită, pui"
 *                     createdAt: "2024-01-15T10:30:00Z"
 *                     updatedAt: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Date invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               MissingName:
 *                 summary: Nume lipsă
 *                 value:
 *                   error: "Numele categoriei este obligatoriu și trebuie să fie un string non-gol"
 *       409:
 *         description: Categoria există deja
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               DuplicateName:
 *                 summary: Nume duplicat
 *                 value:
 *                   error: "O categorie cu acest nume există deja"
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
router.post('/', (req, res) => categoryController.createCategory(req, res));

/**
 * @swagger
 * /api/categories:
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
 *               $ref: '#/components/schemas/CategoryListResponse'
 *             examples:
 *               Success:
 *                 summary: Lista categoriilor
 *                 value:
 *                   message: "Categoriile au fost obținute cu succes"
 *                   data:
 *                     - id: 1
 *                       name: "Branza"
 *                       description: "Brânze de diferite tipuri"
 *                       createdAt: "2024-01-15T10:08:15.917Z"
 *                       updatedAt: "2024-01-15T10:08:15.917Z"
 *                     - id: 2
 *                       name: "Carne"
 *                       description: "Produse din carne de porc, vită, pui"
 *                       createdAt: "2024-01-15T10:08:11.243Z"
 *                       updatedAt: "2024-01-15T10:08:11.243Z"
 *                     - id: 3
 *                       name: "Lactate"
 *                       description: "Produse lactate"
 *                       createdAt: "2024-01-15T10:08:19.906Z"
 *                       updatedAt: "2024-01-15T10:08:19.906Z"
 *                   count: 3
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
 * /api/categories/stats:
 *   get:
 *     summary: Obține statistici despre categorii
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Statisticile categoriilor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryStatsResponse'
 *       500:
 *         description: Eroare internă a serverului
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stats', (req, res) => categoryController.getCategoryStats(req, res));

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obține o categorie după ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID-ul categoriei
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoria a fost găsită
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: ID invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Categoria nu a fost găsită
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Eroare internă a serverului
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', (req, res) => categoryController.getCategoryById(req, res));

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Actualizează o categorie
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID-ul categoriei
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryRequest'
 *     responses:
 *       200:
 *         description: Categoria a fost actualizată cu succes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Date invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Categoria nu a fost găsită
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Numele categoriei există deja
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Eroare internă a serverului
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', (req, res) => categoryController.updateCategory(req, res));

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Șterge o categorie
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID-ul categoriei
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoria a fost ștearsă cu succes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Categoria a fost ștearsă cu succes"
 *       400:
 *         description: ID invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Categoria nu a fost găsită
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Eroare internă a serverului
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', (req, res) => categoryController.deleteCategory(req, res));

export { router as categoryRoutes };
