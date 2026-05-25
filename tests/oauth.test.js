'use strict';

// Set env vars before requiring any module so loadClients() and JWT_SECRET are available.
process.env.JWT_SECRET = 'test-secret-that-is-long-enough-for-hs256';
process.env.CLIENT_ID = 'test-client';
process.env.CLIENT_SECRET = 'test-secret';
process.env.TOKEN_EXPIRY_SECONDS = '3600';

const request = require('supertest');
const app = require('../index');

describe('POST /oauth/token', () => {
  it('returns 200 with access_token for valid client credentials', async () => {
    const res = await request(app)
      .post('/oauth/token')
      .type('form')
      .send({ grant_type: 'client_credentials', client_id: 'test-client', client_secret: 'test-secret' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      token_type: 'Bearer',
      expires_in: 3600,
    });
    expect(typeof res.body.access_token).toBe('string');
    expect(res.body.access_token.length).toBeGreaterThan(0);
  });

  it('returns 200 when request body is JSON', async () => {
    const res = await request(app)
      .post('/oauth/token')
      .send({ grant_type: 'client_credentials', client_id: 'test-client', client_secret: 'test-secret' });

    expect(res.status).toBe(200);
    expect(res.body.token_type).toBe('Bearer');
  });

  it('returns 401 for wrong client_secret', async () => {
    const res = await request(app)
      .post('/oauth/token')
      .type('form')
      .send({ grant_type: 'client_credentials', client_id: 'test-client', client_secret: 'wrong-secret' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('invalid_client');
  });

  it('returns 401 for unknown client_id', async () => {
    const res = await request(app)
      .post('/oauth/token')
      .type('form')
      .send({ grant_type: 'client_credentials', client_id: 'unknown', client_secret: 'test-secret' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('invalid_client');
  });

  it('returns 400 when grant_type is missing', async () => {
    const res = await request(app)
      .post('/oauth/token')
      .type('form')
      .send({ client_id: 'test-client', client_secret: 'test-secret' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('unsupported_grant_type');
  });

  it('returns 400 for unsupported grant_type', async () => {
    const res = await request(app)
      .post('/oauth/token')
      .type('form')
      .send({ grant_type: 'password', client_id: 'test-client', client_secret: 'test-secret' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('unsupported_grant_type');
  });

  it('returns 400 when client_id or client_secret are missing', async () => {
    const res = await request(app)
      .post('/oauth/token')
      .type('form')
      .send({ grant_type: 'client_credentials' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_request');
  });
});
