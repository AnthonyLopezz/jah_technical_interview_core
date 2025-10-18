import request from 'supertest';
import { createApp } from '../app';

describe('Auth /login validation', () => {
  it('should return 400 for invalid body', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'invalid', password: '' });

    expect(res.status).toBe(400);
    expect(res.body).toBeDefined();
  });
});