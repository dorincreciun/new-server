import { z } from 'zod';
export declare const checkoutSchema: z.ZodObject<{
    customer: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodString;
    }, z.core.$strip>;
    address: z.ZodObject<{
        city: z.ZodString;
        street: z.ZodString;
        house: z.ZodString;
        apartment: z.ZodOptional<z.ZodString>;
        comment: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    paymentMethod: z.ZodOptional<z.ZodEnum<{
        CASH: "CASH";
        CARD_ON_DELIVERY: "CARD_ON_DELIVERY";
        ONLINE: "ONLINE";
    }>>;
}, z.core.$strip>;
export declare const getOrdersSchema: z.ZodObject<{
    page: z.ZodOptional<z.ZodDefault<z.ZodCoercedNumber<unknown>>>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type GetOrdersInput = z.infer<typeof getOrdersSchema>;
//# sourceMappingURL=dto.d.ts.map