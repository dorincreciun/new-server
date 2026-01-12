import { Prisma } from '@prisma/client';

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    flags: { include: { flag: true } };
    ingredients: { include: { ingredient: true } };
    variants: { include: { dough: true; size: true } };
  };
}>;

/**
 * Formatează un număr Decimal din Prisma în number
 */
export function formatDecimal(value: Prisma.Decimal | number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  return parseFloat(value.toString());
}

/**
 * Formatează un produs din Prisma în formatul API
 */
export function formatProduct(product: ProductWithRelations) {
  // Calculează minPrice și maxPrice din variante
  const prices = product.variants.map(v => formatDecimal(v.price));
  const minPrice = prices.length > 0 ? Math.min(...prices) : formatDecimal(product.basePrice);
  const maxPrice = prices.length > 0 ? Math.max(...prices) : formatDecimal(product.basePrice);

  const result: any = {
    id: product.id,
    name: product.name,
    description: product.description,
    imageUrl: product.imageUrl,
    minPrice,
    maxPrice: maxPrice !== minPrice ? maxPrice : null,
    ratingAverage: product.ratingAverage ? formatDecimal(product.ratingAverage) : null,
    ratingCount: product.ratingCount,
    popularity: product.popularity,
    isCustomizable: product.isCustomizable,
    ingredients: product.ingredients.map(pi => ({
      id: pi.ingredient.id,
      key: pi.ingredient.key,
      label: pi.ingredient.label,
    })),
    flags: product.flags.map(pf => ({
      id: pf.flag.id,
      key: pf.flag.key,
      label: pf.flag.label,
    })),
    variants: product.variants.map(v => ({
      id: v.id,
      price: formatDecimal(v.price),
      isDefault: v.isDefault,
      doughType: v.dough ? {
        id: v.dough.id,
        key: v.dough.key,
        label: v.dough.label,
      } : null,
      sizeOption: v.size ? {
        id: v.size.id,
        key: v.size.key,
        label: v.size.label,
      } : null,
    })),
  };

  if (product.category) {
    result.category = {
      name: product.category.name,
      slug: product.category.slug,
    };
  }

  return result;
}
