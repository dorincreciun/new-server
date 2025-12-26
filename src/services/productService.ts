import { PrismaClient, Product, Category } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateProductData {
  name: string;
  description?: string | null; // Prisma așteaptă null pentru câmpurile nullable
  basePrice: number;
  stock?: number; // opțional; dacă lipsește, folosim 0 sau lăsăm Prisma să aplice default-ul
  categoryId: number;
  imageUrl?: string | null; // Prisma așteaptă null pentru nullable
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  basePrice?: number;
  stock?: number;
  categoryId?: number;
  imageUrl?: string | null;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export class ProductService {
  /**
   * Creează un nou produs
   */
  async createProduct(data: CreateProductData): Promise<ProductWithCategory> {
    const created = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        basePrice: data.basePrice,
        // dacă modelul are default pentru stock, îl putem omite când e undefined
        ...(data.stock !== undefined ? { stock: data.stock } : {}),
        categoryId: data.categoryId,
        imageUrl: data.imageUrl ?? null,
      },
      include: {
        category: true,
      },
    });
    // asigurăm tiparea pentru rezultat cu relația category inclusă
    return created as unknown as ProductWithCategory;
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
        // Include toate relațiile relevante pentru a întoarce "toată informația"
        category: true,
        flags: {
          include: { flag: true },
        },
        ingredients: {
          include: { ingredient: true },
        },
        variants: {
          include: {
            dough: true,
            size: true,
          },
        },
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
    // Obține toate flagurile pentru produsele din categorie
    const flags = await prisma.flag.findMany({
      where: {
        products: {
          some: {
            product: {
              category: { slug }
            }
          }
        }
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    // Obține toate ingredientele pentru produsele din categorie
    const ingredients = await prisma.ingredient.findMany({
      where: {
        products: {
          some: {
            product: {
              category: { slug }
            }
          }
        }
      },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    // Obține toate tipurile de aluat pentru produsele din categorie
    const doughTypes = await prisma.doughType.findMany({
      where: {
        variants: {
          some: {
            product: {
              category: { slug }
            }
          }
        }
      },
      include: {
        _count: {
          select: { variants: true }
        }
      }
    });

    // Obține toate opțiunile de mărime pentru produsele din categorie
    const sizeOptions = await prisma.sizeOption.findMany({
      where: {
        variants: {
          some: {
            product: {
              category: { slug }
            }
          }
        }
      },
      include: {
        _count: {
          select: { variants: true }
        }
      }
    });

    const flagCounts: Record<string, number> = {};
    const ingredientCounts: Record<string, number> = {};
    const variantCounts: Record<string, Record<string, number>> = {};

    // Procesează flagurile
    for (const flag of flags) {
      flagCounts[flag.key] = flag._count.products;
    }

    // Procesează ingredientele
    for (const ingredient of ingredients) {
      ingredientCounts[ingredient.key] = ingredient._count.products;
    }

    // Procesează tipurile de aluat
    for (const doughType of doughTypes) {
      if (!variantCounts['doughType']) variantCounts['doughType'] = {};
      variantCounts['doughType'][doughType.key] = doughType._count.variants;
    }

    // Procesează opțiunile de mărime
    for (const sizeOption of sizeOptions) {
      if (!variantCounts['sizeOption']) variantCounts['sizeOption'] = {};
      variantCounts['sizeOption'][sizeOption.key] = sizeOption._count.variants;
    }

    const flagsResult = Object.entries(flagCounts)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value));

    const ingredientsResult = Object.entries(ingredientCounts)
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value));

    const variants: Record<string, { value: string; count: number }[]> = {};
    for (const [k, map] of Object.entries(variantCounts)) {
      variants[k] = Object.entries(map)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => a.value.localeCompare(b.value));
    }

    return { flags: flagsResult, ingredients: ingredientsResult, variants };
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
    categorySlug?: string | undefined;
    search?: string | undefined;
    flags?: string[] | undefined;
    flagsMode?: 'all' | 'any';
    ingredients?: string[] | undefined;
    ingredientsMode?: 'all' | 'any';
    variants?: string[] | undefined; // caută în orice cheie de variantă
    variantsMode?: 'all' | 'any';
    priceMin?: number | undefined;
    priceMax?: number | undefined;
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

    // Vom construi filtrele în doi pași pentru a permite fallback de tip OR când AND nu găsește nimic
    const baseAndFilters: any[] = [];

    if (categorySlug && categorySlug.trim().length > 0) {
      baseAndFilters.push({ category: { slug: categorySlug } });
    }

    // Pre-procesare search: eliminăm stopwords uzuale și token-urile foarte scurte
    const STOPWORDS_RO = new Set([
      'si','sau','de','la','cu','pe','in','din','pentru','un','o','una','unei','unui','al','a','ai','ale','alei','aleor','aleea','este','e','ca','care','ce','mai','foarte','fara','între','prin','lui','ei','lor','sa','să','va','vă','nu','da'
    ].map(s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()));

    // Normalizare fără folosirea Unicode property escapes (compatibilă cu versiuni mai vechi de Node)
    const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const rawWords = (search && search.trim()) ? search.trim().split(/\s+/).filter(Boolean) : [];
    const filteredWords = rawWords.filter(w => {
      const nw = norm(w);
      return nw.length > 2 && !STOPWORDS_RO.has(nw);
    });

    const buildSearchFilters = (words: string[], mode: 'AND' | 'OR'): any[] => {
      // Potrivirea case-insensitive se bazează pe collation-ul MySQL (ex: utf8mb4_general_ci).
      // Nu folosim `mode: 'insensitive'` deoarece nu este suportat pe MySQL în Prisma.
      const makeFieldConds = (w: string) => {
        const contains = { contains: w };
        return [
          { name: contains },
          { description: contains },
          { category: { name: contains } },
          { category: { slug: contains } },
        ];
      };

      if (!words || words.length === 0) {
        // Dacă nu rămân cuvinte, folosim tot șirul ca un singur termen
        if (!search || !search.trim()) return [];
        return [{ OR: makeFieldConds(search.trim()) }];
      }

      if (mode === 'AND') {
        return words.map(w => ({ OR: makeFieldConds(w) }));
      } else {
        return [{ OR: words.flatMap(w => makeFieldConds(w)) }];
      }
    };

    // Vom construi separat filtrele pentru search și restul filtrelor, pentru a putea reconstrui ușor fallback-ul
    const otherFilters: any[] = [];

    if (flags && flags.length > 0) {
      const cleaned = flags.map((s) => String(s).trim()).filter(Boolean);
      if (cleaned.length > 0) {
        if (flagsMode === 'all') {
          // AND logic: fiecare cheie trebuie să existe ca flag
          for (const key of cleaned) {
            otherFilters.push({ flags: { some: { flag: { key } } } });
          }
        } else {
          otherFilters.push({
            flags: {
              some: {
                flag: { key: { in: cleaned } }
              }
            }
          });
        }
      }
    }

    if (ingredients && ingredients.length > 0) {
      const cleaned = ingredients.map((s) => String(s).trim()).filter(Boolean);
      if (cleaned.length > 0) {
        if (ingredientsMode === 'all') {
          // AND logic: fiecare ingredient din listă trebuie să existe
          for (const key of cleaned) {
            otherFilters.push({ ingredients: { some: { ingredient: { key } } } });
          }
        } else {
          otherFilters.push({
            ingredients: {
              some: {
                ingredient: { key: { in: cleaned } }
              }
            }
          });
        }
      }
    }

    if (priceMin !== undefined) {
      otherFilters.push({ maxPrice: { gte: priceMin } });
    }
    if (priceMax !== undefined) {
      otherFilters.push({ minPrice: { lte: priceMax } });
    }

    // Încercare 1: AND între cuvinte (combinat cu celelalte filtre)
    let andFilters: any[] = [
      ...baseAndFilters,
      ...buildSearchFilters(filteredWords, 'AND'),
      ...otherFilters,
    ];
    let where: any = andFilters.length > 0 ? { AND: andFilters } : {};

    // Total inițial (fără filtrul pe variants)
    let totalPreVariants = await prisma.product.count({ where });

    // Fallback: dacă nu s-a găsit nimic și avem mai multe cuvinte, încercăm OR între cuvinte
    if (totalPreVariants === 0 && filteredWords.length > 1) {
      andFilters = [
        ...baseAndFilters,
        ...buildSearchFilters(filteredWords, 'OR'),
        ...otherFilters,
      ];
      where = andFilters.length > 0 ? { AND: andFilters } : {};
      totalPreVariants = await prisma.product.count({ where });
    }

    // Dacă nu avem filtrare pe variants, putem pagina direct în DB
    if (!variants || variants.length === 0) {
      const items = await prisma.product.findMany({
        where,
        include: { 
          category: true,
          flags: {
            include: { flag: true }
          },
          ingredients: {
            include: { ingredient: true }
          },
          variants: {
            include: { 
              dough: true,
              size: true
            }
          }
        },
        orderBy: { [(sortBy === 'price' ? 'basePrice' : sortBy)]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });
      return { items: items as ProductWithCategory[], total: totalPreVariants, page, pageSize };
    }

    // Pentru variants: calculăm ID-urile care corespund folosind relațiile many-to-many
    const candidates = await prisma.product.findMany({
      where,
      select: { 
        id: true,
        variants: {
          include: {
            dough: true,
            size: true
          }
        }
      },
    });
    const variantWanted = variants.map((s) => String(s).trim()).filter(Boolean);
    const matches = new Set<number>();
    for (const c of candidates) {
      const haveSet = new Set<string>();
      for (const variant of c.variants) {
        if (variant.dough) haveSet.add(variant.dough.key);
        if (variant.size) haveSet.add(variant.size.key);
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
      include: { 
        category: true,
        flags: {
          include: { flag: true }
        },
        ingredients: {
          include: { ingredient: true }
        },
        variants: {
          include: { 
            dough: true,
            size: true
          }
        }
      },
      orderBy: { [(sortBy === 'price' ? 'basePrice' : sortBy)]: order },
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
