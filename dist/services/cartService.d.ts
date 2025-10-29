export declare class CartService {
    getOrCreateCart(userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
    }>;
    getCartWithItems(userId: number): Promise<{
        cartId: number;
        items: ({
            productVariant: {
                product: {
                    name: string;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    basePrice: import("@prisma/client/runtime/library").Decimal;
                    minPrice: import("@prisma/client/runtime/library").Decimal | null;
                    maxPrice: import("@prisma/client/runtime/library").Decimal | null;
                    imageUrl: string | null;
                    popularity: number;
                    ratingAverage: import("@prisma/client/runtime/library").Decimal | null;
                    ratingCount: number;
                    isCustomizable: boolean;
                    releasedAt: Date | null;
                    stock: number;
                    categoryId: number;
                };
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
            } & {
                id: number;
                stock: number;
                price: import("@prisma/client/runtime/library").Decimal;
                productId: number;
                isDefault: boolean;
                doughId: number | null;
                sizeId: number | null;
                sku: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            cartId: number;
            productVariantId: number;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
        })[];
        total: number;
    }>;
    addItem(userId: number, productVariantId: number, quantity?: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        cartId: number;
        productVariantId: number;
        quantity: number;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    updateItemQuantity(userId: number, itemId: number, quantity: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        cartId: number;
        productVariantId: number;
        quantity: number;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
    }>;
    removeItem(userId: number, itemId: number): Promise<void>;
    clearCart(userId: number): Promise<void>;
}
export declare const cartService: CartService;
//# sourceMappingURL=cartService.d.ts.map