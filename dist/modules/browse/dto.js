"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSuggestSchema = exports.browseFiltersSchema = exports.browseProductsSchema = void 0;
const zod_1 = require("zod");
exports.browseProductsSchema = zod_1.z.object({
    q: zod_1.z.string().trim().min(1).optional(),
    categorySlug: zod_1.z.string().optional(),
    priceMin: zod_1.z.coerce.number().min(0).optional(),
    priceMax: zod_1.z.coerce.number().min(0).optional(),
    flags: zod_1.z
        .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
        .optional()
        .transform((val) => {
        if (!val)
            return [];
        if (Array.isArray(val))
            return val.map((s) => s.trim()).filter(Boolean);
        return val.split(',').map((s) => s.trim()).filter(Boolean);
    }),
    ingredients: zod_1.z
        .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
        .optional()
        .transform((val) => {
        if (!val)
            return [];
        if (Array.isArray(val))
            return val.map((s) => s.trim()).filter(Boolean);
        return val.split(',').map((s) => s.trim()).filter(Boolean);
    }),
    dough: zod_1.z.string().optional(),
    size: zod_1.z.string().optional(),
    isCustomizable: zod_1.z.preprocess((val) => val === 'true' || val === true, zod_1.z.boolean()).optional(),
    isNew: zod_1.z.preprocess((val) => val === 'true' || val === true, zod_1.z.boolean()).optional(),
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(12),
    sort: zod_1.z.enum(['price', 'rating', 'popularity', 'newest']).default('popularity'),
    order: zod_1.z.enum(['asc', 'desc']).default('desc'),
}).refine((data) => {
    if (data.priceMin !== undefined && data.priceMax !== undefined) {
        return data.priceMin <= data.priceMax;
    }
    return true;
}, {
    message: 'priceMin nu poate fi mai mare decât priceMax',
    path: ['priceMin']
});
exports.browseFiltersSchema = zod_1.z.object({
    categorySlug: zod_1.z.string().optional(),
    q: zod_1.z.string().optional(),
});
exports.searchSuggestSchema = zod_1.z.object({
    q: zod_1.z.string().min(1),
    limit: zod_1.z.coerce.number().int().positive().default(5),
});
//# sourceMappingURL=dto.js.map