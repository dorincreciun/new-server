"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const cartService_1 = require("../services/cartService");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
exports.cartRoutes = router;
/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Coș de cumpărături per utilizator (autentificat)
 */
/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Obține coșul curent al utilizatorului
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', auth_1.authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const cart = await cartService_1.cartService.getCartWithItems(userId);
    res.json(cart);
});
/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Adaugă o variantă de produs în coș (sau crește cantitatea dacă există)
 *     tags: [Cart]
 */
router.post('/items', auth_1.authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const schema = zod_1.z.object({
        productVariantId: zod_1.z.coerce.number().int().positive({ message: 'productVariantId invalid' }),
        quantity: zod_1.z.coerce.number().int().positive().default(1)
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: 'Date invalide',
            details: parsed.error.issues.map(i => ({ field: i.path.join('.'), message: i.message }))
        });
    }
    try {
        const { productVariantId, quantity } = parsed.data;
        const item = await cartService_1.cartService.addItem(userId, productVariantId, quantity);
        res.status(201).json({ item });
    }
    catch (e) {
        if (e?.message === 'VARIANT_NOT_FOUND')
            return res.status(404).json({ message: 'Varianta nu a fost găsită' });
        console.error('Cart add error:', e);
        res.status(500).json({ message: 'Eroare internă a serverului' });
    }
});
/**
 * @swagger
 * /cart/items/{itemId}:
 *   patch:
 *     summary: Actualizează cantitatea unui item din coș
 *     tags: [Cart]
 */
router.patch('/items/:itemId', auth_1.authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const schema = zod_1.z.object({ quantity: zod_1.z.coerce.number().int().positive({ message: 'Cantitate invalidă' }) });
    const paramsSchema = zod_1.z.object({ itemId: zod_1.z.coerce.number().int().positive() });
    const body = schema.safeParse(req.body);
    const params = paramsSchema.safeParse(req.params);
    if (!body.success || !params.success) {
        const details = [
            ...(!body.success ? body.error.issues : []).map(i => ({ field: i.path.join('.'), message: i.message })),
            ...(!params.success ? params.error.issues : []).map(i => ({ field: i.path.join('.'), message: i.message })),
        ];
        return res.status(400).json({ message: 'Date invalide', details });
    }
    try {
        const updated = await cartService_1.cartService.updateItemQuantity(userId, params.data.itemId, body.data.quantity);
        res.json({ item: updated });
    }
    catch (e) {
        if (e?.message === 'ITEM_NOT_FOUND')
            return res.status(404).json({ message: 'Item-ul nu a fost găsit' });
        if (e?.message === 'INVALID_QUANTITY')
            return res.status(400).json({ message: 'Cantitate invalidă' });
        console.error('Cart update error:', e);
        res.status(500).json({ message: 'Eroare internă a serverului' });
    }
});
/**
 * @swagger
 * /cart/items/{itemId}:
 *   delete:
 *     summary: Elimină un item din coș
 *     tags: [Cart]
 */
router.delete('/items/:itemId', auth_1.authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const itemId = Number(req.params.itemId);
    if (!Number.isFinite(itemId) || itemId <= 0)
        return res.status(400).json({ message: 'ItemId invalid' });
    try {
        await cartService_1.cartService.removeItem(userId, itemId);
        res.status(204).send();
    }
    catch (e) {
        if (e?.message === 'ITEM_NOT_FOUND')
            return res.status(404).json({ message: 'Item-ul nu a fost găsit' });
        console.error('Cart remove error:', e);
        res.status(500).json({ message: 'Eroare internă a serverului' });
    }
});
/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Golește coșul utilizatorului
 *     tags: [Cart]
 */
router.delete('/', auth_1.authenticateToken, async (req, res) => {
    const userId = req.user.id;
    await cartService_1.cartService.clearCart(userId);
    res.status(204).send();
});
//# sourceMappingURL=cart.js.map