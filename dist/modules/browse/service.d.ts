import { BrowseProductsInput, BrowseFiltersInput } from './dto';
export declare class BrowseService {
    /**
     * Construiește obiectul `where` folosit atât pentru /browse/products,
     * cât și pentru /browse/filters pentru a garanta consistența filtrării.
     */
    private buildProductWhere;
    /**
     * Construcție comună a listei de filtre (flags, ingredients, doughTypes, sizeOptions, price)
     * pentru un anumit `where` de produs.
     */
    private buildFilterList;
    /**
     * Endpoint de produse: filtrează după categorie, preț, filtre (flags, ingredients, dough, size),
     * iar dacă nu este specificat nimic, întoarce toate produsele.
     */
    getProducts(query: BrowseProductsInput): Promise<{
        products: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        filters: {
            price: {
                min: number;
                max: number;
            };
            flags: {
                id: number;
                key: string;
                label: string | null;
                count: number;
            }[];
            ingredients: {
                id: number;
                key: string;
                label: string | null;
                count: number;
            }[];
            doughTypes: {
                id: number;
                key: string;
                label: string | null;
                count: number;
            }[];
            sizeOptions: {
                id: number;
                key: string;
                label: string | null;
                count: number;
            }[];
        };
    }>;
    /**
     * Endpoint de filtre: întoarce toate filtrele posibile (price, flags, ingredients, doughTypes, sizeOptions)
     * pentru produsele care corespund filtrelor primite (în special categoria).
     */
    getFilters(query: BrowseFiltersInput): Promise<{
        price: {
            min: number;
            max: number;
        };
        flags: {
            id: number;
            key: string;
            label: string | null;
            count: number;
        }[];
        ingredients: {
            id: number;
            key: string;
            label: string | null;
            count: number;
        }[];
        doughTypes: {
            id: number;
            key: string;
            label: string | null;
            count: number;
        }[];
        sizeOptions: {
            id: number;
            key: string;
            label: string | null;
            count: number;
        }[];
    }>;
}
export declare const browseService: BrowseService;
//# sourceMappingURL=service.d.ts.map