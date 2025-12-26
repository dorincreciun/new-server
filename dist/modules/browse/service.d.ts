import { BrowseProductsInput, BrowseFiltersInput } from './dto';
export declare class BrowseService {
    getProducts(query: BrowseProductsInput): Promise<{
        products: {
            basePrice: number;
            minPrice: number | null;
            maxPrice: number | null;
            ratingAverage: number | null;
            flags: {
                id: number;
                createdAt: Date;
                key: string;
                label: string | null;
            }[];
            ingredients: {
                id: number;
                createdAt: Date;
                key: string;
                label: string | null;
            }[];
            variants: {
                price: number;
                doughType: {
                    id: number;
                    createdAt: Date;
                    key: string;
                    label: string | null;
                } | null;
                sizeOption: {
                    id: number;
                    createdAt: Date;
                    key: string;
                    label: string | null;
                } | null;
                dough: {
                    id: number;
                    createdAt: Date;
                    key: string;
                    label: string | null;
                } | null;
                size: {
                    id: number;
                    createdAt: Date;
                    key: string;
                    label: string | null;
                } | null;
                id: number;
                productId: number;
                stock: number;
                isDefault: boolean;
                doughId: number | null;
                sizeId: number | null;
                sku: string | null;
            }[];
            category: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                slug: string;
            };
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            stock: number;
            imageUrl: string | null;
            popularity: number;
            ratingCount: number;
            isCustomizable: boolean;
            releasedAt: Date | null;
            categoryId: number;
        }[];
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
    }>;
}
export declare const browseService: BrowseService;
//# sourceMappingURL=service.d.ts.map