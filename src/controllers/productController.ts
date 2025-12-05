import { Request, Response } from 'express';
import { ProductService, CreateProductData, UpdateProductData } from '../services/productService';

const productService = new ProductService();

export class ProductController {
  /**
   * Creează un nou produs
   */
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, basePrice, stock, categoryId, imageUrl } = req.body;

      // Validare input
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({
          error: 'Numele produsului este obligatoriu și trebuie să fie un string non-gol',
        });
        return;
      }

      if (typeof basePrice !== 'number' || basePrice < 0) {
        res.status(400).json({
          error: 'Prețul de bază trebuie să fie un număr pozitiv',
        });
        return;
      }

      if (typeof categoryId !== 'number' || categoryId <= 0) {
        res.status(400).json({
          error: 'ID-ul categoriei trebuie să fie un număr întreg pozitiv',
        });
        return;
      }

      // Verifică dacă categoria există
      const categoryExists = await productService.categoryExists(categoryId);
      if (!categoryExists) {
        res.status(404).json({
          error: 'Categoria specificată nu există',
        });
        return;
      }

      // Normalizează imaginea: string gol -> null; string valid -> trim; alt tip ignorat
      let normalizedImage: string | null | undefined = undefined;
      if (imageUrl !== undefined) {
        if (imageUrl === null) {
          normalizedImage = null;
        } else if (typeof imageUrl === 'string') {
          const trimmed = imageUrl.trim();
          normalizedImage = trimmed.length > 0 ? trimmed : null;
        }
      }

      const normalizedDescription: string | null =
        typeof description === 'string' ? (description.trim() || null) : null;

      const productData: CreateProductData = {
        name: name.trim(),
        description: normalizedDescription,
        basePrice,
        stock: stock || 0,
        categoryId,
        imageUrl: normalizedImage ?? null,
      };

      const product = await productService.createProduct(productData);

      res.status(201).json({
        message: 'Produsul a fost creat cu succes',
        data: product,
      });
    } catch (error) {
      console.error('Eroare la crearea produsului:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

  /**
   * Obține facets (flags/ingredients/variants) pentru o categorie după slug
   */
  async getFacetsByCategorySlug(req: Request, res: Response): Promise<void> {
    try {
      const slug = req.params.slug;
      if (!slug || slug.trim().length === 0) {
        res.status(400).json({ error: 'Slug-ul categoriei este obligatoriu' });
        return;
      }

      const facets = await productService.getFacetsByCategorySlug(slug.trim());
      res.status(200).json({ message: 'Facets obținute cu succes', data: facets });
    } catch (error) {
      console.error('Eroare la obținerea facets:', error);
      res.status(500).json({ error: 'Eroare internă a serverului' });
    }
  }

  /**
   * Filtrează produse după multiple criterii (categorySlug, search, flags, ingredients, variants, priceMin, priceMax)
   */
  async filterProducts(req: Request, res: Response): Promise<void> {
    try {
      const categorySlug = typeof req.query.categorySlug === 'string' ? req.query.categorySlug : undefined;
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;

      const flags = req.query.flags
        ? Array.isArray(req.query.flags)
          ? (req.query.flags as string[])
          : String(req.query.flags).split(',')
        : undefined;
      const flagsMode = (req.query.flagsMode as string) === 'all' ? 'all' : 'any';

      const ingredients = req.query.ingredients
        ? Array.isArray(req.query.ingredients)
          ? (req.query.ingredients as string[])
          : String(req.query.ingredients).split(',')
        : undefined;
      const ingredientsMode = (req.query.ingredientsMode as string) === 'any' ? 'any' : 'all';

      // Pentru variants acceptăm listă plată (ex: ?variants=large&variants=thin)
      const variants = req.query.variants
        ? Array.isArray(req.query.variants)
          ? (req.query.variants as string[])
          : String(req.query.variants).split(',')
        : undefined;
      const variantsMode = (req.query.variantsMode as string) === 'all' ? 'all' : 'any';

      const priceMin = req.query.priceMin !== undefined ? Number(req.query.priceMin) : undefined;
      const priceMax = req.query.priceMax !== undefined ? Number(req.query.priceMax) : undefined;
      const page = req.query.page ? Math.max(Number(req.query.page), 1) : 1;
      const pageSizeRaw = req.query.pageSize ? Number(req.query.pageSize) : 20;
      const pageSize = Math.min(Math.max(pageSizeRaw, 1), 100);
      const sortByRaw = (req.query.sortBy as string) || 'createdAt';
      const sortBy = ['price', 'createdAt', 'popularity'].includes(sortByRaw) ? (sortByRaw as any) : 'createdAt';
      const orderRaw = (req.query.order as string) || 'desc';
      const order = ['asc', 'desc'].includes(orderRaw) ? (orderRaw as any) : 'desc';

      if (Number.isNaN(priceMin!) || Number.isNaN(priceMax!)) {
        res.status(400).json({ error: 'Parametrii priceMin/priceMax trebuie să fie numerici' });
        return;
      }

      const result = await productService.filterProductsPaginated({
        categorySlug: categorySlug?.trim() || undefined,
        search: search?.trim() || undefined,
        flags: flags || undefined,
        flagsMode,
        ingredients: ingredients || undefined,
        ingredientsMode,
        variants: variants || undefined,
        variantsMode,
        priceMin: priceMin || undefined,
        priceMax: priceMax || undefined,
        page,
        pageSize,
        sortBy,
        order,
      });

      res.status(200).json({
        message: 'Filtrarea produselor a fost efectuată cu succes',
        items: result.items,
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
      });
    } catch (error) {
      console.error('Eroare la filtrarea produselor:', error);
      res.status(500).json({ error: 'Eroare internă a serverului' });
    }
  }

  /**
   * Caută produse după text (search) cu paginare și sortare
   * Parametri acceptați (query):
   * - q: string (obligatoriu) — termenul de căutare
   * - categorySlug: string (opțional) — filtrează după categorie
   * - priceMin, priceMax: number (opțional) — filtrează după interval de preț (pe maxPrice/minPrice)
   * - sort: "price" | "createdAt" | "popularity" (implicit: createdAt)
   * - order: "asc" | "desc" (implicit: desc)
   * - page: number (implicit: 1)
   * - limit: number (implicit: 12; max: 100)
   */
  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const qRaw = typeof req.query.q === 'string' ? req.query.q : '';
      const q = qRaw.trim();
      if (!q) {
        res.status(400).json({ error: 'Parametrul q este obligatoriu pentru căutare' });
        return;
      }

      const categorySlug = typeof req.query.categorySlug === 'string' ? req.query.categorySlug.trim() : undefined;
      const priceMin = req.query.priceMin !== undefined ? Number(req.query.priceMin) : undefined;
      const priceMax = req.query.priceMax !== undefined ? Number(req.query.priceMax) : undefined;
      const page = req.query.page ? Math.max(Number(req.query.page), 1) : 1;
      const limitRaw = req.query.limit ? Number(req.query.limit) : 12;
      const limit = Math.min(Math.max(limitRaw, 1), 100);
      const sortRaw = (req.query.sort as string) || 'createdAt';
      const sortBy = ['price', 'createdAt', 'popularity'].includes(sortRaw) ? (sortRaw as any) : 'createdAt';
      const orderRaw = (req.query.order as string) || 'desc';
      const order = ['asc', 'desc'].includes(orderRaw) ? (orderRaw as any) : 'desc';

      if (Number.isNaN(priceMin!) || Number.isNaN(priceMax!)) {
        res.status(400).json({ error: 'Parametrii priceMin/priceMax trebuie să fie numerici' });
        return;
      }

      const result = await productService.filterProductsPaginated({
        categorySlug,
        search: q,
        priceMin: priceMin || undefined,
        priceMax: priceMax || undefined,
        page,
        pageSize: limit,
        sortBy,
        order,
      });

      const totalPages = Math.ceil(result.total / result.pageSize) || 1;

      res.status(200).json({
        message: 'Căutarea produselor a fost efectuată cu succes',
        data: result.items,
        pagination: {
          page: result.page,
          limit: result.pageSize,
          total: result.total,
          totalPages,
        },
      });
    } catch (error) {
      console.error('Eroare la căutarea produselor:', error);
      res.status(500).json({ error: 'Eroare internă a serverului' });
    }
  }

  /**
   * Obține toate produsele
   */
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await productService.getAllProducts();

      res.status(200).json({
        message: 'Produsele au fost obținute cu succes',
        data: products,
        count: products.length,
      });
    } catch (error) {
      console.error('Eroare la obținerea produselor:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

  /**
   * Obține produsele dintr-o anumită categorie
   */
  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId || '0');

      if (isNaN(categoryId) || categoryId <= 0) {
        res.status(400).json({
          error: 'ID-ul categoriei trebuie să fie un număr întreg pozitiv',
        });
        return;
      }

      const products = await productService.getProductsByCategory(categoryId);

      res.status(200).json({
        message: 'Produsele din categoria specificată au fost obținute cu succes',
        data: products,
        count: products.length,
      });
    } catch (error) {
      console.error('Eroare la obținerea produselor din categorie:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

  /**
   * Obține produsele dintr-o anumită categorie (după numele categoriei)
   */
  async getProductsByCategoryName(req: Request, res: Response): Promise<void> {
    try {
      const categoryName = req.params.categoryName;

      if (!categoryName || categoryName.trim().length === 0) {
        res.status(400).json({
          error: 'Numele categoriei este obligatoriu și trebuie să fie un string non-gol',
        });
        return;
      }

      const products = await productService.getProductsByCategoryName(categoryName.trim());

      res.status(200).json({
        message: 'Produsele din categoria specificată au fost obținute cu succes',
        data: products,
        count: products.length,
      });
    } catch (error) {
      console.error('Eroare la obținerea produselor din categorie:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

  /**
   * Obține produsele dintr-o anumită categorie (după slug-ul categoriei)
   */
  async getProductsByCategorySlug(req: Request, res: Response): Promise<void> {
    try {
      const slug = req.params.slug;

      if (!slug || slug.trim().length === 0) {
        res.status(400).json({
          error: 'Slug-ul categoriei este obligatoriu și trebuie să fie un string non-gol',
        });
        return;
      }

      const products = await productService.getProductsByCategorySlug(slug.trim());

      res.status(200).json({
        message: 'Produsele din categoria specificată au fost obținute cu succes',
        data: products,
        count: products.length,
      });
    } catch (error) {
      console.error('Eroare la obținerea produselor din categorie după slug:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

  /**
   * Obține un produs după ID
   */
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id || '0');

      if (isNaN(id) || id <= 0) {
        res.status(400).json({
          error: 'ID-ul produsului trebuie să fie un număr întreg pozitiv',
        });
        return;
      }

      const product = await productService.getProductById(id);

      if (!product) {
        res.status(404).json({
          error: 'Produsul nu a fost găsit',
        });
        return;
      }

      res.status(200).json({
        message: 'Produsul a fost obținut cu succes',
        data: product,
      });
    } catch (error) {
      console.error('Eroare la obținerea produsului:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

  /**
   * Caută produse după nume
   */
  // Eliminat: metodă veche de căutare după nume (înlocuită de searchProducts cu suport pentru q, paginare și sortare)

  /**
   * Obține produsele cu stoc scăzut
   */
  async getProductsWithLowStock(req: Request, res: Response): Promise<void> {
    try {
      const threshold = req.query.threshold ? parseInt(req.query.threshold as string) : 10;

      if (isNaN(threshold) || threshold < 0) {
        res.status(400).json({
          error: 'Pragul de stoc trebuie să fie un număr pozitiv',
        });
        return;
      }

      const products = await productService.getProductsWithLowStock(threshold);

      res.status(200).json({
        message: 'Produsele cu stoc scăzut au fost obținute cu succes',
        data: products,
        count: products.length,
        threshold,
      });
    } catch (error) {
      console.error('Eroare la obținerea produselor cu stoc scăzut:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

  /**
   * Actualizează un produs
   */
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id || '0');
      const { name, description, basePrice, stock, categoryId, imageUrl } = req.body;

      if (isNaN(id) || id <= 0) {
        res.status(400).json({
          error: 'ID-ul produsului trebuie să fie un număr întreg pozitiv',
        });
        return;
      }

      // Verifică dacă produsul există
      const existingProduct = await productService.getProductById(id);
      if (!existingProduct) {
        res.status(404).json({
          error: 'Produsul nu a fost găsit',
        });
        return;
      }

      // Verifică dacă categoria există (dacă se schimbă)
      if (categoryId && categoryId !== existingProduct.categoryId) {
        const categoryExists = await productService.categoryExists(categoryId);
        if (!categoryExists) {
          res.status(404).json({
            error: 'Categoria specificată nu există',
          });
          return;
        }
      }

      const updateData: UpdateProductData = {};
      if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
          res.status(400).json({
            error: 'Numele produsului trebuie să fie un string non-gol',
          });
          return;
        }
        updateData.name = name.trim();
      }
      if (description !== undefined) {
        updateData.description = description?.trim() || undefined;
      }
      if (basePrice !== undefined) {
        if (typeof basePrice !== 'number' || basePrice < 0) {
          res.status(400).json({
            error: 'Prețul de bază trebuie să fie un număr pozitiv',
          });
          return;
        }
        updateData.basePrice = basePrice;
      }
      if (stock !== undefined) {
        if (typeof stock !== 'number' || stock < 0) {
          res.status(400).json({
            error: 'Stocul trebuie să fie un număr pozitiv',
          });
          return;
        }
        updateData.stock = stock;
      }
      if (categoryId !== undefined) {
        if (typeof categoryId !== 'number' || categoryId <= 0) {
          res.status(400).json({
            error: 'ID-ul categoriei trebuie să fie un număr întreg pozitiv',
          });
          return;
        }
        updateData.categoryId = categoryId;
      }
      if (imageUrl !== undefined) {
        if (imageUrl === null) {
          updateData.imageUrl = null;
        } else if (typeof imageUrl === 'string') {
          const trimmed = imageUrl.trim();
          updateData.imageUrl = trimmed.length > 0 ? trimmed : null;
        } else {
          res.status(400).json({ error: 'imageUrl trebuie să fie string sau null' });
          return;
        }
      }

      const updatedProduct = await productService.updateProduct(id, updateData);

      res.status(200).json({
        message: 'Produsul a fost actualizat cu succes',
        data: updatedProduct,
      });
    } catch (error) {
      console.error('Eroare la actualizarea produsului:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

  /**
   * Actualizează stocul unui produs
   */
  async updateProductStock(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id || '0');
      const { stock } = req.body;

      if (isNaN(id) || id <= 0) {
        res.status(400).json({
          error: 'ID-ul produsului trebuie să fie un număr întreg pozitiv',
        });
        return;
      }

      if (typeof stock !== 'number' || stock < 0) {
        res.status(400).json({
          error: 'Stocul trebuie să fie un număr pozitiv',
        });
        return;
      }

      // Verifică dacă produsul există
      const existingProduct = await productService.getProductById(id);
      if (!existingProduct) {
        res.status(404).json({
          error: 'Produsul nu a fost găsit',
        });
        return;
      }

      const updatedProduct = await productService.updateProductStock(id, stock);

      res.status(200).json({
        message: 'Stocul produsului a fost actualizat cu succes',
        data: updatedProduct,
      });
    } catch (error) {
      console.error('Eroare la actualizarea stocului produsului:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

  /**
   * Șterge un produs
   */
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id || '0');

      if (isNaN(id) || id <= 0) {
        res.status(400).json({
          error: 'ID-ul produsului trebuie să fie un număr întreg pozitiv',
        });
        return;
      }

      // Verifică dacă produsul există
      const existingProduct = await productService.getProductById(id);
      if (!existingProduct) {
        res.status(404).json({
          error: 'Produsul nu a fost găsit',
        });
        return;
      }

      await productService.deleteProduct(id);

      res.status(200).json({
        message: 'Produsul a fost șters cu succes',
      });
    } catch (error) {
      console.error('Eroare la ștergerea produsului:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

  /**
   * Obține statistici despre produse
   */
  async getProductStats(req: Request, res: Response): Promise<void> {
    try {
      const totalProducts = await productService.getProductsCount();

      res.status(200).json({
        message: 'Statisticile produselor au fost obținute cu succes',
        data: {
          totalProducts,
        },
      });
    } catch (error) {
      console.error('Eroare la obținerea statisticilor produselor:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }
}
