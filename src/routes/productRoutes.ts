import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();
const productController = new ProductController();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestionarea produselor și căutarea după categorii
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         slug:
 *           type: string
 *           example: "carne"
 *         name:
 *           type: string
 *           example: "Carne"
 *         description:
 *           type: string
 *           example: "Produse din carne"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - categoryId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID-ul unic al produsului
 *           example: 1
 *         name:
 *           type: string
 *           description: Numele produsului
 *           example: "Carne de porc"
 *         description:
 *           type: string
 *           description: Descrierea produsului
 *           example: "Carne de porc proaspătă"
 *         price:
 *           type: number
 *           format: decimal
 *           description: Prețul produsului
 *           example: 25.50
 *         stock:
 *           type: integer
 *           description: Cantitatea în stoc
 *           example: 100
 *         categoryId:
 *           type: integer
 *           description: ID-ul categoriei
 *           example: 1
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
 *         category:
 *           $ref: '#/components/schemas/Category'
 *     
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - categoryId
 *       properties:
 *         name:
 *           type: string
 *           description: Numele produsului
 *           example: "Carne de porc"
 *         description:
 *           type: string
 *           description: Descrierea produsului
 *           example: "Carne de porc proaspătă"
 *         price:
 *           type: number
 *           format: decimal
 *           description: Prețul produsului
 *           example: 25.50
 *         stock:
 *           type: integer
 *           description: Cantitatea în stoc
 *           example: 100
 *         categoryId:
 *           type: integer
 *           description: ID-ul categoriei
 *           example: 1
 *     
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Numele produsului
 *           example: "Carne de porc premium"
 *         description:
 *           type: string
 *           description: Descrierea produsului
 *           example: "Carne de porc premium proaspătă"
 *         price:
 *           type: number
 *           format: decimal
 *           description: Prețul produsului
 *           example: 30.00
 *         stock:
 *           type: integer
 *           description: Cantitatea în stoc
 *           example: 150
 *         categoryId:
 *           type: integer
 *           description: ID-ul categoriei
 *           example: 1
 *     
 *     UpdateStockRequest:
 *       type: object
 *       required:
 *         - stock
 *       properties:
 *         stock:
 *           type: integer
 *           description: Noua cantitate în stoc
 *           example: 200
 *     
 *     ProductResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Produsul a fost creat cu succes"
 *         data:
 *           $ref: '#/components/schemas/Product'
 *     
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Produsele au fost obținute cu succes"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         count:
 *           type: integer
 *           example: 10
 *     
 *     ProductStatsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Statisticile produselor au fost obținute cu succes"
 *         data:
 *           type: object
 *           properties:
 *             totalProducts:
 *               type: integer
 *               example: 50
 *     
 *     LowStockResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Produsele cu stoc scăzut au fost obținute cu succes"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         count:
 *           type: integer
 *           example: 5
 *         threshold:
 *           type: integer
 *           example: 10
 */

// ELIMINAT: POST /products - funcționalitate administrativă

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obține toate produsele
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista cu toate produsele
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       500:
 *         description: Eroare internă a serverului
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obține toate produsele (endpoint simplu)
 *     tags: [Products]
 *     description: Returnează toate produsele fără filtrare avansată. Pentru filtrare complexă, folosește /browse/products.
 *     responses:
 *       200:
 *         description: Lista cu toate produsele
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 */
router.get('/', (req, res) => productController.getAllProducts(req, res));

// Eliminat: /products/search - folosește /browse/products cu parametrul search

// ELIMINAT: GET /products/facets/:slug - funcționalitate complexă, nu necesară pentru frontend

/**
 * @swagger
 * /products/facets/{slug}:
 *   get:
 *     summary: Obține valorile posibile (facets) pentru filtrele unei categorii (după slug)
 *     tags: [Products]
 *     description: Returnează colecțiile pentru filtre precum flags, ingredients, doughTypes, sizeOptions și intervalul de preț pentru categoria indicată prin slug.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug-ul categoriei (ex: "carne", "pizza")
 *     responses:
 *       200:
 *         description: Facets obținute cu succes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Slug invalid
 *       500:
 *         description: Eroare internă a serverului
 */
router.get('/facets/:slug', (req, res) => productController.getFacetsByCategorySlug(req, res));

// ELIMINAT: GET /products/filter - folosește /browse/products pentru filtrare

// Eliminat: /products/low-stock - funcționalitate administrativă, nu pentru frontend

// Eliminat: /products/stats - funcționalitate administrativă, nu pentru frontend

// ELIMINAT: GET /products/category/:categoryId - folosește /browse/products cu categorySlug

// ELIMINAT: GET /products/category-name/:categoryName - folosește /browse/products cu categorySlug

// ELIMINAT: GET /products/category-slug/:slug - folosește /browse/products cu categorySlug

// ELIMINAT: GET /categories/:slug/products - folosește /browse/products cu categorySlug

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obține un produs după ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID-ul produsului
 *         example: 1
 *     responses:
 *       200:
 *         description: Produsul a fost găsit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: ID invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Produsul nu a fost găsit
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
// Eliminat: GET /products/:id – detaliu produs prin ID nu este permis (folosim doar slug-uri)

// ELIMINAT: PUT /products/:id - funcționalitate administrativă

// ELIMINAT: PUT /products/:id/stock - funcționalitate administrativă

// ELIMINAT: DELETE /products/:id - funcționalitate administrativă

export { router as productRoutes };
