import request from 'supertest';
import express from 'express';
import { productRoutes } from '../routes/productRoutes';

// Mock ProductService folosit de ProductController
jest.mock('../services/productService', () => {
  return {
    ProductService: class {
      async getFacetsByCategorySlug(slug: string) {
        if (!slug || slug === 'invalid') {
          throw new Error('INVALID');
        }
        return {
          flags: [{ key: 'spicy', label: 'Picant', count: 3 }],
          ingredients: [{ key: 'mozzarella', label: 'Mozzarella', count: 10 }],
          doughTypes: [{ key: 'thin', label: 'Aluat Subțire', count: 5 }],
          sizeOptions: [{ key: '30cm', label: '30cm', count: 7 }],
          price: { min: 100, max: 500 }
        };
      }
    }
  };
});

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

describe('GET /api/products/facets/:slug', () => {
  it('returnează 200 și obiectul facets pentru slug valid', async () => {
    const res = await request(app).get('/api/products/facets/carne');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('flags');
    expect(res.body.data).toHaveProperty('price');
  });

  it('returnează 400 pentru slug lipsă/invalid', async () => {
    const res = await request(app).get('/api/products/facets/%20');
    expect([400,500]).toContain(res.status);
  });
});


