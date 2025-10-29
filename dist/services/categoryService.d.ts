import { Category } from '@prisma/client';
export interface CreateCategoryData {
    name: string;
    description?: string;
}
export interface UpdateCategoryData {
    name?: string;
    description?: string;
}
export declare class CategoryService {
    /**
     * Creează o nouă categorie
     */
    createCategory(data: CreateCategoryData): Promise<Category>;
    /**
     * Obține toate categoriile
     */
    getAllCategories(): Promise<Category[]>;
    /**
     * Obține o categorie după ID
     */
    getCategoryById(id: number): Promise<Category | null>;
    /**
     * Obține o categorie după nume
     */
    getCategoryByName(name: string): Promise<Category | null>;
    /**
     * Obține o categorie după slug
     */
    getCategoryBySlug(slug: string): Promise<Category | null>;
    /**
     * Actualizează o categorie
     */
    updateCategory(id: number, data: UpdateCategoryData): Promise<Category>;
    /**
     * Șterge o categorie
     */
    deleteCategory(id: number): Promise<void>;
    /**
     * Verifică dacă o categorie există
     */
    categoryExists(id: number): Promise<boolean>;
    /**
     * Obține numărul total de categorii
     */
    getCategoriesCount(): Promise<number>;
    private generateSlug;
}
//# sourceMappingURL=categoryService.d.ts.map