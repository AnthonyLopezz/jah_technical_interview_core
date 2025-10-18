import request from 'supertest';
import { createApp } from '../app';

describe('Health route', () => {
  it('responds with ok and sets X-Request-Id', async () => {
    const app = createApp();
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.headers['x-request-id']).toBeDefined();
    expect(res.body?.data?.status).toBe('ok');
  });
});