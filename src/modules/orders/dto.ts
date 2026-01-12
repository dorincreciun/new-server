import { z } from 'zod';

export const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Numele este obligatoriu'),
    email: z.string().email('Email invalid').optional(),
    phone: z.string().min(1, 'Telefonul este obligatoriu'),
  }),
  address: z.object({
    city: z.string().min(1, 'Orașul este obligatoriu'),
    street: z.string().min(1, 'Strada este obligatorie'),
    house: z.string().min(1, 'Numărul casei este obligatoriu'),
    apartment: z.string().optional(),
    comment: z.string().optional(),
  }),
  paymentMethod: z.enum(['CASH', 'CARD_ON_DELIVERY', 'ONLINE']).optional(),
});

export const getOrdersSchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type GetOrdersInput = z.infer<typeof getOrdersSchema>;
