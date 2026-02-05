import { z } from 'zod';

const browseBaseFiltersSchema = z.object({
  q: z
    .string()
    .optional()
    .transform((val) => {
      if (val === undefined) return undefined;
      const trimmed = val.trim();
      return trimmed.length ? trimmed : undefined;
    }),
  categorySlug: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  flags: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return [] as string[];
      if (Array.isArray(val)) return val.map((s) => s.trim()).filter(Boolean);
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }),
  ingredients: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => {
      if (!val) return [] as string[];
      if (Array.isArray(val)) return val.map((s) => s.trim()).filter(Boolean);
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }),
  dough: z.string().optional(),
  size: z.string().optional(),
  isCustomizable: z
    .preprocess((val) => val === 'true' || val === true, z.boolean())
    .optional(),
  isNew: z
    .preprocess((val) => val === 'true' || val === true, z.boolean())
    .optional(),
});

const priceRangeConstraint = (data: any) => {
  const { priceMin, priceMax } = data as { priceMin?: number; priceMax?: number };
  if (priceMin !== undefined && priceMax !== undefined) {
    return priceMin <= priceMax;
  }
  return true;
};

export const browseProductsSchema = browseBaseFiltersSchema
  .extend({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(12),
    sort: z.enum(['price', 'rating', 'popularity', 'newest']).default('popularity'),
    order: z.enum(['asc', 'desc']).default('desc'),
  })
  .refine(priceRangeConstraint, {
    message: 'priceMin nu poate fi mai mare decât priceMax',
    path: ['priceMin'],
  });

export const browseFiltersSchema = browseBaseFiltersSchema.refine(priceRangeConstraint, {
  message: 'priceMin nu poate fi mai mare decât priceMax',
  path: ['priceMin'],
});

export type BrowseProductsInput = z.infer<typeof browseProductsSchema>;
export type BrowseFiltersInput = z.infer<typeof browseFiltersSchema>;
