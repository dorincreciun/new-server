import { PrismaClient, Product, Category } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  categoryId: number;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export class ProductService {
  /**
   * Creează un nou produs
   */
  async createProduct(data: CreateProductData): Promise<ProductWithCategory> {
    return await prisma.product.create({
      data,
      include: {
        category: true,
      },
    });
  }

  /**
   * Obține toate produsele
   */
  async getAllProducts(): Promise<ProductWithCategory[]> {
    return await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Obține produsele dintr-o anumită categorie
   */
  async getProductsByCategory(categoryId: number): Promise<ProductWithCategory[]> {
    return await prisma.product.findMany({
      where: {
        categoryId,
      },
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Obține produsele dintr-o anumită categorie (după numele categoriei)
   */
  async getProductsByCategoryName(categoryName: string): Promise<ProductWithCategory[]> {
    return await prisma.product.findMany({
      where: {
        category: {
          name: categoryName,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Obține produsele dintr-o categorie după slug-ul categoriei
   */
  async getProductsByCategorySlug(slug: string): Promise<ProductWithCategory[]> {
    return await prisma.product.findMany({
      where: {
        category: {
          slug,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Obține un produs după ID
   */
  async getProductById(id: number): Promise<ProductWithCategory | null> {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  /**
   * Caută produse după nume (search parțial)
   */
  async searchProductsByName(name: string): Promise<ProductWithCategory[]> {
    return await prisma.product.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Obține produse cu stoc scăzut (sub o anumită valoare)
   */
  async getProductsWithLowStock(threshold: number = 10): Promise<ProductWithCategory[]> {
    return await prisma.product.findMany({
      where: {
        stock: {
          lt: threshold,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        stock: 'asc',
      },
    });
  }

  /**
   * Actualizează un produs
   */
  async updateProduct(id: number, data: UpdateProductData): Promise<ProductWithCategory> {
    return await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  /**
   * Șterge un produs
   */
  async deleteProduct(id: number): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }

  /**
   * Verifică dacă un produs există
   */
  async productExists(id: number): Promise<boolean> {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });
    return product !== null;
  }

  /**
   * Verifică dacă categoria există
   */
  async categoryExists(categoryId: number): Promise<boolean> {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    return category !== null;
  }

  /**
   * Obține numărul total de produse
   */
  async getProductsCount(): Promise<number> {
    return await prisma.product.count();
  }

  /**
   * Obține numărul de produse dintr-o categorie
   */
  async getProductsCountByCategory(categoryId: number): Promise<number> {
    return await prisma.product.count({
      where: {
        categoryId,
      },
    });
  }

  /**
   * Returnează valorile posibile (facets) pentru filtrele dintr-o categorie (după slug)
   * - flags: string[] unice + count
   * - ingredients: string[] unice + count
   * - variants: map cu cheie variantKey -> string[] opțiuni unice + count
   */
  async getFacetsByCategorySlug(slug: string): Promise<{
    flags: { value: string; count: number }[];
    ingredients: { value: string; count: number }[];
    variants: Record<string, { value: string; count: number }[]>;
  }> {
    const products = await prisma.product.findMany({
      where: { category: { slug } },
      select: { flags: true, ingredients: true, variants: true },
    });

    const flagCounts: Record<string, number> = {};
    const ingredientCounts: Record<string, number> = {};
    const variantCounts: Record<string, Record<string, number>> = {};

    for (const p of products) {
      const pFlags = (p.flags as unknown as string[]) || [];
      for (const f of pFlags) {
        const key = String(f).trim();
        if (!key) continue;
        flagCounts[key] = (flagCounts[key] || 0) + 1;
      }

      const pIngr = (p.ingredients as unknown as string[]) || [];
      for (const ing of pIngr) {
        const key = String(ing).trim();
        if (!key) continue;
        ingredientCounts[key] = (ingredientCounts[key] || 0) + 1;
      }

      const pVariants = (p.variants as unknown as Record<string, string[]>) || {};
      for (const [variantKey, options] of Object.entries(pVariants)) {
        if (!variantCounts[variantKey]) variantCounts[variantKey] = {};
        for (const opt of options) {
          const key = String(opt).trim();
          if (!key) continue;
          variantCounts[variantKey][key] = (variantCounts[variantKey][key] || 0) + 1;
        }
      }
    }

    const flags = Object.entries(flagCounts)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value));

    const ingredients = Object.entries(ingredientCounts)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value));

    const variants: Record<string, { value: string; count: number }[]> = {};
    for (const [k, map] of Object.entries(variantCounts)) {
      variants[k] = Object.entries(map)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => a.value.localeCompare(b.value));
    }

    return { flags, ingredients, variants };
  }

  /**
   * Filtrează produsele după criterii variate.
   * - categorySlug: filtrează după categorie (opțional)
   * - search: căutare în nume (opțional)
   * - flags/ingredients: toate valorile selectate trebuie să fie prezente (AND)
   * - variants: filtrare în memorie (suportă chei arbitrare)
   * - priceMin/priceMax: pe câmpurile minPrice/maxPrice
   */
  async filterProductsPaginated(opts: {
    categorySlug?: string;
    search?: string;
    flags?: string[];
    flagsMode?: 'all' | 'any';
    ingredients?: string[];
    ingredientsMode?: 'all' | 'any';
    variants?: string[]; // caută în orice cheie de variantă
    variantsMode?: 'all' | 'any';
    priceMin?: number;
    priceMax?: number;
    page?: number;
    pageSize?: number;
    sortBy?: 'price' | 'createdAt' | 'popularity';
    order?: 'asc' | 'desc';
  }): Promise<{ items: ProductWithCategory[]; total: number; page: number; pageSize: number; }> {
    const {
      categorySlug,
      search,
      flags,
      flagsMode = 'any',
      ingredients,
      ingredientsMode = 'all',
      variants,
      variantsMode = 'any',
      priceMin,
      priceMax,
      page = 1,
      pageSize = 20,
      sortBy = 'createdAt',
      order = 'desc',
    } = opts;

    const andFilters: any[] = [];

    if (categorySlug && categorySlug.trim().length > 0) {
      andFilters.push({ category: { slug: categorySlug } });
    }

    if (search && search.trim()) {
      andFilters.push({ name: { contains: search.trim() } });
    }

    if (flags && flags.length > 0) {
      const cleaned = flags.map((s) => String(s).trim()).filter(Boolean);
      if (cleaned.length > 0) {
        if (flagsMode === 'all') {
          andFilters.push({ flags: { contains: cleaned } });
        } else {
          andFilters.push({ OR: cleaned.map((v) => ({ flags: { contains: [v] } })) });
        }
      }
    }

    if (ingredients && ingredients.length > 0) {
      const cleaned = ingredients.map((s) => String(s).trim()).filter(Boolean);
      if (cleaned.length > 0) {
        if (ingredientsMode === 'all') {
          andFilters.push({ ingredients: { contains: cleaned } });
        } else {
          andFilters.push({ OR: cleaned.map((v) => ({ ingredients: { contains: [v] } })) });
        }
      }
    }

    if (priceMin !== undefined) {
      andFilters.push({ maxPrice: { gte: priceMin } });
    }
    if (priceMax !== undefined) {
      andFilters.push({ minPrice: { lte: priceMax } });
    }

    const where = andFilters.length > 0 ? { AND: andFilters } : {};

    // Total inițial (fără filtrul pe variants)
    const totalPreVariants = await prisma.product.count({ where });

    // Dacă nu avem filtrare pe variants, putem pagina direct în DB
    if (!variants || variants.length === 0) {
      const items = await prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { [sortBy]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      return { items: items as ProductWithCategory[], total: totalPreVariants, page, pageSize };
    }

    // Pentru variants: calculăm ID-urile care corespund în memorie (dintr-un fetch redus)
    const candidates = await prisma.product.findMany({
      where,
      select: { id: true, variants: true },
    });
    const variantWanted = variants.map((s) => String(s).trim()).filter(Boolean);
    const matches = new Set<number>();
    for (const c of candidates) {
      const vmap = (c.variants as unknown as Record<string, string[]>) || {};
      const haveSet = new Set<string>();
      for (const arr of Object.values(vmap)) {
        for (const val of arr || []) haveSet.add(String(val));
      }
      if (variantWanted.length === 0) {
        matches.add(c.id);
      } else if (variantsMode === 'all') {
        if (variantWanted.every((w) => haveSet.has(w))) matches.add(c.id);
      } else {
        if (variantWanted.some((w) => haveSet.has(w))) matches.add(c.id);
      }
    }
    const matchedIds = Array.from(matches);
    const total = matchedIds.length;
    const pageIds = matchedIds.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    if (pageIds.length === 0) {
      return { items: [], total, page, pageSize };
    }
    const items = await prisma.product.findMany({
      where: { id: { in: pageIds } },
      include: { category: true },
      orderBy: { [sortBy]: order },
    });
    return { items: items as ProductWithCategory[], total, page, pageSize };
  }

  /**
   * Actualizează stocul unui produs
   */
  async updateProductStock(id: number, stock: number): Promise<ProductWithCategory> {
    return await prisma.product.update({
      where: { id },
      data: { stock },
      include: {
        category: true,
      },
    });
  }
}
