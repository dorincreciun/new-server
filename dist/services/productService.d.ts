import { Product, Category } from '@prisma/client';
export interface CreateProductData {
    name: string;
    description?: string | null;
    basePrice: number;
    stock?: number;
    categoryId: number;
    imageUrl?: string | null;
}
export interface UpdateProductData {
    name?: string;
    description?: string;
    basePrice?: number;
    stock?: number;
    categoryId?: number;
    imageUrl?: string | null;
}
export interface ProductWithCategory extends Product {
    category: Category;
}
export declare class ProductService {
    /**
     * Creează un nou produs
     */
    createProduct(data: CreateProductData): Promise<ProductWithCategory>;
    /**
     * Obține toate produsele
     */
    getAllProducts(): Promise<ProductWithCategory[]>;
    /**
     * Obține produsele dintr-o anumită categorie
     */
    getProductsByCategory(categoryId: number): Promise<ProductWithCategory[]>;
    /**
     * Obține produsele dintr-o anumită categorie (după numele categoriei)
     */
    getProductsByCategoryName(categoryName: string): Promise<ProductWithCategory[]>;
    /**
     * Obține produsele dintr-o categorie după slug-ul categoriei
     */
    getProductsByCategorySlug(slug: string): Promise<ProductWithCategory[]>;
    /**
     * Obține un produs după ID
     */
    getProductById(id: number): Promise<ProductWithCategory | null>;
    /**
     * Caută produse după nume (search parțial)
     */
    searchProductsByName(name: string): Promise<ProductWithCategory[]>;
    /**
     * Obține produse cu stoc scăzut (sub o anumită valoare)
     */
    getProductsWithLowStock(threshold?: number): Promise<ProductWithCategory[]>;
    /**
     * Actualizează un produs
     */
    updateProduct(id: number, data: UpdateProductData): Promise<ProductWithCategory>;
    /**
     * Șterge un produs
     */
    deleteProduct(id: number): Promise<void>;
    /**
     * Verifică dacă un produs există
     */
    productExists(id: number): Promise<boolean>;
    /**
     * Verifică dacă categoria există
     */
    categoryExists(categoryId: number): Promise<boolean>;
    /**
     * Obține numărul total de produse
     */
    getProductsCount(): Promise<number>;
    /**
     * Obține numărul de produse dintr-o categorie
     */
    getProductsCountByCategory(categoryId: number): Promise<number>;
    /**
     * Returnează valorile posibile (facets) pentru filtrele dintr-o categorie (după slug)
     * - flags: string[] unice + count
     * - ingredients: string[] unice + count
     * - variants: map cu cheie variantKey -> string[] opțiuni unice + count
     */
    getFacetsByCategorySlug(slug: string): Promise<{
        flags: {
            value: string;
            count: number;
        }[];
        ingredients: {
            value: string;
            count: number;
        }[];
        variants: Record<string, {
            value: string;
            count: number;
        }[]>;
    }>;
    /**
     * Filtrează produsele după criterii variate.
     * - categorySlug: filtrează după categorie (opțional)
     * - search: căutare în nume (opțional)
     * - flags/ingredients: toate valorile selectate trebuie să fie prezente (AND)
     * - variants: filtrare în memorie (suportă chei arbitrare)
     * - priceMin/priceMax: pe câmpurile minPrice/maxPrice
     */
    filterProductsPaginated(opts: {
        categorySlug?: string | undefined;
        search?: string | undefined;
        flags?: string[] | undefined;
        flagsMode?: 'all' | 'any';
        ingredients?: string[] | undefined;
        ingredientsMode?: 'all' | 'any';
        variants?: string[] | undefined;
        variantsMode?: 'all' | 'any';
        priceMin?: number | undefined;
        priceMax?: number | undefined;
        page?: number;
        pageSize?: number;
        sortBy?: 'price' | 'createdAt' | 'popularity';
        order?: 'asc' | 'desc';
    }): Promise<{
        items: ProductWithCategory[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    /**
     * Actualizează stocul unui produs
     */
    updateProductStock(id: number, stock: number): Promise<ProductWithCategory>;
}
//# sourceMappingURL=productService.d.ts.map