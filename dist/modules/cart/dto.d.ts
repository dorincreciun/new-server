import { z } from 'zod';
export declare const addToCartSchema: z.ZodObject<{
    productVariantId: z.ZodNumber;
    quantity: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateCartItemSchema: z.ZodObject<{
    quantity: z.ZodNumber;
}, z.core.$strip>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
//# sourceMappingURL=dto.d.ts.map