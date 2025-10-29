"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const categoryRoutes_1 = require("../routes/categoryRoutes");
// Mock CategoryService folosit de CategoryController
jest.mock('../services/categoryService', () => {
    return {
        CategoryService: class {
            async getAllCategories() {
                return [{ id: 1, slug: 'carne', name: 'Carne' }];
            }
            async getCategoryBySlug(slug) {
                if (slug === 'carne')
                    return { id: 1, slug: 'carne', name: 'Carne' };
                return null;
            }
        }
    };
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/categories', categoryRoutes_1.categoryRoutes);
describe('GET /api/categories/:slug', () => {
    it('returnează 200 pentru slug existent', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/categories/carne');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.slug).toBe('carne');
    });
    it('returnează 404 pentru slug inexistent', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/categories/necunoscut');
        expect(res.status).toBe(404);
    });
});
//# sourceMappingURL=categories.slug.mock.test.js.map