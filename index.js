'use strict';

require('dotenv').config();

const express = require('express');
const { loadClients } = require('./config/clients');
const oauthRouter = require('./routes/oauth');
const auth = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 3000;

// Validate required environment variables at startup.
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set and at least 32 characters long');
}

// Load registered OAuth clients and make them available to route handlers.
const oauthClients = loadClients();
app.set('oauthClients', oauthClients);

app.use(express.json());

// OAuth token issuance — public endpoint.
app.use('/oauth', oauthRouter);

// Protected log endpoint — requires a valid Bearer token.
app.get('/logs', auth, (req, res) => {
  const logs = {
    timestamp: new Date().toISOString(),
    entries: [
      { level: 'info', message: 'Application started successfully', timestamp: '2025-09-30T10:00:00Z' },
      { level: 'info', message: 'User authentication successful', timestamp: '2025-09-30T10:05:23Z' },
      { level: 'warning', message: 'High memory usage detected', timestamp: '2025-09-30T10:15:45Z' },
      { level: 'error', message: 'Database connection failed', timestamp: '2025-09-30T10:17:12Z' },
      { level: 'info', message: 'Database connection restored', timestamp: '2025-09-30T10:18:30Z' },
    ],
    count: 5,
    status: 'success',
  };

  res.json(logs);
});

// Default route — public.
app.get('/', (req, res) => {
  res.send('Welcome to the API! Try accessing the /logs endpoint.');
});

// Only start listening when run directly (not when imported by tests).
if (require.main === module) {
  app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
  });
}

module.exports = app;
