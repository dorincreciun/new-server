import prisma from '../../shared/prisma/client';
import { NotFoundError } from '../../shared/http/errors';
import { formatDecimal } from '../../shared/utils/formatters';

export class CartService {
  async getOrCreateCart(userId: number) {
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }
    return cart;
  }

  async getCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        productVariant: {
          include: {
            product: { include: { category: true } },
            dough: true,
            size: true,
          }
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const itemsFormatted = items.map((it) => ({
      id: it.id,
      product: {
        id: it.productVariant.product.id,
        name: it.productVariant.product.name,
        description: it.productVariant.product.description || '',
        basePrice: formatDecimal(it.productVariant.product.basePrice),
        imageUrl: it.productVariant.product.imageUrl || '',
        category: it.productVariant.product.category,
      },
      variant: {
        id: it.productVariant.id,
        doughType: it.productVariant.dough,
        sizeOption: it.productVariant.size,
        price: formatDecimal(it.productVariant.price),
      },
      quantity: it.quantity,
      lineTotal: formatDecimal(it.unitPrice) * it.quantity,
    }));

    const total = itemsFormatted.reduce((sum, it) => sum + (it.lineTotal || 0), 0);

    return {
      id: cart.id,
      items: itemsFormatted,
      subtotal: total,
      discounts: 0,
      total: total,
    };
  }

  async addItem(userId: number, productVariantId: number, quantity: number = 1) {
    const cart = await this.getOrCreateCart(userId);
    const variant = await prisma.productVariant.findUnique({ where: { id: productVariantId } });
    if (!variant) throw new NotFoundError('Varianta produsului nu a fost găsită');

    const unitPrice = variant.price;

    await prisma.cartItem.upsert({
      where: { cartId_productVariantId: { cartId: cart.id, productVariantId } },
      update: {
        quantity: { increment: quantity },
        unitPrice,
      },
      create: {
        cartId: cart.id,
        productVariantId,
        quantity,
        unitPrice,
      },
    });

    return this.getCart(userId);
  }

  async updateItemQuantity(userId: number, itemId: number, quantity: number) {
    const cart = await this.getOrCreateCart(userId);
    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
    if (!item) throw new NotFoundError('Item-ul nu a fost găsit în coș');

    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await this.getOrCreateCart(userId);
    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
    if (!item) throw new NotFoundError('Item-ul nu a fost găsit în coș');

    await prisma.cartItem.delete({ where: { id: item.id } });

    return this.getCart(userId);
  }

  async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}

export const cartService = new CartService();
