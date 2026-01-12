export declare class CartService {
    getOrCreateCart(userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
    }>;
    getCart(userId: number): Promise<{
        id: number;
        items: {
            id: number;
            product: {
                id: number;
                name: string;
                description: string;
                basePrice: any;
                imageUrl: string;
                category: {
                    name: string;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    slug: string;
                };
            };
            variant: {
                id: number;
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
                price: any;
            };
            quantity: number;
            lineTotal: number;
        }[];
        subtotal: number;
        discounts: number;
        total: number;
    }>;
    addItem(userId: number, productVariantId: number, quantity?: number): Promise<{
        id: number;
        items: {
            id: number;
            product: {
                id: number;
                name: string;
                description: string;
                basePrice: any;
                imageUrl: string;
                category: {
                    name: string;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    slug: string;
                };
            };
            variant: {
                id: number;
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
                price: any;
            };
            quantity: number;
            lineTotal: number;
        }[];
        subtotal: number;
        discounts: number;
        total: number;
    }>;
    updateItemQuantity(userId: number, itemId: number, quantity: number): Promise<{
        id: number;
        items: {
            id: number;
            product: {
                id: number;
                name: string;
                description: string;
                basePrice: any;
                imageUrl: string;
                category: {
                    name: string;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    slug: string;
                };
            };
            variant: {
                id: number;
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
                price: any;
            };
            quantity: number;
            lineTotal: number;
        }[];
        subtotal: number;
        discounts: number;
        total: number;
    }>;
    removeItem(userId: number, itemId: number): Promise<{
        id: number;
        items: {
            id: number;
            product: {
                id: number;
                name: string;
                description: string;
                basePrice: any;
                imageUrl: string;
                category: {
                    name: string;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    slug: string;
                };
            };
            variant: {
                id: number;
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
                price: any;
            };
            quantity: number;
            lineTotal: number;
        }[];
        subtotal: number;
        discounts: number;
        total: number;
    }>;
    clearCart(userId: number): Promise<void>;
}
export declare const cartService: CartService;
//# sourceMappingURL=service.d.ts.map