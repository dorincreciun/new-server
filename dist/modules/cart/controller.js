"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartController = exports.CartController = void 0;
const service_1 = require("./service");
const response_1 = require("../../shared/api/http/response");
class CartController {
    async getCart(req, res, next) {
        try {
            const userId = req.user.id;
            const cart = await service_1.cartService.getCart(userId);
            return (0, response_1.sendSuccess)(res, cart, 'Current cart');
        }
        catch (error) {
            next(error);
        }
    }
    async addItem(req, res, next) {
        try {
            const userId = req.user.id;
            const { productVariantId, quantity } = req.body;
            const cart = await service_1.cartService.addItem(userId, productVariantId, quantity);
            return (0, response_1.sendSuccess)(res, cart, 'Product added to cart');
        }
        catch (error) {
            next(error);
        }
    }
    async updateItem(req, res, next) {
        try {
            const userId = req.user.id;
            const itemId = Number(req.params.itemId);
            const { quantity } = req.body;
            const cart = await service_1.cartService.updateItemQuantity(userId, itemId, quantity);
            return (0, response_1.sendSuccess)(res, cart, 'Quantity updated');
        }
        catch (error) {
            next(error);
        }
    }
    async removeItem(req, res, next) {
        try {
            const userId = req.user.id;
            const itemId = Number(req.params.itemId);
            const cart = await service_1.cartService.removeItem(userId, itemId);
            return (0, response_1.sendSuccess)(res, cart, 'Product removed from cart');
        }
        catch (error) {
            next(error);
        }
    }
    async clearCart(req, res, next) {
        try {
            const userId = req.user.id;
            await service_1.cartService.clearCart(userId);
            return (0, response_1.sendSuccess)(res, null, 'Cart cleared');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CartController = CartController;
exports.cartController = new CartController();
//# sourceMappingURL=controller.js.map