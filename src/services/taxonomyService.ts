import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TaxonomyService {
  // Ingredient
  async listIngredients() {
    return prisma.ingredient.findMany({ orderBy: { key: 'asc' } });
  }
  async createIngredient(key: string, label?: string) {
    return prisma.ingredient.create({ data: { key, label: label || null } });
  }
  async updateIngredient(id: number, key?: string, label?: string) {
    const data: any = {};
    if (key !== undefined) data.key = key;
    if (label !== undefined) data.label = label || null;
    return prisma.ingredient.update({ where: { id }, data });
  }
  async deleteIngredient(id: number) {
    await prisma.ingredient.delete({ where: { id } });
  }

  // Flag
  async listFlags() {
    return prisma.flag.findMany({ orderBy: { key: 'asc' } });
  }
  async createFlag(key: string, label?: string) {
    return prisma.flag.create({ data: { key, label: label || null } });
  }
  async updateFlag(id: number, key?: string, label?: string) {
    const data: any = {};
    if (key !== undefined) data.key = key;
    if (label !== undefined) data.label = label || null;
    return prisma.flag.update({ where: { id }, data });
  }
  async deleteFlag(id: number) {
    await prisma.flag.delete({ where: { id } });
  }

  // DoughType
  async listDoughTypes() {
    return prisma.doughType.findMany({ orderBy: { key: 'asc' } });
  }
  async createDoughType(key: string, label?: string) {
    return prisma.doughType.create({ data: { key, label: label || null } });
  }
  async updateDoughType(id: number, key?: string, label?: string) {
    const data: any = {};
    if (key !== undefined) data.key = key;
    if (label !== undefined) data.label = label || null;
    return prisma.doughType.update({ where: { id }, data });
  }
  async deleteDoughType(id: number) {
    await prisma.doughType.delete({ where: { id } });
  }

  // SizeOption
  async listSizeOptions() {
    return prisma.sizeOption.findMany({ orderBy: { key: 'asc' } });
  }
  async createSizeOption(key: string, label?: string) {
    return prisma.sizeOption.create({ data: { key, label: label || null } });
  }
  async updateSizeOption(id: number, key?: string, label?: string) {
    const data: any = {};
    if (key !== undefined) data.key = key;
    if (label !== undefined) data.label = label || null;
    return prisma.sizeOption.update({ where: { id }, data });
  }
  async deleteSizeOption(id: number) {
    await prisma.sizeOption.delete({ where: { id } });
  }
}


