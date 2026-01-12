import { OrderStatus } from '@prisma/client';
import { cartService } from '../cart/service';
import prisma from '../../shared/prisma/client';
import { formatDecimal } from '../../shared/utils/formatters';

export class OrderService {
  async createOrder(
    userId: number,
    customerData: {
      name: string;
      email?: string;
      phone: string;
    },
    addressData: {
      city: string;
      street: string;
      house: string;
      apartment?: string;
      comment?: string;
    },
    paymentMethod: string
  ) {
    const cartInfo = await cartService.getCart(userId);
    if (cartInfo.items.length === 0) {
      throw new Error('CART_EMPTY');
    }

    // Calculăm totalurile
    const subtotal = cartInfo.subtotal;
    const discounts = cartInfo.discounts || 0;
    const total = cartInfo.total;

    // Creăm comanda într-o tranzacție
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
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

  async getUserOrders(userId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count({ where: { userId } })
    ]);

    return {
      orders: orders.map(order => this.formatOrder(order)),
      total
    };
  }

  async getOrderById(userId: number, orderId: number) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true }
    });
    
    return order ? this.formatOrder(order) : null;
  }

  private formatOrder(order: any) {
    return {
      id: order.id,
      status: order.status,
      total: formatDecimal(order.total),
      subtotal: formatDecimal(order.subtotal),
      discounts: formatDecimal(order.discounts),
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
      items: order.items.map((item: any) => ({
        id: item.id,
        productName: item.productName,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice: formatDecimal(item.unitPrice),
        imageUrl: item.imageUrl,
      }))
    };
  }
}

export const orderService = new OrderService();
