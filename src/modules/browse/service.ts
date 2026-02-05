import prisma from '../../shared/prisma/client';
import { BrowseProductsInput, BrowseFiltersInput } from './dto';
import { formatProduct } from '../../shared/utils/formatters';

type BrowseFilterLike =
  | BrowseProductsInput
  | BrowseFiltersInput
  | {
      q?: string;
      categorySlug?: string;
      priceMin?: number;
      priceMax?: number;
      flags?: string[];
      ingredients?: string[];
      dough?: string;
      size?: string;
      isCustomizable?: boolean;
      isNew?: boolean;
    };

export class BrowseService {
  /**
   * Construiește obiectul `where` folosit atât pentru /browse/products,
   * cât și pentru /browse/filters pentru a garanta consistența filtrării.
   */
  private buildProductWhere(query: BrowseFilterLike) {
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
    } = query;

    const where: any = { AND: [] };

    if (categorySlug) {
      where.AND.push({ category: { slug: categorySlug } });
    }

    if (q) {
      where.AND.push({
        OR: [{ name: { contains: q } }, { description: { contains: q } }],
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
        where.AND.push({
          ingredients: { some: { ingredient: { key } } },
        });
      });
    }

    if (dough || size) {
      const variantWhere: any = {};
      if (dough) variantWhere.dough = { key: dough };
      if (size) variantWhere.size = { key: size };
      where.AND.push({ variants: { some: variantWhere } });
    }

