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
    const slug = this.generateSlug(data.name);
    if (slug === 'toate') {
      throw new Error('INVALID_SLUG_TOATE');
    }
    return await prisma.category.create({
      data: { ...data, slug },
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
   * Obține o categorie după slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return await prisma.category.findUnique({
      where: { slug },
    });
  }

  /**
   * Actualizează o categorie
   */
  async updateCategory(id: number, data: UpdateCategoryData): Promise<Category> {
    const updateData: any = { ...data };
    if (data.name) {
      updateData.slug = this.generateSlug(data.name);
      if (updateData.slug === 'toate') {
        throw new Error('INVALID_SLUG_TOATE');
      }
    }
    return await prisma.category.update({
      where: { id },
      data: updateData,
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

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
