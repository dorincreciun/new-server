import request from 'supertest';
import { createApp } from '../server';
// Folosim Jest: describe/it/expect sunt globale, nu importa din "node:test"

describe('GET /health', () => {
  const app = createApp();

  it('returns 200 and { status: "ok" }', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
// Eliminată redefinirea expect care crea conflict cu Jest

