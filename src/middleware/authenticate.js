const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_ISSUER } = require('../config/jwt');

/**
 * Returns Express middleware that validates an OAuth 2.0 Bearer token.
 * The token's scope claim must include requiredScope; otherwise the request
 * is rejected with 403 insufficient_scope.
 * On success, attaches the decoded JWT payload to req.auth.
 *
 * @param {string} requiredScope - Scope the token must include (e.g. 'logs:read').
 */
function authenticate(requiredScope) {
  return function authenticateMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'unauthorized',
        error_description: 'Missing or malformed Authorization header. Expected: Bearer <token>',
      });
    }

    const token = authHeader.slice(7);

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET, { issuer: JWT_ISSUER });
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

    const tokenScopes = (payload.scope || '').split(' ');
    if (!tokenScopes.includes(requiredScope)) {
      return res.status(403).json({
        error: 'insufficient_scope',
        error_description: `The access token does not have the required scope: ${requiredScope}`,
      });
    }

    req.auth = payload;
    next();
  };
}

module.exports = { authenticate };
