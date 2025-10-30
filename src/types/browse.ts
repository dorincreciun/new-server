import { z } from 'zod';

// Schema pentru validarea query-urilor de browse
export const BrowseQuerySchema = z.object({
  q: z.string().trim().min(1).optional(),
  categorySlug: z.string().optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  flags: z
    .array(z.string())
    .optional()
    .default([]),
  ingredients: z
    .array(z.string())
    .optional()
    .default([]),
  dough: z.string().optional(),
  size: z.string().optional(),
  isCustomizable: z.coerce.boolean().optional(),
  isNew: z.coerce.boolean().optional(),
  newerThanDays: z.coerce.number().int().min(1).max(365).default(30).optional(),
  sort: z.enum(['price', 'rating', 'popularity', 'newest']).default('newest'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
}).refine((data) => {
  if (data.priceMin !== undefined && data.priceMax !== undefined) {
    return data.priceMin <= data.priceMax;
  }
  return true;
}, {
  message: 'priceMin nu poate fi mai mare decât priceMax',
  path: ['priceMin']
});

export type BrowseQuery = z.infer<typeof BrowseQuerySchema>;

// Tipuri pentru răspunsuri
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
  flags: Array<{ key: string; label?: string | null }>;
  ingredients: Array<{ key: string; label?: string | null }>;
  variants: Array<{
    id: number;
    price: number;
    isDefault: boolean;
    doughType?: { key: string; label?: string | null } | null;
    sizeOption?: { key: string; label?: string | null } | null;
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
