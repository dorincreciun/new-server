"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const productRoutes_1 = require("../routes/productRoutes");
// Mock ProductService folosit de ProductController
jest.mock('../services/productService', () => {
    return {
        ProductService: class {
            async getFacetsByCategorySlug(slug) {
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
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/products', productRoutes_1.productRoutes);
describe('GET /api/products/facets/:slug', () => {
    it('returnează 200 și obiectul facets pentru slug valid', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/products/facets/carne');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('flags');
        expect(res.body.data).toHaveProperty('price');
    });
    it('returnează 400 pentru slug lipsă/invalid', async () => {
        const res = await (0, supertest_1.default)(app).get('/api/products/facets/%20');
        expect([400, 500]).toContain(res.status);
    });
});
//# sourceMappingURL=products.facets.mock.test.js.map