"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const validate_1 = require("../../shared/middleware/validate");
const dto_1 = require("./dto");
const router = (0, express_1.Router)();
// Endpoint unic: listează produsele + filtrele aferente (flags, ingredients, doughTypes, sizeOptions, price)
router.get('/products', (0, validate_1.validate)({ query: dto_1.browseProductsSchema }), controller_1.browseController.getProducts);
exports.default = router;
//# sourceMappingURL=route.js.map