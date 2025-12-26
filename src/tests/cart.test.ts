import request from 'supertest';
import { createApp } from '../app';
import prisma from '../shared/prisma/client';

const app = createApp();

describe('Cart Module', () => {
  let cookies: string[];
  let testUser = {
    email: `cart-test-${Date.now()}@example.com`,
    password: 'password123',
  };
  let variantId: number;

  beforeAll(async () => {
    // Înregistrăm utilizator
    const regRes = await request(app).post('/api/auth/register').send({
      ...testUser,
      name: 'Cart Tester'
    });
    cookies = regRes.headers['set-cookie'];

    // Luăm o variantă de produs existentă
    const variant = await prisma.productVariant.findFirst();
    if (!variant) {
      // Dacă nu există, creăm una minimală pentru test
      const category = await prisma.category.create({ data: { name: 'Test', slug: `test-${Date.now()}` } });
      const product = await prisma.product.create({
        data: {
          name: 'Test Pizza',
          categoryId: category.id,
          basePrice: 20
        }
      });
      const v = await prisma.productVariant.create({
        data: {
          productId: product.id,
          price: 25,
        }
      });
      variantId = v.id;
    } else {
      variantId = variant.id;
    }
  });

  afterAll(async () => {
    const user = await prisma.user.findUnique({ where: { email: testUser.email } });
    if (user) {
      await prisma.cartItem.deleteMany({ where: { cart: { userId: user.id } } });
      await prisma.cart.deleteMany({ where: { userId: user.id } });
      await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
    await prisma.$disconnect();
  });

  it('should add item to cart', async () => {
    const res = await request(app)
      .post('/api/cart/items')
      .set('Cookie', cookies)
      .send({
        productVariantId: variantId,
        quantity: 2
      });

    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].quantity).toBe(2);
  });

  it('should get the cart', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
  });

  it('should update item quantity', async () => {
    const cartRes = await request(app).get('/api/cart').set('Cookie', cookies);
    const itemId = cartRes.body.data.items[0].id;

    const res = await request(app)
      .patch(`/api/cart/items/${itemId}`)
      .set('Cookie', cookies)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body.data.items[0].quantity).toBe(5);
  });

  it('should remove item from cart', async () => {
    const cartRes = await request(app).get('/api/cart').set('Cookie', cookies);
    const itemId = cartRes.body.data.items[0].id;

    const res = await request(app)
      .delete(`/api/cart/items/${itemId}`)
      .set('Cookie', cookies);

    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(0);
  });
});
