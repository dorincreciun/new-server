"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../server");
// Folosim Jest: describe/it/expect sunt globale, nu importa din "node:test"
describe('GET /health', () => {
    const app = (0, server_1.createApp)();
    it('returns 200 and { status: "ok" }', async () => {
        const res = await (0, supertest_1.default)(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: 'ok' });
    });
});
// Eliminată redefinirea expect care crea conflict cu Jest
//# sourceMappingURL=health.test.js.map