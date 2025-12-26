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
    const { categorySlug } = query;
    const where: any = {};
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    // Agregări performante
    const [priceRange, categoriesWithCounts] = await Promise.all([
      prisma.product.aggregate({
        where,
        _min: { minPrice: true },
        _max: { maxPrice: true },
      }),
      prisma.category.findMany({
        include: {
          _count: {
            select: { products: { where } }
          }
        }
      })
    ]);

    return {
      price: {
        min: Number(priceRange._min.minPrice || 0),
        max: Number(priceRange._max.maxPrice || 0),
      },
      categories: categoriesWithCounts.map(c => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        count: c._count.products,
      })).filter(c => c.count > 0),
    };
  }
}

export const browseService = new BrowseService();
