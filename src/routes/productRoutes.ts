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

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Creează un nou produs
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Produsul a fost creat cu succes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Date invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Categoria specificată nu există
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
router.post('/', (req, res) => productController.createProduct(req, res));

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
 *     summary: Listează și filtrează produse (când lipsesc parametrii, întoarce toate)
 *     tags: [Products]
 *     description: Identic cu /products/filter. Folosește parametrii de filtrare documentați la /products/filter.
 *     responses:
 *       200:
 *         description: Lista filtrată paginată
 */
router.get('/', (req, res) => productController.filterProducts(req, res));

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Caută produse după nume
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Numele produsului de căutat
 *         example: "carne"
 *     responses:
 *       200:
 *         description: Rezultatele căutării
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       400:
 *         description: Parametrul de căutare lipsă
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

/**
 * @swagger
 * /products/facets/{slug}:
 *   get:
 *     summary: Obține listele de filtre (facets) pentru o categorie după slug
 *     description: Returnează valorile disponibile pentru filtre (flags, ingredients, variants) în categoria dată. Valorile sunt deduse din produsele existente.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug-ul categoriei
 *     responses:
 *       200:
 *         description: Facets pentru categorie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     flags:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           value: { type: string }
 *                           count: { type: integer }
 *                     ingredients:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           value: { type: string }
 *                           count: { type: integer }
 *                     variants:
 *                       type: object
 *                       additionalProperties:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             value: { type: string }
 *                             count: { type: integer }
 *       400:
 *         description: Slug invalid
 *       500:
 *         description: Eroare internă
 */
router.get('/facets/:slug', (req, res) => productController.getFacetsByCategorySlug(req, res));

/**
 * @swagger
 * /products/filter:
 *   get:
 *     summary: Filtrează produse după categorie, flags, ingrediente, variante și preț
 *     description: Toți parametrii sunt opționali. Dacă `categorySlug` lipsește sau este gol, se returnează toate produsele. `flagsMode`/`ingredientsMode`/`variantsMode` controlează logica (all/any).
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: categorySlug
 *         schema:
 *           type: string
 *         description: Slug-ul categoriei; dacă lipsește/gol → toate produsele
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Caută în nume
 *       - in: query
 *         name: flags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: Chei flag (ex: vegan). Poate apărea de mai multe ori (flags=vegan&flags=spicy)
 *       - in: query
 *         name: flagsMode
 *         schema:
 *           type: string
 *           enum: [all, any]
 *           default: any
 *       - in: query
 *         name: ingredients
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: Chei ingrediente; implicit mode=all
 *       - in: query
 *         name: ingredientsMode
 *         schema:
 *           type: string
 *           enum: [all, any]
 *           default: all
 *       - in: query
 *         name: variants
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: Valori de variantă (ex: large, thin); se caută în toate cheile de variantă
 *       - in: query
 *         name: variantsMode
 *         schema:
 *           type: string
 *           enum: [all, any]
 *           default: any
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, createdAt, popularity]
 *           default: createdAt
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Lista filtrată paginată
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 page: { type: integer }
 *                 pageSize: { type: integer }
 *                 total: { type: integer }
 *       400:
 *         description: Parametri invalizi
 *       500:
 *         description: Eroare internă
 */
router.get('/filter', (req, res) => productController.filterProducts(req, res));

