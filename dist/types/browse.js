"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowseQuerySchema = void 0;
const zod_1 = require("zod");
// Schema pentru validarea query-urilor de browse
exports.BrowseQuerySchema = zod_1.z.object({
    q: zod_1.z.string().trim().min(1).optional(),
    categorySlug: zod_1.z.string().optional(),
    priceMin: zod_1.z.coerce.number().min(0).optional(),
    priceMax: zod_1.z.coerce.number().min(0).optional(),
    flags: zod_1.z
        .union([
        zod_1.z.string(),
        zod_1.z.array(zod_1.z.string())
    ])
        .optional()
        .transform((val) => {
        if (!val)
            return [];
        if (Array.isArray(val))
            return val.map((s) => s.trim()).filter(Boolean);
        return val.split(',').map((s) => s.trim()).filter(Boolean);
    }),
    ingredients: zod_1.z
        .union([
        zod_1.z.string(),
        zod_1.z.array(zod_1.z.string())
    ])
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
    isCustomizable: zod_1.z.coerce.boolean().optional(),
    isNew: zod_1.z.coerce.boolean().optional(),
    newerThanDays: zod_1.z.coerce.number().int().min(1).max(365).default(30).optional(),
    sort: zod_1.z.enum(['price', 'rating', 'popularity', 'newest']).default('newest'),
    order: zod_1.z.enum(['asc', 'desc']).default('desc'),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(12),
}).refine((data) => {
    if (data.priceMin !== undefined && data.priceMax !== undefined) {
        return data.priceMin <= data.priceMax;
    }
    return true;
}, {
    message: 'priceMin nu poate fi mai mare decât priceMax',
    path: ['priceMin']
});
//# sourceMappingURL=browse.js.map