import { Request, Response } from 'express';
export declare class ProductController {
    /**
     * Creează un nou produs
     */
    createProduct(req: Request, res: Response): Promise<void>;
    /**
     * Obține facets (flags/ingredients/variants) pentru o categorie după slug
     */
    getFacetsByCategorySlug(req: Request, res: Response): Promise<void>;
    /**
     * Filtrează produse după multiple criterii (categorySlug, search, flags, ingredients, variants, priceMin, priceMax)
     */
    filterProducts(req: Request, res: Response): Promise<void>;
    /**
     * Obține toate produsele
     */
    getAllProducts(req: Request, res: Response): Promise<void>;
    /**
     * Obține produsele dintr-o anumită categorie
     */
    getProductsByCategory(req: Request, res: Response): Promise<void>;
    /**
     * Obține produsele dintr-o anumită categorie (după numele categoriei)
     */
    getProductsByCategoryName(req: Request, res: Response): Promise<void>;
    /**
     * Obține produsele dintr-o anumită categorie (după slug-ul categoriei)
     */
    getProductsByCategorySlug(req: Request, res: Response): Promise<void>;
    /**
     * Obține un produs după ID
     */
    getProductById(req: Request, res: Response): Promise<void>;
    /**
     * Caută produse după nume
     */
    searchProducts(req: Request, res: Response): Promise<void>;
    /**
     * Obține produsele cu stoc scăzut
     */
    getProductsWithLowStock(req: Request, res: Response): Promise<void>;
    /**
     * Actualizează un produs
     */
    updateProduct(req: Request, res: Response): Promise<void>;
    /**
     * Actualizează stocul unui produs
     */
    updateProductStock(req: Request, res: Response): Promise<void>;
    /**
     * Șterge un produs
     */
    deleteProduct(req: Request, res: Response): Promise<void>;
    /**
     * Obține statistici despre produse
     */
    getProductStats(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=productController.d.ts.map