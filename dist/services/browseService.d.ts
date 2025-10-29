import { BrowseQuery, ProductWithRelations } from '../types/browse';
export declare class BrowseService {
    private buildWhere;
    getProducts(query: BrowseQuery): Promise<{
        products: ProductWithRelations[];
        total: number;
    }>;
    getFilters(query: BrowseQuery): Promise<{
        flags: Array<{
            key: string;
            label?: string | null;
            count: number;
        }>;
        ingredients: Array<{
            key: string;
            label?: string | null;
            count: number;
        }>;
        doughTypes: Array<{
            key: string;
            label?: string | null;
            count: number;
        }>;
        sizeOptions: Array<{
            key: string;
            label?: string | null;
            count: number;
        }>;
        price: {
            min: number;
            max: number;
        };
    }>;
}
//# sourceMappingURL=browseService.d.ts.map