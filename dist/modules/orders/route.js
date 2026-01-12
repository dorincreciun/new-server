"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const auth_1 = require("../../middlewares/auth");
const validate_1 = require("../../shared/middleware/validate");
const dto_1 = require("./dto");
const router = (0, express_1.Router)();
// Toate rutele necesită autentificare
router.use(auth_1.authMiddleware);
// POST /api/checkout
router.post('/checkout', (0, validate_1.validate)({ body: dto_1.checkoutSchema }), controller_1.orderController.checkout);
// GET /api/orders
router.get('/orders', (0, validate_1.validate)({ query: dto_1.getOrdersSchema }), controller_1.orderController.getOrders);
// GET /api/orders/:id
router.get('/orders/:id', controller_1.orderController.getOrderDetails);
exports.default = router;
//# sourceMappingURL=route.js.map