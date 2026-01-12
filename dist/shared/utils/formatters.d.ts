import { Prisma } from '@prisma/client';
type ProductWithRelations = Prisma.ProductGetPayload<{
    include: {
        category: true;
        flags: {
            include: {
                flag: true;
            };
        };
        ingredients: {
            include: {
                ingredient: true;
            };
        };
        variants: {
            include: {
                dough: true;
                size: true;
            };
        };
    };
}>;
/**
 * Formatează un număr Decimal din Prisma în number
 */
export declare function formatDecimal(value: Prisma.Decimal | number | string | null | undefined): number;
/**
 * Formatează un produs din Prisma în formatul API
 */
export declare function formatProduct(product: ProductWithRelations): any;
export {};
//# sourceMappingURL=formatters.d.ts.map