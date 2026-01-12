export declare class OrderService {
    createOrder(userId: number, customerData: {
        name: string;
        email?: string;
        phone: string;
    }, addressData: {
        city: string;
        street: string;
        house: string;
        apartment?: string;
        comment?: string;
    }, paymentMethod: string): Promise<{
        id: any;
        status: any;
        total: number;
        subtotal: number;
        discounts: number;
        customerName: any;
        customerEmail: any;
        customerPhone: any;
        addressCity: any;
        addressStreet: any;
        addressHouse: any;
        addressApartment: any;
        addressComment: any;
        paymentMethod: any;
        paymentStatus: any;
        createdAt: any;
        updatedAt: any;
        items: any;
    }>;
    getUserOrders(userId: number, page?: number, limit?: number): Promise<{
        orders: {
            id: any;
            status: any;
            total: number;
            subtotal: number;
            discounts: number;
            customerName: any;
            customerEmail: any;
            customerPhone: any;
            addressCity: any;
            addressStreet: any;
            addressHouse: any;
            addressApartment: any;
            addressComment: any;
            paymentMethod: any;
            paymentStatus: any;
            createdAt: any;
            updatedAt: any;
            items: any;
        }[];
        total: number;
    }>;
    getOrderById(userId: number, orderId: number): Promise<{
        id: any;
        status: any;
        total: number;
        subtotal: number;
        discounts: number;
        customerName: any;
        customerEmail: any;
        customerPhone: any;
        addressCity: any;
        addressStreet: any;
        addressHouse: any;
        addressApartment: any;
        addressComment: any;
        paymentMethod: any;
        paymentStatus: any;
        createdAt: any;
        updatedAt: any;
        items: any;
    } | null>;
    private formatOrder;
}
export declare const orderService: OrderService;
//# sourceMappingURL=service.d.ts.map