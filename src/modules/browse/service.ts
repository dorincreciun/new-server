import prisma from '../../shared/prisma/client';
import { BrowseProductsInput, BrowseFiltersInput } from './dto';
import { formatProduct } from '../../shared/utils/formatters';

export class BrowseService {
  async getProducts(query: BrowseProductsInput) {
    const {
      q,
      categorySlug,
      page,
      limit,
      sort,
      order,
      priceMin,
      priceMax,
      flags,
      ingredients,
      dough,
      size,
      isCustomizable,
      isNew,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = { AND: [] };

    if (categorySlug) {
      where.AND.push({ category: { slug: categorySlug } });
    }

    if (q) {
      where.AND.push({
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
        ],
      });
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
      const threshold = new Date();
      threshold.setDate(threshold.getDate() - 30); // 30 zile default
      where.AND.push({ releasedAt: { gte: threshold } });
    }

    if (flags && flags.length > 0) {
      flags.forEach((key) => {
        where.AND.push({ flags: { some: { flag: { key } } } });
      });
    }

    if (ingredients && ingredients.length > 0) {
      ingredients.forEach((key) => {
        where.AND.push({ ingredients: { some: { ingredient: { key } } } });
      });
    }

    if (dough || size) {
      const variantWhere: any = {};
      if (dough) variantWhere.dough = { key: dough };
      if (size) variantWhere.size = { key: size };
      where.AND.push({ variants: { some: variantWhere } });
    }

    const finalWhere = where.AND.length > 0 ? where : {};

    let orderBy: any = {};
    if (sort === 'price') orderBy = { minPrice: order };
    else if (sort === 'rating') orderBy = { ratingAverage: order };
    else if (sort === 'popularity') orderBy = { popularity: order };
    else if (sort === 'newest') orderBy = { releasedAt: order };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: finalWhere,
        include: {
          category: true,
          flags: { include: { flag: true } },
          ingredients: { include: { ingredient: true } },
          variants: { include: { dough: true, size: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where: finalWhere }),
    ]);

    const formattedProducts = products.map(formatProduct);

    return {
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getFilters(query: BrowseFiltersInput) {
    const { categorySlug, q } = query;
    const where: any = { AND: [] };
    if (categorySlug) {
      where.AND.push({ category: { slug: categorySlug } });
    }
    if (q) {
      where.AND.push({
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
        ],
      });
    }

    const finalWhere = where.AND.length > 0 ? where : {};

    const products = await prisma.product.findMany({
      where: finalWhere,
      include: {
        category: true,
        flags: { include: { flag: true } },
        ingredients: { include: { ingredient: true } },
        variants: { include: { dough: true, size: true } }
      }
    });

    const flagMap = new Map<string, { id: number; label: string | null; count: number }>();
    const ingredientMap = new Map<string, { id: number; label: string | null; count: number }>();
    const doughMap = new Map<string, { id: number; label: string | null; count: number }>();
    const sizeMap = new Map<string, { id: number; label: string | null; count: number }>();
    const categoryMap = new Map<number, { slug: string; name: string; count: number }>();

    let minPrice = Number.POSITIVE_INFINITY;
    let maxPrice = 0;

    products.forEach(product => {
      const mp = product.minPrice ? Number(product.minPrice) : Number(product.basePrice);
      const xp = product.maxPrice ? Number(product.maxPrice) : Number(product.basePrice);
      if (mp < minPrice) minPrice = mp;
      if (xp > maxPrice) maxPrice = xp;

      // Category count
      const cat = product.category;
      const currentCat = categoryMap.get(cat.id) || { slug: cat.slug, name: cat.name, count: 0 };
      categoryMap.set(cat.id, { ...currentCat, count: currentCat.count + 1 });

      product.flags.forEach(pf => {
        const key = pf.flag.key;
        const current = flagMap.get(key) || { id: pf.flag.id, label: pf.flag.label, count: 0 };
        flagMap.set(key, { ...current, count: current.count + 1 });
      });

      product.ingredients.forEach(pi => {
        const key = pi.ingredient.key;
        const current = ingredientMap.get(key) || { id: pi.ingredient.id, label: pi.ingredient.label, count: 0 };
        ingredientMap.set(key, { ...current, count: current.count + 1 });
      });

      product.variants.forEach(pv => {
        if (pv.dough) {
          const key = pv.dough.key;
          const current = doughMap.get(key) || { id: pv.dough.id, label: pv.dough.label, count: 0 };
          doughMap.set(key, { ...current, count: current.count + 1 });
        }
        if (pv.size) {
          const key = pv.size.key;
          const current = sizeMap.get(key) || { id: pv.size.id, label: pv.size.label, count: 0 };
          sizeMap.set(key, { ...current, count: current.count + 1 });
        }
      });
    });

    if (minPrice === Number.POSITIVE_INFINITY) {
      minPrice = 0;
      maxPrice = 0;
    }

    return {
      price: { min: Math.floor(minPrice), max: Math.ceil(maxPrice) },
      categories: Array.from(categoryMap.entries()).map(([id, v]) => ({ id, slug: v.slug, name: v.name, count: v.count })),
      flags: Array.from(flagMap.entries()).map(([key, v]) => ({ id: v.id, key, label: v.label, count: v.count })),
      ingredients: Array.from(ingredientMap.entries()).map(([key, v]) => ({ id: v.id, key, label: v.label, count: v.count })),
      doughTypes: Array.from(doughMap.entries()).map(([key, v]) => ({ id: v.id, key, label: v.label, count: v.count })),
      sizeOptions: Array.from(sizeMap.entries()).map(([key, v]) => ({ id: v.id, key, label: v.label, count: v.count })),
    };
  }

  async getSuggestions(q: string, limit: number = 5) {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { category: { name: { contains: q } } }
        ]
      },
      take: limit,
      include: {
        category: true
      }
    });

    return products.map(p => ({
      id: p.id,
      name: p.name,
      categorySlug: p.category.slug,
      imageUrl: p.imageUrl
    }));
  }
}

export const browseService = new BrowseService();
