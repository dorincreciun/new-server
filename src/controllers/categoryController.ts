import { Request, Response } from 'express';
import { CategoryService, CreateCategoryData, UpdateCategoryData } from '../services/categoryService';

const categoryService = new CategoryService();

export class CategoryController {
  /**
   * Creează o nouă categorie
   */
  async createCategory(req: Request, res: Response): Promise<void> {
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

      const categoryData: CreateCategoryData = {
        name: name.trim(),
        description: description?.trim() || undefined,
      };

      const category = await categoryService.createCategory(categoryData);

      res.status(201).json({
        message: 'Categoria a fost creată cu succes',
        data: category,
      });
    } catch (error) {
      console.error('Eroare la crearea categoriei:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

  /**
   * Obține toate categoriile
   */
  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await categoryService.getAllCategories();

      res.status(200).json({
        message: 'Categoriile au fost obținute cu succes',
        data: categories,
        count: categories.length,
      });
    } catch (error) {
      console.error('Eroare la obținerea categoriilor:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

  /**
   * Obține o categorie după ID
   */
  async getCategoryById(req: Request, res: Response): Promise<void> {
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
    } catch (error) {
      console.error('Eroare la obținerea categoriei:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

  /**
   * Actualizează o categorie
   */
  async updateCategory(req: Request, res: Response): Promise<void> {
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

      const updateData: UpdateCategoryData = {};
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

      const updatedCategory = await categoryService.updateCategory(id, updateData);

      res.status(200).json({
        message: 'Categoria a fost actualizată cu succes',
        data: updatedCategory,
      });
    } catch (error) {
      console.error('Eroare la actualizarea categoriei:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

  /**
   * Șterge o categorie
   */
  async deleteCategory(req: Request, res: Response): Promise<void> {
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
    } catch (error) {
      console.error('Eroare la ștergerea categoriei:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }

  /**
   * Obține statistici despre categorii
   */
  async getCategoryStats(req: Request, res: Response): Promise<void> {
    try {
      const totalCategories = await categoryService.getCategoriesCount();

      res.status(200).json({
        message: 'Statisticile categoriilor au fost obținute cu succes',
        data: {
          totalCategories,
        },
      });
    } catch (error) {
      console.error('Eroare la obținerea statisticilor categoriilor:', error);
      res.status(500).json({
        error: 'Eroare internă a serverului',
      });
    }
  }
}
