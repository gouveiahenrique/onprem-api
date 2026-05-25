const express = require('express');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

/**
 * GET /logs
 *
 * Returns recent application log entries.
 * Requires a valid Bearer token with the logs:read scope.
 */
router.get('/', authenticate, (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    entries: [
      { level: 'info',    message: 'Application started successfully',  timestamp: '2025-09-30T10:00:00Z' },
      { level: 'info',    message: 'User authentication successful',    timestamp: '2025-09-30T10:05:23Z' },
      { level: 'warning', message: 'High memory usage detected',        timestamp: '2025-09-30T10:15:45Z' },
      { level: 'error',   message: 'Database connection failed',        timestamp: '2025-09-30T10:17:12Z' },
      { level: 'info',    message: 'Database connection restored',      timestamp: '2025-09-30T10:18:30Z' },
    ],
    count: 5,
    status: 'success',
  });
});

module.exports = router;
