import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Taxonomies
 *   description: Endpoint-uri pentru obținerea datelor de taxonomie (ingrediente, flaguri, variante) - DOAR CITIRE
 */

/**
 * @swagger
 * /taxonomies/ingredients:
 *   get:
 *     summary: Listează ingredientele disponibile
 *     tags: [Taxonomies]
 *     description: Returnează lista cu toate ingredientele disponibile pentru pizza
 *     responses:
 *       200:
 *         description: Lista cu ingredientele
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       key:
 *                         type: string
 *                       label:
 *                         type: string
 */
router.get('/ingredients', (req, res) => {
  res.json({
    message: 'Ingredientele au fost obținute cu succes',
    data: [
      { id: 1, key: 'mozzarella', label: 'Mozzarella' },
      { id: 2, key: 'parmezan', label: 'Parmezan' },
      { id: 3, key: 'gorgonzola', label: 'Gorgonzola' },
      { id: 4, key: 'salam', label: 'Salam' },
      { id: 5, key: 'pepperoni', label: 'Pepperoni' },
      { id: 6, key: 'prosciutto', label: 'Prosciutto' },
      { id: 7, key: 'bacon', label: 'Bacon' },
      { id: 8, key: 'ciuperci', label: 'Ciuperci' },
      { id: 9, key: 'masline', label: 'Măsline' },
      { id: 10, key: 'rosii', label: 'Roșii' },
      { id: 11, key: 'ardei', label: 'Ardei' },
      { id: 12, key: 'ceapa', label: 'Ceapă' },
      { id: 13, key: 'usturoi', label: 'Usturoi' },
      { id: 14, key: 'basilic', label: 'Busuioc' },
      { id: 15, key: 'oregano', label: 'Oregano' },
      { id: 16, key: 'chili', label: 'Chili' },
      { id: 17, key: 'jalapeno', label: 'Jalapeño' },
      { id: 18, key: 'ananas', label: 'Ananas' },
      { id: 19, key: 'rucola', label: 'Rucola' },
      { id: 20, key: 'sos-tomato', label: 'Sos de roșii' }
    ]
  });
});

/**
 * @swagger
 * /taxonomies/flags:
 *   get:
 *     summary: Listează flagurile disponibile
 *     tags: [Taxonomies]
 *     description: Returnează lista cu toate flagurile disponibile pentru filtrare
 *     responses:
 *       200:
 *         description: Lista cu flagurile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       key:
 *                         type: string
 *                       label:
 *                         type: string
 */
router.get('/flags', (req, res) => {
  res.json({
    message: 'Flagurile au fost obținute cu succes',
    data: [
      { id: 1, key: 'vegetarian', label: 'Vegetarian' },
      { id: 2, key: 'vegan', label: 'Vegan' },
      { id: 3, key: 'picant', label: 'Picant' },
      { id: 4, key: 'fara-lactoza', label: 'Fără Lactoză' },
      { id: 5, key: 'fara-gluten', label: 'Fără Gluten' },
      { id: 6, key: 'premium', label: 'Premium' },
      { id: 7, key: 'nou', label: 'Nou' },
      { id: 8, key: 'popular', label: 'Popular' }
    ]
  });
});

/**
 * @swagger
 * /taxonomies/dough-types:
 *   get:
 *     summary: Listează tipurile de aluat disponibile
 *     tags: [Taxonomies]
 *     description: Returnează lista cu toate tipurile de aluat disponibile
 *     responses:
 *       200:
 *         description: Lista cu tipurile de aluat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       key:
 *                         type: string
 *                       label:
 *                         type: string
 */
router.get('/dough-types', (req, res) => {
  res.json({
    message: 'Tipurile de aluat au fost obținute cu succes',
    data: [
      { id: 1, key: 'clasic', label: 'Aluat Clasic' },
      { id: 2, key: 'subtire', label: 'Aluat Subțire' },
      { id: 3, key: 'gros', label: 'Aluat Gros' },
      { id: 4, key: 'integral', label: 'Aluat Integral' },
      { id: 5, key: 'fara-gluten', label: 'Aluat Fără Gluten' }
    ]
  });
});

/**
 * @swagger
 * /taxonomies/size-options:
 *   get:
 *     summary: Listează opțiunile de mărime disponibile
 *     tags: [Taxonomies]
 *     description: Returnează lista cu toate mărimile disponibile pentru pizza
 *     responses:
 *       200:
 *         description: Lista cu mărimile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       key:
 *                         type: string
 *                       label:
 *                         type: string
 */
router.get('/size-options', (req, res) => {
  res.json({
    message: 'Opțiunile de mărime au fost obținute cu succes',
    data: [
      { id: 1, key: 'mica', label: 'Mică (25cm)' },
      { id: 2, key: 'medie', label: 'Medie (30cm)' },
      { id: 3, key: 'mare', label: 'Mare (35cm)' },
      { id: 4, key: 'familie', label: 'Familie (40cm)' }
    ]
  });
});

export { router as taxonomyRoutes };


