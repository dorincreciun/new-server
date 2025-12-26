import { z } from 'zod';
export declare const browseProductsSchema: z.ZodObject<{
    q: z.ZodOptional<z.ZodString>;
    categorySlug: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodDefault<z.ZodEnum<{
        price: "price";
        popularity: "popularity";
        rating: "rating";
        newest: "newest";
    }>>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export declare const browseFiltersSchema: z.ZodObject<{
    categorySlug: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type BrowseProductsInput = z.infer<typeof browseProductsSchema>;
export type BrowseFiltersInput = z.infer<typeof browseFiltersSchema>;
//# sourceMappingURL=dto.d.ts.map