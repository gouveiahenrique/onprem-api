const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_ISSUER } = require('../config/jwt');

/**
 * Express middleware that validates an OAuth 2.0 Bearer token.
 * On success, attaches the decoded JWT payload to req.auth.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'unauthorized',
      error_description: 'Missing or malformed Authorization header. Expected: Bearer <token>',
    });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER });
    req.auth = payload;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'token_expired',
        error_description: 'The access token has expired. Request a new token.',
      });
    }

    return res.status(401).json({
      error: 'invalid_token',
      error_description: 'The access token is invalid or has been tampered with.',
    });
  }
}

module.exports = { authenticate };
