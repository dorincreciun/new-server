import { Request, Response } from 'express';
export declare class CategoryController {
    /**
     * Creează o nouă categorie
     */
    createCategory(req: Request, res: Response): Promise<void>;
    /**
     * Obține toate categoriile
     */
    getAllCategories(req: Request, res: Response): Promise<void>;
    /**
     * Obține o categorie după ID
     */
    getCategoryById(req: Request, res: Response): Promise<void>;
    /**
     * Obține o categorie după slug
     */
    getCategoryBySlug(req: Request, res: Response): Promise<void>;
    /**
     * Actualizează o categorie
     */
    updateCategory(req: Request, res: Response): Promise<void>;
    /**
     * Șterge o categorie
     */
    deleteCategory(req: Request, res: Response): Promise<void>;
    /**
     * Obține statistici despre categorii
     */
    getCategoryStats(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=categoryController.d.ts.map