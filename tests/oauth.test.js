// Set env vars before any require so jwt.js and clients.js pick them up at load time
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-32-chars-minimum!!';
process.env.JWT_ISSUER = 'test-issuer';
process.env.OAUTH_CLIENT_ID = 'test-client';
process.env.OAUTH_CLIENT_SECRET = 'test-client-secret';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index');

const TOKEN_ENDPOINT = '/oauth/token';

const validPayload = {
  grant_type: 'client_credentials',
  client_id: 'test-client',
  client_secret: 'test-client-secret',
};

describe('POST /oauth/token', () => {
  describe('successful token issuance', () => {
    let response;

    beforeAll(async () => {
      response = await request(app).post(TOKEN_ENDPOINT).send(validPayload);
    });

    it('returns HTTP 200', () => {
      expect(response.status).toBe(200);
    });

    it('returns a well-formed token response', () => {
      expect(response.body).toMatchObject({
        token_type: 'Bearer',
        scope: 'logs:read',
      });
      expect(typeof response.body.access_token).toBe('string');
      expect(typeof response.body.expires_in).toBe('number');
      expect(response.body.expires_in).toBeGreaterThan(0);
    });

    it('issues a verifiable JWT', () => {
      const payload = jwt.verify(
        response.body.access_token,
        process.env.JWT_SECRET,
        { issuer: process.env.JWT_ISSUER }
      );
      expect(payload.sub).toBe('test-client');
      expect(payload.scope).toBe('logs:read');
    });

    it('expires_in matches the JWT exp-iat delta', () => {
      const decoded = jwt.decode(response.body.access_token);
      expect(response.body.expires_in).toBe(decoded.exp - decoded.iat);
    });
  });

  describe('also accepts application/x-www-form-urlencoded', () => {
    it('returns HTTP 200', async () => {
      const res = await request(app)
        .post(TOKEN_ENDPOINT)
        .type('form')
        .send(validPayload);
      expect(res.status).toBe(200);
      expect(res.body.token_type).toBe('Bearer');
    });
  });

  describe('validation errors', () => {
    it('returns 400 when grant_type is missing', async () => {
      const res = await request(app)
        .post(TOKEN_ENDPOINT)
        .send({ client_id: 'test-client', client_secret: 'test-client-secret' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('invalid_request');
    });

    it('returns 400 when grant_type is unsupported', async () => {
      const res = await request(app)
        .post(TOKEN_ENDPOINT)
        .send({ ...validPayload, grant_type: 'authorization_code' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('unsupported_grant_type');
    });

    it('returns 400 when client_id is missing', async () => {
      const res = await request(app)
        .post(TOKEN_ENDPOINT)
        .send({ grant_type: 'client_credentials', client_secret: 'test-client-secret' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('invalid_request');
    });

    it('returns 400 when client_secret is missing', async () => {
      const res = await request(app)
        .post(TOKEN_ENDPOINT)
        .send({ grant_type: 'client_credentials', client_id: 'test-client' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('invalid_request');
    });
  });

  describe('authentication errors', () => {
    it('returns 401 for an unknown client_id', async () => {
      const res = await request(app)
        .post(TOKEN_ENDPOINT)
        .send({ ...validPayload, client_id: 'unknown-client' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('invalid_client');
    });

    it('returns 401 for a wrong client_secret', async () => {
      const res = await request(app)
        .post(TOKEN_ENDPOINT)
        .send({ ...validPayload, client_secret: 'wrong-secret' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('invalid_client');
    });
  });
});
