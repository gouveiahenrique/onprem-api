// Set env vars before any require so jwt.js and clients.js pick them up at load time
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-32-chars-minimum!!';
process.env.JWT_ISSUER = 'test-issuer';
process.env.OAUTH_CLIENT_ID = 'test-client';
process.env.OAUTH_CLIENT_SECRET = 'test-client-secret';

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../index');

const LOGS_ENDPOINT = '/logs';

function mintToken(overrides = {}) {
  return jwt.sign(
    { sub: 'test-client', scope: 'logs:read', ...overrides },
    process.env.JWT_SECRET,
    { expiresIn: '1h', issuer: process.env.JWT_ISSUER }
  );
}

describe('GET /logs', () => {
  describe('with a valid Bearer token', () => {
    let response;

    beforeAll(async () => {
      const token = mintToken();
      response = await request(app)
        .get(LOGS_ENDPOINT)
        .set('Authorization', `Bearer ${token}`);
    });

    it('returns HTTP 200', () => {
      expect(response.status).toBe(200);
    });

    it('returns a logs payload with the expected shape', () => {
      expect(response.body).toMatchObject({
        count: 5,
        status: 'success',
      });
      expect(Array.isArray(response.body.entries)).toBe(true);
      expect(response.body.entries).toHaveLength(5);
      expect(typeof response.body.timestamp).toBe('string');
    });

    it('each log entry has level, message, and timestamp', () => {
      for (const entry of response.body.entries) {
        expect(entry).toHaveProperty('level');
        expect(entry).toHaveProperty('message');
        expect(entry).toHaveProperty('timestamp');
      }
    });
  });

  describe('token obtained via /oauth/token is accepted', () => {
    it('returns 200 when using a token from the token endpoint', async () => {
      const tokenRes = await request(app).post('/oauth/token').send({
        grant_type: 'client_credentials',
        client_id: 'test-client',
        client_secret: 'test-client-secret',
      });

      expect(tokenRes.status).toBe(200);

      const logsRes = await request(app)
        .get(LOGS_ENDPOINT)
        .set('Authorization', `Bearer ${tokenRes.body.access_token}`);

      expect(logsRes.status).toBe(200);
      expect(logsRes.body.status).toBe('success');
    });
  });

  describe('unauthorized access', () => {
    it('returns 401 when Authorization header is absent', async () => {
      const res = await request(app).get(LOGS_ENDPOINT);
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('unauthorized');
    });

    it('returns 401 when Authorization header has no Bearer prefix', async () => {
      const res = await request(app)
        .get(LOGS_ENDPOINT)
        .set('Authorization', 'Basic dXNlcjpwYXNz');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('unauthorized');
    });

    it('returns 401 for a tampered / invalid token', async () => {
      const res = await request(app)
        .get(LOGS_ENDPOINT)
        .set('Authorization', 'Bearer this.is.not.a.valid.jwt');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('invalid_token');
    });

    it('returns 401 for a token signed with the wrong secret', async () => {
      const badToken = jwt.sign(
        { sub: 'test-client', scope: 'logs:read' },
        'completely-different-secret',
        { expiresIn: '1h', issuer: process.env.JWT_ISSUER }
      );
      const res = await request(app)
        .get(LOGS_ENDPOINT)
        .set('Authorization', `Bearer ${badToken}`);
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('invalid_token');
    });

    it('returns 401 for an expired token', async () => {
      // Sign with a past expiry using the correct secret
      const expiredToken = jwt.sign(
        { sub: 'test-client', scope: 'logs:read' },
        process.env.JWT_SECRET,
        { expiresIn: -1, issuer: process.env.JWT_ISSUER }
      );
      const res = await request(app)
        .get(LOGS_ENDPOINT)
        .set('Authorization', `Bearer ${expiredToken}`);
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('token_expired');
    });
  });
});
