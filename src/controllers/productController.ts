import { Request, Response } from 'express';
import { ProductService, CreateProductData, UpdateProductData } from '../services/productService';

const productService = new ProductService();

export class ProductController {
  /**
   * Creează un nou produs
   */
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, price, stock, categoryId } = req.body;

      // Validare input
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({
          error: 'Numele produsului este obligatoriu și trebuie să fie un string non-gol',
        });
        return;
      }

      if (typeof price !== 'number' || price < 0) {
        res.status(400).json({
          error: 'Prețul trebuie să fie un număr pozitiv',
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

      const productData: CreateProductData = {
        name: name.trim(),
        description: description?.trim() || undefined,
        price,
        stock: stock || 0,
        categoryId,
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

      if (!categoryName || typeof categoryName !== 'string' || categoryName.trim().length === 0) {
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
  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.query;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        res.status(400).json({
          error: 'Parametrul de căutare "name" este obligatoriu',
        });
        return;
      }

      const products = await productService.searchProductsByName(name.trim());

      res.status(200).json({
        message: 'Căutarea produselor a fost efectuată cu succes',
        data: products,
        count: products.length,
      });
    } catch (error) {
      console.error('Eroare la căutarea produselor:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

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
      const { name, description, price, stock, categoryId } = req.body;

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
      if (price !== undefined) {
        if (typeof price !== 'number' || price < 0) {
          res.status(400).json({
            error: 'Prețul trebuie să fie un număr pozitiv',
          });
          return;
        }
        updateData.price = price;
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
