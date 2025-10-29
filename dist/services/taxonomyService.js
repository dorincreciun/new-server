"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxonomyService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class TaxonomyService {
    // Ingredient
    async listIngredients() {
        return prisma.ingredient.findMany({ orderBy: { key: 'asc' } });
    }
    async createIngredient(key, label) {
        return prisma.ingredient.create({ data: { key, label: label || null } });
    }
    async updateIngredient(id, key, label) {
        const data = {};
        if (key !== undefined)
            data.key = key;
        if (label !== undefined)
            data.label = label || null;
        return prisma.ingredient.update({ where: { id }, data });
    }
    async deleteIngredient(id) {
        await prisma.ingredient.delete({ where: { id } });
    }
    // Flag
    async listFlags() {
        return prisma.flag.findMany({ orderBy: { key: 'asc' } });
    }
    async createFlag(key, label) {
        return prisma.flag.create({ data: { key, label: label || null } });
    }
    async updateFlag(id, key, label) {
        const data = {};
        if (key !== undefined)
            data.key = key;
        if (label !== undefined)
            data.label = label || null;
        return prisma.flag.update({ where: { id }, data });
    }
    async deleteFlag(id) {
        await prisma.flag.delete({ where: { id } });
    }
    // DoughType
    async listDoughTypes() {
        return prisma.doughType.findMany({ orderBy: { key: 'asc' } });
    }
    async createDoughType(key, label) {
        return prisma.doughType.create({ data: { key, label: label || null } });
    }
    async updateDoughType(id, key, label) {
        const data = {};
        if (key !== undefined)
            data.key = key;
        if (label !== undefined)
            data.label = label || null;
        return prisma.doughType.update({ where: { id }, data });
    }
    async deleteDoughType(id) {
        await prisma.doughType.delete({ where: { id } });
    }
    // SizeOption
    async listSizeOptions() {
        return prisma.sizeOption.findMany({ orderBy: { key: 'asc' } });
    }
    async createSizeOption(key, label) {
        return prisma.sizeOption.create({ data: { key, label: label || null } });
    }
    async updateSizeOption(id, key, label) {
        const data = {};
        if (key !== undefined)
            data.key = key;
        if (label !== undefined)
            data.label = label || null;
        return prisma.sizeOption.update({ where: { id }, data });
    }
    async deleteSizeOption(id) {
        await prisma.sizeOption.delete({ where: { id } });
    }
}
exports.TaxonomyService = TaxonomyService;
//# sourceMappingURL=taxonomyService.js.map