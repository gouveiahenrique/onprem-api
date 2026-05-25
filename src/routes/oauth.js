const express = require('express');
const jwt = require('jsonwebtoken');
const { getClient } = require('../config/clients');
const { JWT_SECRET, JWT_EXPIRY, JWT_ISSUER } = require('../config/jwt');

const router = express.Router();

/**
 * POST /oauth/token
 *
 * OAuth 2.0 Client Credentials grant (RFC 6749 §4.4).
 * Accepts application/json or application/x-www-form-urlencoded.
 *
 * Request body:
 *   grant_type     (required) must be "client_credentials"
 *   client_id      (required)
 *   client_secret  (required)
 *
 * Response (200):
 *   access_token   JWT Bearer token
 *   token_type     "Bearer"
 *   expires_in     seconds until expiry
 *   scope          space-separated granted scopes
 */
router.post('/token', (req, res) => {
  const { grant_type, client_id, client_secret } = req.body;

  if (!grant_type) {
    return res.status(400).json({
      error: 'invalid_request',
      error_description: 'grant_type is required',
    });
  }

  if (grant_type !== 'client_credentials') {
    return res.status(400).json({
      error: 'unsupported_grant_type',
      error_description: 'Only the client_credentials grant type is supported',
    });
  }

  if (!client_id || !client_secret) {
    return res.status(400).json({
      error: 'invalid_request',
      error_description: 'client_id and client_secret are required',
    });
  }

  const client = getClient(client_id);

  if (!client || client.clientSecret !== client_secret) {
    return res.status(401).json({
      error: 'invalid_client',
      error_description: 'Invalid client credentials',
    });
  }

  const scope = client.scopes.join(' ');
  const token = jwt.sign({ sub: client_id, scope }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
    issuer: JWT_ISSUER,
  });

  const { iat, exp } = jwt.decode(token);

  res.json({
    access_token: token,
    token_type: 'Bearer',
    expires_in: exp - iat,
    scope,
  });
});

module.exports = router;
