import { BrowseProductsInput, BrowseFiltersInput } from './dto';
export declare class BrowseService {
    getProducts(query: BrowseProductsInput): Promise<{
        products: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getFilters(query: BrowseFiltersInput): Promise<{
        price: {
            min: number;
            max: number;
        };
        categories: {
            id: number;
            slug: string;
            name: string;
            count: number;
        }[];
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
    getSuggestions(q: string, limit?: number): Promise<{
        id: number;
        name: string;
        categorySlug: string;
        imageUrl: string | null;
    }[]>;
}
export declare const browseService: BrowseService;
//# sourceMappingURL=service.d.ts.map