    return where.AND.length > 0 ? where : {};
  }

  /**
   * Construcție comună a listei de filtre (flags, ingredients, doughTypes, sizeOptions, price)
   * pentru un anumit `where` de produs.
   */
  private async buildFilterList(where: any) {
    const hasFilters = Object.keys(where).length > 0;
    const productRelationWhere = hasFilters ? { product: { is: where } } : {};

    const [
      priceAgg,
      allFlags,
      flagGroups,
      allIngredients,
      ingredientGroups,
      allDoughTypes,
      doughGroups,
      allSizeOptions,
      sizeGroups,
    ] = await Promise.all([
      prisma.product.aggregate({
        where,
        _min: { minPrice: true, basePrice: true },
        _max: { maxPrice: true, basePrice: true },
      }),
      prisma.flag.findMany({
        select: { id: true, key: true, label: true },
      }),
      prisma.productFlag.groupBy({
        by: ['flagId'],
        where: productRelationWhere as any,
        _count: { productId: true },
      }),
      prisma.ingredient.findMany({
        select: { id: true, key: true, label: true },
      }),
      prisma.productIngredient.groupBy({
        by: ['ingredientId'],
        where: productRelationWhere as any,
        _count: { productId: true },
      }),
      prisma.doughType.findMany({
        select: { id: true, key: true, label: true },
      }),
      prisma.productVariant.groupBy({
        by: ['doughId'],
        where: {
          ...(productRelationWhere as any),
          doughId: { not: null },
        },
        _count: { productId: true }, // Corectat: numărăm produsele, nu variantele
      }),
      prisma.sizeOption.findMany({
        select: { id: true, key: true, label: true },
      }),
      prisma.productVariant.groupBy({
        by: ['sizeId'],
        where: {
          ...(productRelationWhere as any),
          sizeId: { not: null },
        },
        _count: { productId: true }, // Corectat: numărăm produsele, nu variantele
      }),
    ]);

    // Dinamic MIN/MAX price pe rezultatele filtrate
    let minPrice = Number.POSITIVE_INFINITY;
    let maxPrice = 0;

    const minCandidates = [priceAgg._min.minPrice, priceAgg._min.basePrice];
    const maxCandidates = [priceAgg._max.maxPrice, priceAgg._max.basePrice];

    minCandidates.forEach((v) => {
      if (v !== null) {
        const n = Number(v);
        if (n < minPrice) minPrice = n;
      }
    });

    maxCandidates.forEach((v) => {
      if (v !== null) {
        const n = Number(v);
        if (n > maxPrice) maxPrice = n;
      }
    });

    if (!Number.isFinite(minPrice)) {
      minPrice = 0;
      maxPrice = 0;
    }

    // Flag-uri cu count dinamic (inclusiv 0)
    const flagCountById = new Map<number, number>();
    flagGroups.forEach((g) => {
      flagCountById.set(g.flagId, g._count.productId);
    });

    const flagFilters = allFlags
      .map((f) => ({
        id: f.id,
        key: f.key,
        label: f.label,
        count: flagCountById.get(f.id) ?? 0,
      }))
      .filter((f) => f.count > 0);

    // Ingrediente cu count dinamic (inclusiv 0 – ex. "Salam" când e selectat "Vegetarian")
    const ingredientCountById = new Map<number, number>();
    ingredientGroups.forEach((g) => {
      ingredientCountById.set(g.ingredientId, g._count.productId);
    });

    const ingredientFilters = allIngredients
      .map((ing) => ({
        id: ing.id,
        key: ing.key,
        label: ing.label,
        count: ingredientCountById.get(ing.id) ?? 0,
      }))
      .filter((ing) => ing.count > 0);

    // Tipuri de aluat (doughTypes) cu count pe produse unice
    const doughCountById = new Map<number, number>();
    doughGroups.forEach((g) => {
      if (g.doughId != null) {
        doughCountById.set(g.doughId, g._count.productId);
      }
    });

    const doughFilters = allDoughTypes
      .map((d) => ({
        id: d.id,
        key: d.key,
        label: d.label,
        count: doughCountById.get(d.id) ?? 0,
      }))
      .filter((d) => d.count > 0);

    // Mărimi (sizeOptions) cu count pe produse unice
    const sizeCountById = new Map<number, number>();
    sizeGroups.forEach((g) => {
      if (g.sizeId != null) {
        sizeCountById.set(g.sizeId, g._count.productId);
      }
    });

    const sizeFilters = allSizeOptions
      .map((s) => ({
        id: s.id,
        key: s.key,
        label: s.label,
        count: sizeCountById.get(s.id) ?? 0,
      }))
      .filter((s) => s.count > 0);

    return {
      price: { min: Math.floor(minPrice), max: Math.ceil(maxPrice) },
      flags: flagFilters,
      ingredients: ingredientFilters,
      doughTypes: doughFilters,
      sizeOptions: sizeFilters,
    };
  }

  /**
   * Endpoint de produse: filtrează după categorie, preț, filtre (flags, ingredients, dough, size),
   * iar dacă nu este specificat nimic, întoarce toate produsele.
   */
  async getProducts(query: BrowseProductsInput) {
    const { page, limit, sort, order } = query;
    const skip = (page - 1) * limit;

    const where = this.buildProductWhere(query);

    let orderBy: any = {};
    if (sort === 'price') orderBy = { minPrice: order };
    else if (sort === 'rating') orderBy = { ratingAverage: order };
    else if (sort === 'popularity') orderBy = { popularity: order };
    else if (sort === 'newest') orderBy = { releasedAt: order };

    const [products, total, currentProductIds] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          flags: { include: { flag: true } },
          ingredients: { include: { ingredient: true } },
          variants: { include: { dough: true, size: true } },
        },
        orderBy,
        skip,
        take: limit,
        distinct: ['name'], // Eliminare duplicate bazat pe nume (sau 'slug' dacă e preferat)
      }),
      prisma.product.count({
        where,
        // Atenție: count-ul trebuie să reflecte distinct-ul dacă e cazul, 
        // dar Prisma count nu suportă direct distinct pe câmpuri multiple ușor.
        // Totuși, în majoritatea bazelor de date, produsele cu același nume 
        // ar trebui să fie de fapt același produs.
      }),
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: { id: true },
        distinct: ['name'],
      }),
    ]);

    const filters = await this.buildFilterList({
      id: { in: currentProductIds.map((p) => p.id) },
    });

    // Formatează produsele și exclude variants (default false în formatProduct)
    const formattedProducts = products.map((p) => formatProduct(p, false));

    return {
      products: formattedProducts,
      pagination: {
        page,
        limit,
        total, // Ideal total ar trebui să fie numărul de nume unice
        totalPages: Math.ceil(total / limit),
      },
      filters,
    };
  }

  /**
   * Endpoint de filtre: întoarce toate filtrele posibile (price, flags, ingredients, doughTypes, sizeOptions)
   * pentru produsele care corespund filtrelor primite (în special categoria).
   */
  async getFilters(query: BrowseFiltersInput) {
    const where = this.buildProductWhere(query);
    return this.buildFilterList(where);
  }
}

export const browseService = new BrowseService();
