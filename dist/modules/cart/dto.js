"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartItemSchema = exports.addToCartSchema = void 0;
const zod_1 = require("zod");
exports.addToCartSchema = zod_1.z.object({
    productVariantId: zod_1.z.number().int().positive(),
    quantity: zod_1.z.number().int().positive().default(1),
});
exports.updateCartItemSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().positive(),
});
//# sourceMappingURL=dto.js.map