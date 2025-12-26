import { z } from 'zod';
export declare const BrowseQuerySchema: z.ZodObject<{
    q: z.ZodOptional<z.ZodString>;
    categorySlug: z.ZodOptional<z.ZodString>;
    priceMin: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    priceMax: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    flags: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[], string | string[] | undefined>>;
    ingredients: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[], string | string[] | undefined>>;
    dough: z.ZodOptional<z.ZodString>;
    size: z.ZodOptional<z.ZodString>;
    isCustomizable: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    isNew: z.ZodOptional<z.ZodCoercedBoolean<unknown>>;
    newerThanDays: z.ZodOptional<z.ZodDefault<z.ZodCoercedNumber<unknown>>>;
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
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type BrowseQuery = z.infer<typeof BrowseQuerySchema>;
export interface ProductWithRelations {
    id: number;
    name: string;
    description: string | null;
    basePrice: number;
    minPrice: number | null;
    maxPrice: number | null;
    imageUrl: string | null;
    popularity: number;
    isCustomizable: boolean;
    releasedAt: Date | null;
    ratingAverage: number | null;
    ratingCount: number;
    createdAt: Date;
    updatedAt: Date;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    flags: Array<{
        key: string;
        label?: string | null;
    }>;
    ingredients: Array<{
        key: string;
        label?: string | null;
    }>;
    variants: Array<{
        id: number;
        price: number;
        isDefault: boolean;
        doughType?: {
            key: string;
            label?: string | null;
        } | null;
        sizeOption?: {
            key: string;
            label?: string | null;
        } | null;
    }>;
}
export interface BrowseResponse {
    message: string;
    data: ProductWithRelations[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
//# sourceMappingURL=browse.d.ts.map