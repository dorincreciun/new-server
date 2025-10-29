"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const categoryService_1 = require("../services/categoryService");
const categoryService = new categoryService_1.CategoryService();
class CategoryController {
    /**
     * Creează o nouă categorie
     */
    async createCategory(req, res) {
        try {
            const { name, description } = req.body;
            // Validare input
            if (!name || typeof name !== 'string' || name.trim().length === 0) {
                res.status(400).json({
                    error: 'Numele categoriei este obligatoriu și trebuie să fie un string non-gol',
                });
                return;
            }
            // Verifică dacă categoria există deja
            const existingCategory = await categoryService.getCategoryByName(name.trim());
            if (existingCategory) {
                res.status(409).json({
                    error: 'O categorie cu acest nume există deja',
                });
                return;
            }
            const categoryData = {
                name: name.trim(),
                description: description?.trim() || undefined,
            };
            let category;
            try {
                category = await categoryService.createCategory(categoryData);
            }
            catch (e) {
                if (e?.message === 'INVALID_SLUG_TOATE') {
                    res.status(400).json({ error: 'Slug-ul "toate" este rezervat pentru frontend și nu poate fi folosit.' });
                    return;
                }
                throw e;
            }
            res.status(201).json({
                message: 'Categoria a fost creată cu succes',
                data: category,
            });
        }
        catch (error) {
            console.error('Eroare la crearea categoriei:', error);
            res.status(500).json({
                error: 'Eroare internă a serverului',
            });
        }
    }
    /**
     * Obține toate categoriile
     */
    async getAllCategories(req, res) {
        try {
            const items = await categoryService.getAllCategories();
            res.status(200).json({ items });
        }
        catch (error) {
            console.error('Eroare la obținerea categoriilor:', error);
            res.status(500).json({
                error: 'Eroare internă a serverului',
            });
        }
    }
    /**
     * Obține o categorie după ID
     */
    async getCategoryById(req, res) {
        try {
            const id = parseInt(req.params.id || '0');
            if (isNaN(id) || id <= 0) {
                res.status(400).json({
                    error: 'ID-ul categoriei trebuie să fie un număr întreg pozitiv',
                });
                return;
            }
            const category = await categoryService.getCategoryById(id);
            if (!category) {
                res.status(404).json({
                    error: 'Categoria nu a fost găsită',
                });
                return;
            }
            res.status(200).json({
                message: 'Categoria a fost obținută cu succes',
                data: category,
            });
        }
        catch (error) {
            console.error('Eroare la obținerea categoriei:', error);
            res.status(500).json({
                error: 'Eroare internă a serverului',
            });
        }
    }
    /**
     * Obține o categorie după slug
     */
    async getCategoryBySlug(req, res) {
        try {
            const slug = String(req.params.slug || '').trim();
            if (!slug) {
                res.status(400).json({ error: 'Slug invalid' });
                return;
            }
            if (slug === 'toate') {
                res.status(404).json({ error: 'Categoria nu a fost găsită' });
                return;
            }
            const category = await categoryService.getCategoryBySlug(slug);
            if (!category) {
                res.status(404).json({ error: 'Categoria nu a fost găsită' });
                return;
            }
            res.status(200).json({ data: category });
        }
        catch (error) {
            console.error('Eroare la obținerea categoriei după slug:', error);
            res.status(500).json({ error: 'Eroare internă a serverului' });
        }
    }
    /**
     * Actualizează o categorie
     */
    async updateCategory(req, res) {
        try {
            const id = parseInt(req.params.id || '0');
            const { name, description } = req.body;
            if (isNaN(id) || id <= 0) {
                res.status(400).json({
                    error: 'ID-ul categoriei trebuie să fie un număr întreg pozitiv',
                });
                return;
            }
            // Verifică dacă categoria există
            const existingCategory = await categoryService.getCategoryById(id);
            if (!existingCategory) {
                res.status(404).json({
                    error: 'Categoria nu a fost găsită',
                });
                return;
            }
            // Verifică dacă numele nou există deja (dacă se schimbă)
            if (name && name.trim() !== existingCategory.name) {
                const categoryWithSameName = await categoryService.getCategoryByName(name.trim());
                if (categoryWithSameName) {
                    res.status(409).json({
                        error: 'O categorie cu acest nume există deja',
                    });
                    return;
                }
            }
            const updateData = {};
            if (name !== undefined) {
                if (typeof name !== 'string' || name.trim().length === 0) {
                    res.status(400).json({
                        error: 'Numele categoriei trebuie să fie un string non-gol',
                    });
                    return;
                }
                updateData.name = name.trim();
            }
            if (description !== undefined) {
                updateData.description = description?.trim() || undefined;
            }
            let updatedCategory;
            try {
                updatedCategory = await categoryService.updateCategory(id, updateData);
            }
            catch (e) {
                if (e?.message === 'INVALID_SLUG_TOATE') {
                    res.status(400).json({ error: 'Slug-ul "toate" este rezervat pentru frontend și nu poate fi folosit.' });
                    return;
                }
                throw e;
            }
            res.status(200).json({
                message: 'Categoria a fost actualizată cu succes',
                data: updatedCategory,
            });
        }
        catch (error) {
            console.error('Eroare la actualizarea categoriei:', error);
            res.status(500).json({
                error: 'Eroare internă a serverului',
            });
        }
    }
    /**
     * Șterge o categorie
     */
    async deleteCategory(req, res) {
        try {
            const id = parseInt(req.params.id || '0');
            if (isNaN(id) || id <= 0) {
                res.status(400).json({
                    error: 'ID-ul categoriei trebuie să fie un număr întreg pozitiv',
                });
                return;
            }
            // Verifică dacă categoria există
            const existingCategory = await categoryService.getCategoryById(id);
            if (!existingCategory) {
                res.status(404).json({
                    error: 'Categoria nu a fost găsită',
                });
                return;
            }
            await categoryService.deleteCategory(id);
            res.status(200).json({
                message: 'Categoria a fost ștearsă cu succes',
            });
        }
        catch (error) {
            console.error('Eroare la ștergerea categoriei:', error);
            res.status(500).json({
                error: 'Eroare internă a serverului',
            });
        }
    }
    /**
     * Obține statistici despre categorii
     */
    async getCategoryStats(req, res) {
        try {
            const totalCategories = await categoryService.getCategoriesCount();
            res.status(200).json({
                message: 'Statisticile categoriilor au fost obținute cu succes',
                data: {
                    totalCategories,
                },
            });
        }
        catch (error) {
            console.error('Eroare la obținerea statisticilor categoriilor:', error);
            res.status(500).json({
                error: 'Eroare internă a serverului',
            });
        }
    }
}
exports.CategoryController = CategoryController;
//# sourceMappingURL=categoryController.js.map