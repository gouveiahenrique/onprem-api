const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';
const JWT_ISSUER = process.env.JWT_ISSUER || 'onprem-api';

/* istanbul ignore next */
if (!JWT_SECRET && process.env.NODE_ENV !== 'test') {
  console.warn(
    '[WARN] JWT_SECRET is not set. Using an insecure default. ' +
      'Set JWT_SECRET in your environment before deploying to production.'
  );
}

const resolvedSecret = JWT_SECRET || 'insecure-default-change-me';

module.exports = { JWT_SECRET: resolvedSecret, JWT_EXPIRY, JWT_ISSUER };
