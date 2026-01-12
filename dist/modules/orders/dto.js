"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersSchema = exports.checkoutSchema = void 0;
const zod_1 = require("zod");
exports.checkoutSchema = zod_1.z.object({
    customer: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Numele este obligatoriu'),
        email: zod_1.z.string().email('Email invalid').optional(),
        phone: zod_1.z.string().min(1, 'Telefonul este obligatoriu'),
    }),
    address: zod_1.z.object({
        city: zod_1.z.string().min(1, 'Orașul este obligatoriu'),
        street: zod_1.z.string().min(1, 'Strada este obligatorie'),
        house: zod_1.z.string().min(1, 'Numărul casei este obligatoriu'),
        apartment: zod_1.z.string().optional(),
        comment: zod_1.z.string().optional(),
    }),
    paymentMethod: zod_1.z.enum(['CASH', 'CARD_ON_DELIVERY', 'ONLINE']).optional(),
});
exports.getOrdersSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1).optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10).optional(),
});
//# sourceMappingURL=dto.js.map