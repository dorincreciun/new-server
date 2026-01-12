"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = exports.CartService = void 0;
const client_1 = __importDefault(require("../../shared/prisma/client"));
const errors_1 = require("../../shared/http/errors");
const formatters_1 = require("../../shared/utils/formatters");
class CartService {
    async getOrCreateCart(userId) {
        let cart = await client_1.default.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await client_1.default.cart.create({ data: { userId } });
        }
        return cart;
    }
    async getCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        const items = await client_1.default.cartItem.findMany({
            where: { cartId: cart.id },
            include: {
                productVariant: {
                    include: {
                        product: { include: { category: true } },
                        dough: true,
                        size: true,
                    }
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        const itemsFormatted = items.map((it) => ({
            id: it.id,
            product: {
                id: it.productVariant.product.id,
                name: it.productVariant.product.name,
                description: it.productVariant.product.description || '',
                basePrice: (0, formatters_1.formatDecimal)(it.productVariant.product.basePrice),
                imageUrl: it.productVariant.product.imageUrl || '',
                category: it.productVariant.product.category,
            },
            variant: {
                id: it.productVariant.id,
                doughType: it.productVariant.dough,
                sizeOption: it.productVariant.size,
                price: (0, formatters_1.formatDecimal)(it.productVariant.price),
            },
            quantity: it.quantity,
            lineTotal: (0, formatters_1.formatDecimal)(it.unitPrice) * it.quantity,
        }));
        const total = itemsFormatted.reduce((sum, it) => sum + (it.lineTotal || 0), 0);
        return {
            id: cart.id,
            items: itemsFormatted,
            subtotal: total,
            discounts: 0,
            total: total,
        };
    }
    async addItem(userId, productVariantId, quantity = 1) {
        const cart = await this.getOrCreateCart(userId);
        const variant = await client_1.default.productVariant.findUnique({ where: { id: productVariantId } });
        if (!variant)
            throw new errors_1.NotFoundError('Varianta produsului nu a fost găsită');
        const unitPrice = variant.price;
        await client_1.default.cartItem.upsert({
            where: { cartId_productVariantId: { cartId: cart.id, productVariantId } },
            update: {
                quantity: { increment: quantity },
                unitPrice,
            },
            create: {
                cartId: cart.id,
                productVariantId,
                quantity,
                unitPrice,
            },
        });
        return this.getCart(userId);
    }
    async updateItemQuantity(userId, itemId, quantity) {
        const cart = await this.getOrCreateCart(userId);
        const item = await client_1.default.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
        if (!item)
            throw new errors_1.NotFoundError('Item-ul nu a fost găsit în coș');
        await client_1.default.cartItem.update({
            where: { id: item.id },
            data: { quantity },
        });
        return this.getCart(userId);
    }
    async removeItem(userId, itemId) {
        const cart = await this.getOrCreateCart(userId);
        const item = await client_1.default.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
        if (!item)
            throw new errors_1.NotFoundError('Item-ul nu a fost găsit în coș');
        await client_1.default.cartItem.delete({ where: { id: item.id } });
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        await client_1.default.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
}
exports.CartService = CartService;
exports.cartService = new CartService();
//# sourceMappingURL=service.js.map