import request from 'supertest';
import express from 'express';
import { browseRoutes } from '../routes/browse';

// Mock BrowseService folosit de BrowseController
jest.mock('../services/browseService', () => {
  return {
    BrowseService: class {
      async getProducts(query: any) {
        return {
          products: [
            { id: 1, name: 'Produs 1', minPrice: 100, maxPrice: 150, category: { slug: query.categorySlug || 'pizza' } },
            { id: 2, name: 'Produs 2', minPrice: 120, maxPrice: 180, category: { slug: query.categorySlug || 'pizza' } },
          ],
          total: 2,
        };
      }
      async getFilters(query: any) {
        return {
          flags: [{ key: 'spicy', label: 'Picant', count: 2 }],
          ingredients: [{ key: 'mozzarella', label: 'Mozzarella', count: 2 }],
          doughTypes: [{ key: 'thin', label: 'Aluat Subțire', count: 2 }],
          sizeOptions: [{ key: '30cm', label: '30cm', count: 2 }],
          price: { min: 100, max: 200 },
        };
      }
    }
  };
});

const app = express();
app.use(express.json());
app.use('/api/browse', browseRoutes);

describe('GET /api/browse/products cu categorySlug', () => {
  it('returnează 200 și listează produse filtrate prin slug', async () => {
    const res = await request(app).get('/api/browse/products?categorySlug=carne&limit=10&page=1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('pagination');
  });
});

describe('GET /api/browse/filters cu categorySlug', () => {
  it('returnează 200 și opțiunile de filtre', async () => {
    const res = await request(app).get('/api/browse/filters?categorySlug=carne');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('flags');
    expect(res.body.data).toHaveProperty('price');
  });
});


