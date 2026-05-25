'use strict';

process.env.JWT_SECRET = 'test-secret-that-is-long-enough-for-hs256';
process.env.CLIENT_ID = 'test-client';
process.env.CLIENT_SECRET = 'test-secret';
process.env.TOKEN_EXPIRY_SECONDS = '3600';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index');

const JWT_SECRET = process.env.JWT_SECRET;

async function getValidToken() {
  const res = await request(app)
    .post('/oauth/token')
    .type('form')
    .send({ grant_type: 'client_credentials', client_id: 'test-client', client_secret: 'test-secret' });
  return res.body.access_token;
}

describe('GET /logs', () => {
  it('returns 200 with log entries when a valid token is provided', async () => {
    const token = await getValidToken();
    const res = await request(app)
      .get('/logs')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.entries)).toBe(true);
    expect(res.body.entries.length).toBe(5);
  });

  it('returns 401 when Authorization header is missing', async () => {
    const res = await request(app).get('/logs');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('unauthorized');
  });

  it('returns 401 when Authorization header is malformed', async () => {
    const res = await request(app)
      .get('/logs')
      .set('Authorization', 'not-a-bearer-token');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('unauthorized');
  });

  it('returns 403 when token has an invalid signature', async () => {
    const tampered = jwt.sign({ sub: 'test-client' }, 'wrong-secret', { expiresIn: 3600 });
    const res = await request(app)
      .get('/logs')
      .set('Authorization', `Bearer ${tampered}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('invalid_token');
  });

  it('returns 403 when token is expired', async () => {
    const expired = jwt.sign({ sub: 'test-client' }, JWT_SECRET, { expiresIn: -1 });
    const res = await request(app)
      .get('/logs')
      .set('Authorization', `Bearer ${expired}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('token_expired');
  });

  it('returns 403 when token is completely garbage', async () => {
    const res = await request(app)
      .get('/logs')
      .set('Authorization', 'Bearer this.is.garbage');

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('invalid_token');
  });
});
