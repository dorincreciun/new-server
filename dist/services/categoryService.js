"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CategoryService {
    /**
     * Creează o nouă categorie
     */
    async createCategory(data) {
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
    async getAllCategories() {
        return await prisma.category.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    }
    /**
     * Obține o categorie după ID
     */
    async getCategoryById(id) {
        return await prisma.category.findUnique({
            where: { id },
        });
    }
    /**
     * Obține o categorie după nume
     */
    async getCategoryByName(name) {
        return await prisma.category.findUnique({
            where: { name },
        });
    }
    /**
     * Obține o categorie după slug
     */
    async getCategoryBySlug(slug) {
        return await prisma.category.findUnique({
            where: { slug },
        });
    }
    /**
     * Actualizează o categorie
     */
    async updateCategory(id, data) {
        const updateData = { ...data };
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
    async deleteCategory(id) {
        await prisma.category.delete({
            where: { id },
        });
    }
    /**
     * Verifică dacă o categorie există
     */
    async categoryExists(id) {
        const category = await prisma.category.findUnique({
            where: { id },
            select: { id: true },
        });
        return category !== null;
    }
    /**
     * Obține numărul total de categorii
     */
    async getCategoriesCount() {
        return await prisma.category.count();
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=categoryService.js.map