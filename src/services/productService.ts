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
