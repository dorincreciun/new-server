import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

export class CategoryService {
  /**
   * Creează o nouă categorie
   */
  async createCategory(data: CreateCategoryData): Promise<Category> {
    return await prisma.category.create({
      data,
    });
  }

  /**
   * Obține toate categoriile
   */
  async getAllCategories(): Promise<Category[]> {
    return await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Obține o categorie după ID
   */
  async getCategoryById(id: number): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { id },
    });
  }

  /**
   * Obține o categorie după nume
   */
  async getCategoryByName(name: string): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { name },
    });
  }

  /**
   * Actualizează o categorie
   */
  async updateCategory(id: number, data: UpdateCategoryData): Promise<Category> {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  /**
   * Șterge o categorie
   */
  async deleteCategory(id: number): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }

  /**
   * Verifică dacă o categorie există
   */
  async categoryExists(id: number): Promise<boolean> {
    const category = await prisma.category.findUnique({
      where: { id },
      select: { id: true },
    });
    return category !== null;
  }

  /**
   * Obține numărul total de categorii
   */
  async getCategoriesCount(): Promise<number> {
    return await prisma.category.count();
  }
}
