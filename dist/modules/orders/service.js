"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = exports.OrderService = void 0;
const client_1 = require("@prisma/client");
const service_1 = require("../cart/service");
const client_2 = __importDefault(require("../../shared/prisma/client"));
const formatters_1 = require("../../shared/utils/formatters");
class OrderService {
    async createOrder(userId, customerData, addressData, paymentMethod) {
        const cartInfo = await service_1.cartService.getCart(userId);
        if (cartInfo.items.length === 0) {
            throw new Error('CART_EMPTY');
        }
        // Calculăm totalurile
        const subtotal = cartInfo.subtotal;
        const discounts = cartInfo.discounts || 0;
        const total = cartInfo.total;
        // Creăm comanda într-o tranzacție
        const order = await client_2.default.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    status: client_1.OrderStatus.PENDING,
                    subtotal,
                    discounts,
                    total,
                    customerName: customerData.name,
                    customerEmail: customerData.email || null,
                    customerPhone: customerData.phone,
                    addressCity: addressData.city,
                    addressStreet: addressData.street,
                    addressHouse: addressData.house,
                    addressApartment: addressData.apartment || null,
                    addressComment: addressData.comment || null,
                    paymentMethod: paymentMethod || null,
                    items: {
                        create: cartInfo.items.map(item => ({
                            productVariantId: item.variant.id,
                            quantity: item.quantity,
                            unitPrice: item.variant.price,
                            productName: item.product.name,
                            variantName: `${item.variant.sizeOption?.label || ''} ${item.variant.doughType?.label || ''}`.trim() || null,
                            imageUrl: item.product.imageUrl || null,
                        }))
                    }
                },
                include: {
                    items: true
                }
            });
            // Golim coșul
            await tx.cartItem.deleteMany({
                where: { cartId: cartInfo.id }
            });
            return newOrder;
        });
        return this.formatOrder(order);
    }
    async getUserOrders(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            client_2.default.order.findMany({
                where: { userId },
                include: { items: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            client_2.default.order.count({ where: { userId } })
        ]);
        return {
            orders: orders.map(order => this.formatOrder(order)),
            total
        };
    }
    async getOrderById(userId, orderId) {
        const order = await client_2.default.order.findFirst({
            where: { id: orderId, userId },
            include: { items: true }
        });
        return order ? this.formatOrder(order) : null;
    }
    formatOrder(order) {
        return {
            id: order.id,
            status: order.status,
            total: (0, formatters_1.formatDecimal)(order.total),
            subtotal: (0, formatters_1.formatDecimal)(order.subtotal),
            discounts: (0, formatters_1.formatDecimal)(order.discounts),
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            addressCity: order.addressCity,
            addressStreet: order.addressStreet,
            addressHouse: order.addressHouse,
            addressApartment: order.addressApartment,
            addressComment: order.addressComment,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: order.items.map((item) => ({
                id: item.id,
                productName: item.productName,
                variantName: item.variantName,
                quantity: item.quantity,
                unitPrice: (0, formatters_1.formatDecimal)(item.unitPrice),
                imageUrl: item.imageUrl,
            }))
        };
    }
}
exports.OrderService = OrderService;
exports.orderService = new OrderService();
//# sourceMappingURL=service.js.map