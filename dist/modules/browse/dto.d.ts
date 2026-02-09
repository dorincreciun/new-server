import { z } from 'zod';
export declare const browseProductsSchema: z.ZodObject<{
    categorySlug: z.ZodOptional<z.ZodString>;
    priceMin: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    priceMax: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    flags: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[], string | string[] | undefined>>;
    ingredients: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[], string | string[] | undefined>>;
    dough: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodString>;
    isCustomizable: z.ZodOptional<z.ZodPipe<z.ZodTransform<boolean, unknown>, z.ZodBoolean>>;
    isNew: z.ZodOptional<z.ZodPipe<z.ZodTransform<boolean, unknown>, z.ZodBoolean>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodDefault<z.ZodEnum<{
        popularity: "popularity";
        price: "price";
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
    priceMin: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    priceMax: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    flags: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[], string | string[] | undefined>>;
    ingredients: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[], string | string[] | undefined>>;
    dough: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodString>;
    isCustomizable: z.ZodOptional<z.ZodPipe<z.ZodTransform<boolean, unknown>, z.ZodBoolean>>;
    isNew: z.ZodOptional<z.ZodPipe<z.ZodTransform<boolean, unknown>, z.ZodBoolean>>;
}, z.core.$strip>;
export declare const searchProductsSchema: z.ZodObject<{
    q: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type BrowseProductsInput = z.infer<typeof browseProductsSchema>;
export type BrowseFiltersInput = z.infer<typeof browseFiltersSchema>;
export type SearchProductsInput = z.infer<typeof searchProductsSchema>;
//# sourceMappingURL=dto.d.ts.map