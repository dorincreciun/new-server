"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_1 = require("../../shared/middleware/auth");
const validate_1 = require("../../shared/middleware/validate");
const dto_1 = require("./dto");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', controller_1.cartController.getCart);
router.delete('/', controller_1.cartController.clearCart);
router.post('/items', (0, validate_1.validate)({ body: dto_1.addToCartSchema }), controller_1.cartController.addItem);
router.patch('/items/:itemId', (0, validate_1.validate)({ body: dto_1.updateCartItemSchema }), controller_1.cartController.updateItem);
router.delete('/items/:itemId', controller_1.cartController.removeItem);
exports.default = router;
//# sourceMappingURL=route.js.map