/**
 * @swagger
 * /products/low-stock:
 *   get:
 *     summary: Obține produsele cu stoc scăzut
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: threshold
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Pragul pentru stoc scăzut
 *         example: 5
 *     responses:
 *       200:
 *         description: Produsele cu stoc scăzut
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LowStockResponse'
 *       400:
 *         description: Prag invalid
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
router.get('/low-stock', (req, res) => productController.getProductsWithLowStock(req, res));

/**
 * @swagger
 * /products/stats:
 *   get:
 *     summary: Obține statistici despre produse
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Statisticile produselor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductStatsResponse'
 *       500:
 *         description: Eroare internă a serverului
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stats', (req, res) => productController.getProductStats(req, res));

/**
 * @swagger
 * /products/category/{categoryId}:
 *   get:
 *     summary: Obține produsele dintr-o anumită categorie
 *     description: Returnează toate produsele care aparțin unei categorii specifice, identificată prin ID. Aceasta este funcționalitatea principală pentru obținerea produselor după categorie.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID-ul unic al categoriei
 *         example: 1
 *     responses:
 *       200:
 *         description: Produsele din categoria specificată
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *             examples:
 *               Success:
 *                 summary: Produse din categoria Carne
 *                 value:
 *                   message: "Produsele din categoria specificată au fost obținute cu succes"
 *                   data:
 *                     - id: 1
 *                       name: "Carne de porc"
 *                       description: "Carne de porc proaspata"
 *                       price: "25.5"
 *                       stock: 100
 *                       categoryId: 1
 *                       createdAt: "2024-01-15T10:08:33.750Z"
 *                       updatedAt: "2024-01-15T10:08:33.750Z"
 *                       category:
 *                         id: 1
 *                         name: "Carne"
 *                         description: "Produse din carne de porc, vită, pui"
 *                         createdAt: "2024-01-15T10:08:11.243Z"
 *                         updatedAt: "2024-01-15T10:08:11.243Z"
 *                     - id: 2
 *                       name: "Carne de vita"
 *                       description: "Carne de vita premium"
 *                       price: "45"
 *                       stock: 50
 *                       categoryId: 1
 *                       createdAt: "2024-01-15T10:08:39.356Z"
 *                       updatedAt: "2024-01-15T10:08:39.356Z"
 *                       category:
 *                         id: 1
 *                         name: "Carne"
 *                         description: "Produse din carne de porc, vită, pui"
 *                         createdAt: "2024-01-15T10:08:11.243Z"
 *                         updatedAt: "2024-01-15T10:08:11.243Z"
 *                   count: 2
 *               Empty:
 *                 summary: Categoria fără produse
 *                 value:
 *                   message: "Produsele din categoria specificată au fost obținute cu succes"
 *                   data: []
 *                   count: 0
 *       400:
 *         description: ID invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               InvalidID:
 *                 summary: ID invalid
 *                 value:
 *                   error: "ID-ul categoriei trebuie să fie un număr întreg pozitiv"
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
router.get('/category/:categoryId', (req, res) => productController.getProductsByCategory(req, res));

/**
 * @swagger
 * /products/category-name/{categoryName}:
 *   get:
 *     summary: Obține produsele dintr-o anumită categorie (după numele categoriei)
 *     description: Returnează toate produsele care aparțin unei categorii specifice, identificată prin numele categoriei. Alternativă la căutarea după ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Numele exact al categoriei (case-sensitive)
 *         example: "Branza"
 *     responses:
 *       200:
 *         description: Produsele din categoria specificată
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *             examples:
 *               Success:
 *                 summary: Produse din categoria Branza
 *                 value:
 *                   message: "Produsele din categoria specificată au fost obținute cu succes"
 *                   data:
 *                     - id: 3
 *                       name: "Cascaval"
 *                       description: "Cascaval de vaca"
 *                       price: "18.75"
 *                       stock: 75
 *                       categoryId: 2
 *                       createdAt: "2024-01-15T10:08:45.115Z"
 *                       updatedAt: "2024-01-15T10:08:45.115Z"
 *                       category:
 *                         id: 2
 *                         name: "Branza"
 *                         description: "Brânze de diferite tipuri"
 *                         createdAt: "2024-01-15T10:08:15.917Z"
 *                         updatedAt: "2024-01-15T10:08:15.917Z"
 *                   count: 1
 *               Empty:
 *                 summary: Categoria fără produse
 *                 value:
 *                   message: "Produsele din categoria specificată au fost obținute cu succes"
 *                   data: []
 *                   count: 0
 *       400:
 *         description: Numele categoriei invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               InvalidName:
 *                 summary: Nume invalid
 *                 value:
 *                   error: "Numele categoriei este obligatoriu și trebuie să fie un string non-gol"
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
router.get('/category-name/:categoryName', (req, res) => productController.getProductsByCategoryName(req, res));

/**
 * @swagger
 * /products/category-slug/{slug}:
 *   get:
 *     summary: Obține produsele dintr-o categorie după slug
 *     description: Returnează toate produsele care aparțin unei categorii, identificată prin slug.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
*         description: Slug-ul categoriei
 *         example: "carne"
 *     responses:
 *       200:
 *         description: Produsele din categoria specificată
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       400:
 *         description: Slug invalid
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
router.get('/category-slug/:slug', (req, res) => productController.getProductsByCategorySlug(req, res));

/**
 * @swagger
 * /categories/{slug}/products:
 *   get:
 *     summary: Listează produsele dintr-o categorie după slug (cu aceleași filtre ca /products)
 *     description: Alias pentru /products cu categorySlug derivat din path. Acceptă aceiași parametri de filtrare și paginare.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista filtrată paginată
 */
router.get('/../categories/:slug/products', (req, res) => {
  // Forward către filter cu categorySlug
  // Notă: înregistrarea reală se face în router-ul de produse, path public e /api/categories/:slug/products
  const q: any = { ...req.query, categorySlug: req.params.slug };
  (req as any).query = q;
  return productController.filterProducts(req, res);
});

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
router.get('/:id', (req, res) => productController.getProductById(req, res));

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualizează un produs
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID-ul produsului
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *     responses:
 *       200:
 *         description: Produsul a fost actualizat cu succes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Date invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Produsul sau categoria nu a fost găsită
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
router.put('/:id', (req, res) => productController.updateProduct(req, res));

/**
 * @swagger
 * /products/{id}/stock:
 *   put:
 *     summary: Actualizează stocul unui produs
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID-ul produsului
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStockRequest'
 *     responses:
 *       200:
 *         description: Stocul produsului a fost actualizat cu succes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Date invalide
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
router.put('/:id/stock', (req, res) => productController.updateProductStock(req, res));

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Șterge un produs
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
 *         description: Produsul a fost șters cu succes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Produsul a fost șters cu succes"
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
router.delete('/:id', (req, res) => productController.deleteProduct(req, res));

export { router as productRoutes };
