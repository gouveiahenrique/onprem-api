/**
 * Client credential registry.
 *
 * Reads env vars at call time so tests can override process.env before
 * requiring this module without fighting Node's module cache.
 *
 * For production deployments with multiple clients, replace `getClient`
 * with a database-backed lookup (e.g. clients table keyed by client_id,
 * storing a bcrypt-hashed secret and a scopes array).
 */
function getClient(clientId) {
  const registeredId = process.env.OAUTH_CLIENT_ID || 'default-client';
  const registeredSecret = process.env.OAUTH_CLIENT_SECRET || 'insecure-default-change-me';

  if (clientId === registeredId) {
    return {
      clientSecret: registeredSecret,
      scopes: ['logs:read'],
    };
  }

  return null;
}

module.exports = { getClient };
