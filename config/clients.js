'use strict';

const crypto = require('crypto');

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest();
}

// Load pre-registered clients from environment variables.
// For multiple clients, extend this pattern or switch to a config file.
function loadClients() {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('CLIENT_ID and CLIENT_SECRET environment variables are required');
  }

  const registry = new Map();
  registry.set(clientId, { hashedSecret: sha256(clientSecret) });
  return registry;
}

// Returns true if the provided secret matches the stored hash for clientId.
// Uses constant-time comparison to prevent timing-oracle attacks.
function verifyClientSecret(registry, clientId, clientSecret) {
  const entry = registry.get(clientId);
  if (!entry) return false;

  const provided = sha256(clientSecret);
  if (provided.length !== entry.hashedSecret.length) return false;

  return crypto.timingSafeEqual(provided, entry.hashedSecret);
}

module.exports = { loadClients, verifyClientSecret };
