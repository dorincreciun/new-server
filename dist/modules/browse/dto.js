"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browseFiltersSchema = exports.browseProductsSchema = void 0;
const zod_1 = require("zod");
exports.browseProductsSchema = zod_1.z.object({
    q: zod_1.z.string().optional(),
    categorySlug: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().default(12),
    sort: zod_1.z.enum(['price', 'rating', 'popularity', 'newest']).default('popularity'),
    order: zod_1.z.enum(['asc', 'desc']).default('desc'),
});
exports.browseFiltersSchema = zod_1.z.object({
    categorySlug: zod_1.z.string().optional(),
});
//# sourceMappingURL=dto.js.map