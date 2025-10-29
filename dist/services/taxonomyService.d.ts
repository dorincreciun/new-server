export declare class TaxonomyService {
    listIngredients(): Promise<{
        id: number;
        createdAt: Date;
        key: string;
        label: string | null;
    }[]>;
    createIngredient(key: string, label?: string): Promise<{
        id: number;
        createdAt: Date;
        key: string;
        label: string | null;
    }>;
    updateIngredient(id: number, key?: string, label?: string): Promise<{
        id: number;
        createdAt: Date;
        key: string;
        label: string | null;
    }>;
    deleteIngredient(id: number): Promise<void>;
    listFlags(): Promise<{
        id: number;
        createdAt: Date;
        key: string;
        label: string | null;
    }[]>;
    createFlag(key: string, label?: string): Promise<{
        id: number;
        createdAt: Date;
        key: string;
        label: string | null;
    }>;
    updateFlag(id: number, key?: string, label?: string): Promise<{
        id: number;
        createdAt: Date;
        key: string;
        label: string | null;
    }>;
    deleteFlag(id: number): Promise<void>;
    listDoughTypes(): Promise<{
        id: number;
        createdAt: Date;
        key: string;
        label: string | null;
    }[]>;
    createDoughType(key: string, label?: string): Promise<{
        id: number;
        createdAt: Date;
        key: string;
        label: string | null;
    }>;
    updateDoughType(id: number, key?: string, label?: string): Promise<{
        id: number;
        createdAt: Date;
        key: string;
        label: string | null;
    }>;
    deleteDoughType(id: number): Promise<void>;
    listSizeOptions(): Promise<{
        id: number;
        createdAt: Date;
        key: string;
        label: string | null;
    }[]>;
    createSizeOption(key: string, label?: string): Promise<{
        id: number;
        createdAt: Date;
        key: string;
        label: string | null;
    }>;
    updateSizeOption(id: number, key?: string, label?: string): Promise<{
        id: number;
        createdAt: Date;
        key: string;
        label: string | null;
    }>;
    deleteSizeOption(id: number): Promise<void>;
}
//# sourceMappingURL=taxonomyService.d.ts.map