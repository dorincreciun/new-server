"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = exports.CartService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CartService {
    async getOrCreateCart(userId) {
        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }
        return cart;
    }
    async getCartWithItems(userId) {
        const cart = await this.getOrCreateCart(userId);
        const items = await prisma.cartItem.findMany({
            where: { cartId: cart.id },
            include: {
                productVariant: { include: { product: true, dough: true, size: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
        const total = items.reduce((sum, it) => sum + Number(it.unitPrice) * it.quantity, 0);
        return { cartId: cart.id, items, total };
    }
    async addItem(userId, productVariantId, quantity = 1) {
        if (quantity <= 0)
            quantity = 1;
        const cart = await this.getOrCreateCart(userId);
        const variant = await prisma.productVariant.findUnique({ where: { id: productVariantId }, include: { product: true } });
        if (!variant)
            throw new Error('VARIANT_NOT_FOUND');
        const unitPrice = variant.price;
        // upsert by unique (cartId, productVariantId)
        const existing = await prisma.cartItem.findUnique({
            where: { cartId_productVariantId: { cartId: cart.id, productVariantId } },
        });
        let item;
        if (existing) {
            item = await prisma.cartItem.update({
                where: { id: existing.id },
                data: { quantity: existing.quantity + quantity, unitPrice },
            });
        }
        else {
            item = await prisma.cartItem.create({
                data: { cartId: cart.id, productVariantId, quantity, unitPrice },
            });
        }
        return item;
    }
    async updateItemQuantity(userId, itemId, quantity) {
        if (quantity <= 0)
            throw new Error('INVALID_QUANTITY');
        const cart = await this.getOrCreateCart(userId);
        const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
        if (!item)
            throw new Error('ITEM_NOT_FOUND');
        return await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
    }
    async removeItem(userId, itemId) {
        const cart = await this.getOrCreateCart(userId);
        const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
        if (!item)
            throw new Error('ITEM_NOT_FOUND');
        await prisma.cartItem.delete({ where: { id: item.id } });
    }
    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
}
exports.CartService = CartService;
exports.cartService = new CartService();
//# sourceMappingURL=cartService.js.map