process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-32-chars-minimum!!';
process.env.JWT_ISSUER = 'test-issuer';
process.env.OAUTH_CLIENT_ID = 'test-client';
process.env.OAUTH_CLIENT_SECRET = 'test-client-secret';

const request = require('supertest');
const app = require('../index');

describe('GET /', () => {
  it('returns 200 with API discovery information', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      message: expect.any(String),
      auth: expect.objectContaining({ endpoint: 'POST /oauth/token' }),
      protected_endpoints: expect.arrayContaining(['GET /logs']),
    });
  });
});
