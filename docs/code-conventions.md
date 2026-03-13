# Code Conventions

**Last updated:** 2026-03-13

## Naming Conventions

### Variables and Functions

- **JavaScript:** `camelCase` (`logEntries`, `getLogsHandler()`)
- **Constants:** `UPPER_SNAKE_CASE` (`PORT`, `API_VERSION`)

### Classes

- **JavaScript:** `PascalCase` (`LogService`, `ErrorHandler`)

### Files

- **JavaScript:** `camelCase.js` or `kebab-case.js`
  - Current: `index.js` (lowercase)
  - Recommended for routes: `logs.js`, `health.js`
  - Recommended for tests: `logs.test.js`, `api.spec.js`

## Code Formatting

### Line Length

- **Current:** No enforced limit
- **Recommended:** 100 characters maximum
- **Reason:** Readable on modern displays, works in split-screen

### Indentation

- **JavaScript:** 2 spaces (Node.js convention)
- **Detected in codebase:** 2 spaces consistently used

### Quotes

- **JavaScript:** Single quotes `'` preferred (current style)
- **Exception:** JSON requires double quotes `"`

### Semicolons

- **Current style:** Semicolons used consistently
- **Recommended:** Continue using semicolons (explicit style)

## Type Checking

### JavaScript (No TypeScript)

- **Current:** No type checking
- **Recommended:** Consider JSDoc comments for type hints:

```javascript
/**
 * Get logs handler
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {void}
 */
app.get('/logs', (req, res) => {
  // implementation
});
```

## Async/Await Patterns

### Current Code

All routes are synchronous (return static data). No async patterns yet.

### Recommended for Future

```javascript
// Use async/await for I/O operations
app.get('/logs', async (req, res) => {
  try {
    const logs = await fetchLogsFromDatabase();
    res.json({
      timestamp: new Date().toISOString(),
      entries: logs,
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message
      }
    });
  }
});
```

## Error Handling

### Current Code

No explicit error handling - relies on Express defaults.

### Recommended Pattern

```javascript
// Custom error class
class ApiError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';

  res.status(statusCode).json({
    error: {
      code,
      message: err.message,
      timestamp: new Date().toISOString()
    }
  });
});

// Usage in routes
app.get('/logs/:id', async (req, res, next) => {
  try {
    const log = await findLogById(req.params.id);
    if (!log) {
      throw new ApiError(404, 'NOT_FOUND', 'Log entry not found');
    }
    res.json({ data: log });
  } catch (error) {
    next(error);
  }
});
```

## Logging

### Current Code

Uses `console.log` for server startup only.

### Recommended Pattern

```javascript
// Use structured logging library like pino or winston
const pino = require('pino');
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

// Log with context
logger.info({
  event: 'server_started',
  port: port,
  timestamp: new Date().toISOString()
});

// Log requests
app.use((req, res, next) => {
  logger.info({
    event: 'request_received',
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
});
```

### Log Levels

- **debug:** Detailed diagnostic info (development only)
- **info:** Normal operation events (server started, request received)
- **warn:** Unexpected but handled (deprecated endpoint, slow response)
- **error:** Error occurred (database error, external API failed)
- **fatal:** System failure (cannot start server, critical dependency missing)

## Comments and Documentation

### Current Code

Minimal comments - only describes endpoint behavior.

### When to Comment

- ✅ Complex business logic (explain "why", not "what")
- ✅ Workarounds for bugs (link to issue)
- ✅ Non-obvious API decisions
- ❌ Self-evident code (`i++  // increment i`)

### JSDoc Comments (Recommended)

```javascript
/**
 * Retrieves application logs
 * @route GET /logs
 * @returns {Object} 200 - Log entries with metadata
 * @returns {Object} 500 - Internal server error
 */
app.get('/logs', (req, res) => {
  // implementation
});
```

## Code Organization Patterns

### Current Code

Single file with linear flow:
1. Imports
2. App initialization
3. Middleware
4. Routes
5. Server startup

### Recommended Patterns

```javascript
// Separation of concerns
// index.js - Entry point only
const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

// app.js - Express app configuration
const express = require('express');
const logsRouter = require('./routes/logs');

const app = express();
app.use(express.json());
app.use('/api/v1/logs', logsRouter);

module.exports = app;

// routes/logs.js - Route definitions
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // handler logic
});

module.exports = router;
```

## Anti-Patterns to Avoid

Current issues:
- ❌ **Hardcoded Configuration** - Port 3000 is hardcoded (use environment variables)
- ❌ **No Input Validation** - Routes accept any input without validation
- ❌ **Magic Values** - Timestamps and data are hardcoded strings

Additional patterns to avoid:
- ❌ **Callback Hell** - Use async/await instead of nested callbacks
- ❌ **Synchronous I/O** - Use async methods for file/network operations
- ❌ **Global State** - Avoid globals, use dependency injection
- ❌ **Broad Error Catching** - `catch (e)` without specific error handling
- ❌ **Mutable Exports** - Export functions/classes, not mutable objects

## Best Practices

### Configuration Management

```javascript
// Use environment variables
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';

// Use dotenv for local development
require('dotenv').config();
```

### Request Validation

```javascript
// Use express-validator or joi
const { body, validationResult } = require('express-validator');

app.post('/logs',
  body('message').notEmpty().trim(),
  body('level').isIn(['info', 'warning', 'error']),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // process valid request
  }
);
```

### Security Headers

```javascript
// Use helmet for security headers
const helmet = require('helmet');
app.use(helmet());
```

## Current Code Quality Issues

- No linting configured (eslint recommended)
- No formatting configured (prettier recommended)
- No pre-commit hooks (husky + lint-staged recommended)
- No code documentation (JSDoc recommended)
- No input validation
- Hardcoded values throughout
- No separation of concerns
- No error boundaries
