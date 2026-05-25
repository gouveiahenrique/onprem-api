'use strict';

const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'unauthorized',
      error_description: 'Missing or malformed Authorization header',
    });
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;

  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    req.client = payload;
    next();
  } catch (err) {
    const isExpired = err.name === 'TokenExpiredError';
    return res.status(403).json({
      error: isExpired ? 'token_expired' : 'invalid_token',
      error_description: isExpired ? 'Access token has expired' : 'Access token is invalid',
    });
  }
}

module.exports = auth;
