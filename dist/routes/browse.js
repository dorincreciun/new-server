"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browseRoutes = void 0;
const express_1 = require("express");
const browseController_1 = require("../controllers/browseController");
const router = (0, express_1.Router)();
exports.browseRoutes = router;
const browseController = new browseController_1.BrowseController();
/**
 * @swagger
 * tags:
 *   name: Browse
 *   description: Filtrare și căutare avansată de produse
 * components:
 *   schemas:
 *     ProductWithRelations:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         minPrice:
 *           type: number
 *         maxPrice:
 *           type: number
 *         imageUrl:
 *           type: string
 *         popularity:
 *           type: integer
 *         isCustomizable:
 *           type: boolean
 *         releasedAt:
 *           type: string
 *           format: date-time
 *         ratingAverage:
 *           type: number
 *         ratingCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             slug:
 *               type: string
 *         flags:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               label:
 *                 type: string
 *         ingredients:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               label:
 *                 type: string
 *         variants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               price:
 *                 type: number
 *               isDefault:
 *                 type: boolean
 *               doughType:
 *                 type: object
 *                 properties:
 *                   key:
 *                     type: string
 *                   label:
 *                     type: string
 *               sizeOption:
 *                 type: object
 *                 properties:
 *                   key:
 *                     type: string
 *                   label:
 *                     type: string
 *     BrowseResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductWithRelations'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             total:
 *               type: integer
 */
/**
 * @swagger
 * /browse/products:
 *   get:
 *     summary: Filtrează și sortează produsele
 *     description: Endpoint principal pentru filtrarea produselor cu suport pentru toate tipurile de filtre
 *     tags: [Browse]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Căutare full-text în nume și descriere
 *         example: "cheese"
 *       - in: query
 *         name: categorySlug
 *         schema:
 *           type: string
 *         description: Slug-ul categoriei
 *         example: "pizza"
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *         description: Prețul minim (filtrare pe minPrice)
 *         example: 200
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *         description: Prețul maxim (filtrare pe minPrice)
 *         example: 500
 *       - in: query
 *         name: flags
 *         schema:
 *           type: string
 *         description: Flaguri separate prin virgulă sau flags[]=a&flags[]=b
 *         example: "spicy,vegetarian"
 *       - in: query
 *         name: ingredients
 *         schema:
 *           type: string
 *         description: Ingrediente separate prin virgulă sau ingredients[]=a&ingredients[]=b
 *         example: "mozzarella,tomato"
 *       - in: query
 *         name: dough
 *         schema:
 *           type: string
 *         description: Tipul de aluat
 *         example: "thin"
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *         description: Mărimea
 *         example: "30cm"
 *       - in: query
 *         name: isCustomizable
 *         schema:
 *           type: boolean
 *         description: Filtrează produsele care pot fi personalizate
 *         example: true
 *       - in: query
 *         name: isNew
 *         schema:
 *           type: boolean
 *         description: Filtrează produsele noi (releasedAt în ultimele newerThanDays zile)
 *         example: true
 *       - in: query
 *         name: newerThanDays
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Numărul de zile pentru care produsul este considerat nou
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price, rating, popularity, newest]
 *           default: newest
 *         description: Criteriul de sortare (price sortează după minPrice)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Ordinea de sortare
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numărul paginii
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Numărul de produse per pagină
 *     responses:
 *       200:
 *         description: Lista filtrată de produse
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrowseResponse'
 *             examples:
 *               Success:
 *                 summary: Produse filtrate cu succes
 *                 value:
 *                   message: "Produsele au fost filtrate cu succes"
 *                   data:
 *                     - id: 1
 *                       name: "Чизбургер-пицца"
 *                       price: 399
 *                       minPrice: 399
 *                       maxPrice: 499
 *                       flags: [{"key": "spicy", "label": "Picant"}]
 *                       ingredients: [{"key": "mozzarella", "label": "Mozzarella"}, {"key": "tomato", "label": "Roșii"}]
 *                       variants: [{"id": 1, "price": 399, "isDefault": true, "sizeOption": {"key": "30cm", "label": "30cm"}}]
 *                       category: {"id": 1, "slug": "pizza", "name": "Пиццы"}
 *                   pagination:
 *                     page: 1
 *                     limit: 10
 *                     total: 65
 *       422:
 *         description: Parametri invalizi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       500:
 *         description: Eroare internă a serverului
 */
router.get('/products', (req, res) => browseController.getProducts(req, res));
/**
 * @swagger
 * /browse/filters:
 *   get:
 *     summary: Obține opțiunile de filtrare disponibile
 *     description: Returnează toate opțiunile de filtrare cu numărul de produse pentru fiecare. Fără categorySlug → filtre globale; cu categorySlug → filtre contextuale (ținând cont de ceilalți parametri).
 *     tags: [Browse]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Căutare full-text în nume și descriere
 *       - in: query
 *         name: categorySlug
 *         schema:
 *           type: string
 *         description: Slug-ul categoriei pentru filtrare specifică
 *         example: "pizza"
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *         description: Prețul minim (filtrare pe minPrice)
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *         description: Prețul maxim (filtrare pe minPrice)
 *       - in: query
 *         name: flags
 *         schema:
 *           type: string
 *         description: Flaguri CSV sau flags[]=a&flags[]=b
 *       - in: query
 *         name: ingredients
 *         schema:
 *           type: string
 *         description: Ingrediente CSV sau ingredients[]=a&ingredients[]=b
 *       - in: query
 *         name: dough
 *         schema:
 *           type: string
 *         description: Tip aluat
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *         description: Mărime
 *       - in: query
 *         name: isCustomizable
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isNew
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: newerThanDays
 *         schema:
 *           type: integer
 *           default: 30
 *     responses:
 *       200:
 *         description: Opțiunile de filtrare
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
 *                           key:
 *                             type: string
 *                           label:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     ingredients:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           key:
 *                             type: string
 *                           label:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     doughTypes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           key:
 *                             type: string
 *                           label:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     sizeOptions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           key:
 *                             type: string
 *                           label:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     price:
 *                       type: object
 *                       properties:
 *                         min:
 *                           type: number
 *                         max:
 *                           type: number
 */
router.get('/filters', (req, res) => browseController.getFilters(req, res));
//# sourceMappingURL=browse.js.map