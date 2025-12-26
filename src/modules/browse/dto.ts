import { z } from 'zod';

export const browseProductsSchema = z.object({
  q: z.string().optional(),
  categorySlug: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(12),
  sort: z.enum(['price', 'rating', 'popularity', 'newest']).default('popularity'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const browseFiltersSchema = z.object({
  categorySlug: z.string().optional(),
});

export type BrowseProductsInput = z.infer<typeof browseProductsSchema>;
export type BrowseFiltersInput = z.infer<typeof browseFiltersSchema>;
