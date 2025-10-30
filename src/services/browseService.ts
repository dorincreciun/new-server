import { PrismaClient } from '@prisma/client';
import { BrowseQuery, ProductWithRelations } from '../types/browse';

const prisma = new PrismaClient();

export class BrowseService {
  private buildWhere(query: BrowseQuery): any {
    const {
      q,
      categorySlug,
      priceMin,
      priceMax,
      flags,
      ingredients,
      dough,
      size,
      isCustomizable,
      isNew,
      newerThanDays,
    } = query;

    const where: any = { AND: [] };

    if (categorySlug) {
      where.AND.push({ category: { slug: categorySlug } });
    }

    if (q) {
      where.AND.push({ OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ]});
    }

    if (priceMin !== undefined) {
      where.AND.push({ minPrice: { gte: priceMin } });
    }

    if (priceMax !== undefined) {
      where.AND.push({ minPrice: { lte: priceMax } });
    }

    if (typeof isCustomizable === 'boolean') {
      where.AND.push({ isCustomizable });
    }

    if (isNew === true) {
      const days = newerThanDays ?? 30;
      const threshold = new Date();
      threshold.setDate(threshold.getDate() - days);
      where.AND.push({ releasedAt: { gte: threshold } });
    }

    if (flags && flags.length > 0) {
      for (const key of flags) {
        where.AND.push({ flags: { some: { flag: { key } } } });
      }
    }

    if (ingredients && ingredients.length > 0) {
      for (const key of ingredients) {
        where.AND.push({ ingredients: { some: { ingredient: { key } } } });
      }
    }

    const variantAND: any[] = [];
    if (dough) {
      variantAND.push({ dough: { key: dough } });
    }
    if (size) {
      variantAND.push({ size: { key: size } });
    }
    if (variantAND.length > 0) {
      where.AND.push({ variants: { some: { AND: variantAND } } });
    }

    return where.AND.length ? where : {};
  }

  async getProducts(query: BrowseQuery): Promise<{
    products: ProductWithRelations[];
    total: number;
  }> {
    const { sort, order, page } = query;
    const DEFAULT_LIMIT = 20;

    const where = this.buildWhere(query);

    // Construiește orderBy
    let orderBy: any = {};
    switch (sort) {
      case 'price':
        orderBy = { minPrice: order };
        break;
      case 'rating':
        orderBy = { ratingAverage: order };
        break;
      case 'popularity':
        orderBy = { popularity: order };
        break;
      case 'newest':
        orderBy = [
          { releasedAt: order },
          { createdAt: order }
        ];
        break;
    }

    const skip = (page - 1) * DEFAULT_LIMIT;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          flags: { include: { flag: true } },
          ingredients: { include: { ingredient: true } },
          variants: { include: { dough: true, size: true } }
        },
        orderBy,
        skip,
        take: DEFAULT_LIMIT,
      }),
      prisma.product.count({ where })
    ]);

    // Transformă produsele în formatul dorit
    const transformedProducts: ProductWithRelations[] = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      basePrice: Number(product.basePrice),
      minPrice: product.minPrice ? Number(product.minPrice) : null,
      maxPrice: product.maxPrice ? Number(product.maxPrice) : null,
      imageUrl: product.imageUrl,
      popularity: product.popularity,
      isCustomizable: product.isCustomizable,
      releasedAt: product.releasedAt,
      ratingAverage: product.ratingAverage ? Number(product.ratingAverage) : null,
      ratingCount: product.ratingCount,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      },
      flags: product.flags.map(pf => ({
        key: pf.flag.key,
        label: pf.flag.label
      })),
      ingredients: product.ingredients.map(pi => ({
        key: pi.ingredient.key,
        label: pi.ingredient.label
      })),
      variants: product.variants.map(pv => ({
        id: pv.id,
        price: Number(pv.price),
        isDefault: pv.isDefault,
        doughType: pv.dough ? {
          key: pv.dough.key,
          label: pv.dough.label
        } : null,
        sizeOption: pv.size ? {
          key: pv.size.key,
          label: pv.size.label
        } : null,
      }))
    }));

    return {
      products: transformedProducts,
      total
    };
  }

  async getFilters(query: BrowseQuery): Promise<{
    flags: Array<{ key: string; label?: string | null; count: number }>;
    ingredients: Array<{ key: string; label?: string | null; count: number }>;
    doughTypes: Array<{ key: string; label?: string | null; count: number }>;
    sizeOptions: Array<{ key: string; label?: string | null; count: number }>;
    price: { min: number; max: number };
  }> {
    // Construiește contextul filtrării (global sau contextual) în funcție de toți parametrii existenți
    const where = this.buildWhere(query);

    const products = await prisma.product.findMany({
      where,
      include: {
        flags: { include: { flag: true } },
        ingredients: { include: { ingredient: true } },
        variants: { include: { dough: true, size: true } }
      }
    });

    const flagMap = new Map<string, { label: string | null; count: number }>();
    const ingredientMap = new Map<string, { label: string | null; count: number }>();
    const doughMap = new Map<string, { label: string | null; count: number }>();
    const sizeMap = new Map<string, { label: string | null; count: number }>();

    let minPrice = Number.POSITIVE_INFINITY;
    let maxPrice = 0;

    products.forEach(product => {
      const mp = product.minPrice ? Number(product.minPrice) : Number(product.basePrice);
      const xp = product.maxPrice ? Number(product.maxPrice) : Number(product.basePrice);
      if (mp < minPrice) minPrice = mp;
      if (xp > maxPrice) maxPrice = xp;

      product.flags.forEach(pf => {
        const key = pf.flag.key;
        const label = pf.flag.label ?? null;
        const current = flagMap.get(key) || { label, count: 0 };
        flagMap.set(key, { label: current.label ?? label, count: current.count + 1 });
      });

      product.ingredients.forEach(pi => {
        const key = pi.ingredient.key;
        const label = pi.ingredient.label ?? null;
        const current = ingredientMap.get(key) || { label, count: 0 };
        ingredientMap.set(key, { label: current.label ?? label, count: current.count + 1 });
      });

      product.variants.forEach(pv => {
        if (pv.dough) {
          const key = pv.dough.key;
          const label = pv.dough.label ?? null;
          const current = doughMap.get(key) || { label, count: 0 };
          doughMap.set(key, { label: current.label ?? label, count: current.count + 1 });
        }
        if (pv.size) {
          const key = pv.size.key;
          const label = pv.size.label ?? null;
          const current = sizeMap.get(key) || { label, count: 0 };
          sizeMap.set(key, { label: current.label ?? label, count: current.count + 1 });
        }
      });
    });

    if (minPrice === Number.POSITIVE_INFINITY) {
      minPrice = 0;
      maxPrice = 0;
    }

    return {
      flags: Array.from(flagMap.entries()).map(([key, v]) => ({ key, label: v.label, count: v.count })),
      ingredients: Array.from(ingredientMap.entries()).map(([key, v]) => ({ key, label: v.label, count: v.count })),
      doughTypes: Array.from(doughMap.entries()).map(([key, v]) => ({ key, label: v.label, count: v.count })),
      sizeOptions: Array.from(sizeMap.entries()).map(([key, v]) => ({ key, label: v.label, count: v.count })),
      price: { min: Math.floor(minPrice), max: Math.ceil(maxPrice) }
    };
  }
}
