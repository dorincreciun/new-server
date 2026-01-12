import { z } from 'zod';

export const browseProductsSchema = z.object({
  q: z.string().trim().min(1).optional(),
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
  isCustomizable: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  isNew: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  sort: z.enum(['price', 'rating', 'popularity', 'newest']).default('popularity'),
  order: z.enum(['asc', 'desc']).default('desc'),
}).refine((data) => {
  if (data.priceMin !== undefined && data.priceMax !== undefined) {
    return data.priceMin <= data.priceMax;
  }
  return true;
}, {
  message: 'priceMin nu poate fi mai mare decât priceMax',
  path: ['priceMin']
});

export const browseFiltersSchema = z.object({
  categorySlug: z.string().optional(),
  q: z.string().optional(),
});

export const searchSuggestSchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().int().positive().default(5),
});

export type BrowseProductsInput = z.infer<typeof browseProductsSchema>;
export type BrowseFiltersInput = z.infer<typeof browseFiltersSchema>;
export type SearchSuggestInput = z.infer<typeof searchSuggestSchema>;
