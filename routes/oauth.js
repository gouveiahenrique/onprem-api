'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const { verifyClientSecret } = require('../config/clients');

const router = express.Router();

// Accept both application/x-www-form-urlencoded (RFC 6749 standard) and JSON.
router.use(express.urlencoded({ extended: false }));

router.post('/token', (req, res) => {
  const { grant_type, client_id, client_secret } = req.body;

  if (!grant_type || grant_type !== 'client_credentials') {
    return res.status(400).json({
      error: 'unsupported_grant_type',
      error_description: 'Only client_credentials grant type is supported',
    });
  }

  if (!client_id || !client_secret) {
    return res.status(400).json({
      error: 'invalid_request',
      error_description: 'client_id and client_secret are required',
    });
  }

  const registry = req.app.get('oauthClients');
  if (!verifyClientSecret(registry, client_id, client_secret)) {
    return res.status(401).json({
      error: 'invalid_client',
      error_description: 'Invalid client credentials',
    });
  }

  const expiresIn = parseInt(process.env.TOKEN_EXPIRY_SECONDS || '3600', 10);
  const secret = process.env.JWT_SECRET;

  const token = jwt.sign({ sub: client_id }, secret, {
    algorithm: 'HS256',
    expiresIn,
  });

  return res.json({
    access_token: token,
    token_type: 'Bearer',
    expires_in: expiresIn,
  });
});

module.exports = router;
