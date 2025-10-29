import request from 'supertest';
import express from 'express';
import { categoryRoutes } from '../routes/categoryRoutes';

// Mock CategoryService folosit de CategoryController
jest.mock('../services/categoryService', () => {
  return {
    CategoryService: class {
      async getAllCategories() {
        return [{ id: 1, slug: 'carne', name: 'Carne' }];
      }
      async getCategoryBySlug(slug: string) {
        if (slug === 'carne') return { id: 1, slug: 'carne', name: 'Carne' };
        return null;
      }
    }
  };
});

const app = express();
app.use(express.json());
app.use('/api/categories', categoryRoutes);

describe('GET /api/categories/:slug', () => {
  it('returnează 200 pentru slug existent', async () => {
    const res = await request(app).get('/api/categories/carne');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.slug).toBe('carne');
  });

  it('returnează 404 pentru slug inexistent', async () => {
    const res = await request(app).get('/api/categories/necunoscut');
    expect(res.status).toBe(404);
  });
});


