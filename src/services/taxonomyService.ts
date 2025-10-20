import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TaxonomyService {
  // IngredientCatalog
  async listIngredients() {
    return prisma.ingredientCatalog.findMany({ orderBy: { key: 'asc' } });
  }
  async createIngredient(key: string, label?: string) {
    return prisma.ingredientCatalog.create({ data: { key, label } });
  }
  async updateIngredient(id: number, key?: string, label?: string) {
    return prisma.ingredientCatalog.update({ where: { id }, data: { key, label } });
  }
  async deleteIngredient(id: number) {
    await prisma.ingredientCatalog.delete({ where: { id } });
  }

  // FlagCatalog
  async listFlags() {
    return prisma.flagCatalog.findMany({ orderBy: { key: 'asc' } });
  }
  async createFlag(key: string, label?: string) {
    return prisma.flagCatalog.create({ data: { key, label } });
  }
  async updateFlag(id: number, key?: string, label?: string) {
    return prisma.flagCatalog.update({ where: { id }, data: { key, label } });
  }
  async deleteFlag(id: number) {
    await prisma.flagCatalog.delete({ where: { id } });
  }

  // VariantOptionCatalog
  async listVariantOptions() {
    return prisma.variantOptionCatalog.findMany({ orderBy: { key: 'asc' } });
  }
  async createVariantOption(key: string, label?: string) {
    return prisma.variantOptionCatalog.create({ data: { key, label } });
  }
  async updateVariantOption(id: number, key?: string, label?: string) {
    return prisma.variantOptionCatalog.update({ where: { id }, data: { key, label } });
  }
  async deleteVariantOption(id: number) {
    await prisma.variantOptionCatalog.delete({ where: { id } });
  }
}


