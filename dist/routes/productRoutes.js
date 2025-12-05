"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
exports.productRoutes = router;
const productController = new productController_1.ProductController();
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestionarea produselor și căutarea după categorii
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - id
 *         - slug
 *         - name
 *         - createdAt
 *       properties:
 *         id:
 *           type: integer
 *         slug:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - basePrice
 *         - stock
 *         - categoryId
 *         - createdAt
 *         - category
 *         - imageUrl
 *       properties:
 *         id:
 *           type: integer
 *           description: ID-ul unic al produsului
 *         name:
 *           type: string
 *           description: Numele produsului
 *         description:
 *           type: string
 *           description: Descrierea produsului
 *         imageUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           description: URL-ul imaginii produsului; poate fi null dacă produsul nu are imagine
 *         basePrice:
 *           type: number
 *           description: Prețul de bază al produsului
 *         stock:
 *           type: integer
 *           description: Cantitatea în stoc (implicit 0 dacă nu este furnizată la creare)
 *           default: 0
 *         categoryId:
 *           type: integer
 *           description: ID-ul categoriei
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data și ora creării
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data și ora ultimei actualizări
 *         category:
 *           $ref: '#/components/schemas/Category'
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - basePrice
 *         - categoryId
 *       properties:
 *         name:
 *           type: string
 *           description: Numele produsului
 *         description:
 *           type: string
 *           description: Descrierea produsului
 *         imageUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           description: URL-ul imaginii produsului; dacă lipsește se va salva null
 *         basePrice:
 *           type: number
 *           description: Prețul de bază al produsului
 *         stock:
 *           type: integer
 *           description: Cantitatea în stoc (dacă nu este furnizată, se consideră 0)
 *           default: 0
 *         categoryId:
 *           type: integer
 *           description: ID-ul categoriei
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Numele produsului
 *         description:
 *           type: string
 *           description: Descrierea produsului
 *         imageUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           description: URL-ul imaginii produsului; poate fi setat la null pentru a elimina imaginea
 *         basePrice:
 *           type: number
 *           description: Prețul de bază al produsului
 *         stock:
 *           type: integer
 *           description: Cantitatea în stoc
 *         categoryId:
 *           type: integer
 *           description: ID-ul categoriei
 *     UpdateStockRequest:
 *       type: object
 *       required:
 *         - stock
 *       properties:
 *         stock:
 *           type: integer
 *           description: Noua cantitate în stoc
 *     ProductResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Product'
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         count:
 *           type: integer
 *     ProductStatsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             totalProducts:
 *               type: integer
 *     LowStockResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         count:
 *           type: integer
 *         threshold:
 *           type: integer
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *     SearchProductsResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Căutarea produselor a fost efectuată cu succes
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 12
 *             total:
 *               type: integer
 *               example: 120
 *             totalPages:
 *               type: integer
 *               example: 10
 */
// ELIMINAT: POST /products - funcționalitate administrativă
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obține toate produsele (endpoint simplu)
 *     tags:
 *       - Products
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
/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Caută produse după text
 *     tags:
 *       - Products
 *     description: Caută produse după nume și/sau descriere. Parametrul `q` este obligatoriu. Suportă filtre opționale, paginare și sortare.
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Termenul de căutare (căutare în nume/descriere)
 *       - in: query
 *         name: categorySlug
 *         schema:
 *           type: string
 *         description: Filtrează după slug-ul categoriei
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *         description: Preț minim (filtrare)
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *         description: Preț maxim (filtrare)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, createdAt, popularity]
 *         description: Câmp de sortare (implicit createdAt)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Ordinea de sortare (implicit desc)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Pagina (implicit 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Număr de elemente pe pagină (implicit 12)
 *     responses:
 *       200:
 *         description: Rezultatele căutării
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchProductsResponse'
 *       400:
 *         description: Parametri invalizi (ex. lipsește q)
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
router.get('/search', (req, res) => productController.searchProducts(req, res));
// ELIMINAT: GET /products/facets/:slug - funcționalitate complexă, nu necesară pentru frontend
/**
 * @swagger
 * /products/facets/{slug}:
 *   get:
 *     summary: Obține valorile posibile (facets) pentru filtrele unei categorii (după slug)
 *     tags:
 *       - Products
 *     description: Returnează colecțiile pentru filtre precum flags, ingredients, doughTypes, sizeOptions și intervalul de preț pentru categoria indicată prin slug.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug-ul categoriei (ex. carne, pizza)
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
//# sourceMappingURL=productRoutes.js.map