# Code Conventions

**Last updated:** 2026-03-13

## Naming Conventions

### Variables and Functions

- **Style:** camelCase
- **Examples:** `port`, `logsData`, `getCurrentLogs()`

```javascript
const port = 3000;
const timestamp = new Date().toISOString();

function formatLogEntry(entry) {
  return { ...entry };
}
```

### Constants

- **Style:** UPPER_SNAKE_CASE
- **Examples:** `DEFAULT_PORT`, `MAX_LOG_ENTRIES`, `API_VERSION`

```javascript
const DEFAULT_PORT = 3000;
const MAX_RETRIES = 3;
const LOG_LEVELS = ['info', 'warning', 'error'];
```

### Files

- **Style:** kebab-case or camelCase
- **Examples:** `index.js`, `logsController.js`, `user-service.js`
- **Current project:** Uses `index.js` (camelCase)

### Classes (when used)

- **Style:** PascalCase
- **Examples:** `LogsController`, `UserService`, `DatabaseConnection`

```javascript
class LogsService {
  constructor(config) {
    this.config = config;
  }

  getLogs() {
    // implementation
  }
}
```

## Code Formatting

### Line Length

- **Maximum:** 100 characters (recommended)
- **Current:** No enforced limit

### Indentation

- **Style:** 2 spaces (standard for JavaScript/Node.js)
- **Current:** Consistent 2-space indentation in `index.js`

### Quotes

- **Style:** Single quotes `'` preferred for strings
- **Current:** Inconsistent (mix of single and double quotes)

```javascript
// Preferred
const message = 'Application started';
const path = '/logs';

// Avoid (unless necessary for embedded quotes)
const message = "Application started";
```

### Semicolons

- **Style:** Always use semicolons (safer, explicit)
- **Current:** Consistent semicolon usage ✓

```javascript
const app = express();
const port = 3000;
```

## Module System

### CommonJS (Current)

```javascript
// Require statements at top of file
const express = require('express');
const app = express();

// Exports at bottom (if needed)
module.exports = app;
```

### ES Modules (Alternative, not used)

If switching to `"type": "module"`:

```javascript
import express from 'express';
const app = express();

export default app;
```

## Async/Await Patterns

**Current state:** Not used (synchronous endpoints)

**When adding async operations:**

```javascript
// Express async route handler
app.get('/logs', async (req, res, next) => {
  try {
    const logs = await fetchLogsFromDatabase();
    res.json(logs);
  } catch (error) {
    next(error); // Pass to error handler middleware
  }
});
```

**Best practices:**
- Always use `try/catch` with async/await
- Pass errors to Express error handler via `next(error)`
- Avoid mixing callbacks and async/await

## Error Handling

### Current Implementation

No explicit error handling - relies on Express default error handler.

### Recommended Patterns

**Centralized error handler middleware:**

```javascript
// Custom error class
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware (add at end of middleware chain)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[ERROR] ${message}`, err.stack);

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  });
});
```

**Usage in routes:**

```javascript
app.get('/logs', (req, res, next) => {
  try {
    const logs = getLogsData();
    if (!logs) {
      throw new ApiError('Logs not found', 404);
    }
    res.json(logs);
  } catch (error) {
    next(error);
  }
});
```

## Logging

### Current Implementation

```javascript
console.log(`API server running at http://localhost:${port}`);
```

### Recommended Pattern (Structured Logging)

Use Winston or Pino for production-grade logging:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

// Usage
logger.info('Server started', { port, environment: process.env.NODE_ENV });
logger.error('Database connection failed', { error: error.message });
```

### Log Levels

- **DEBUG:** Development diagnostics (verbose)
- **INFO:** Normal operations (server started, request completed)
- **WARN:** Unexpected but handled (deprecated API used, high latency)
- **ERROR:** Errors that need attention (database failure, API timeout)

## Comments and Documentation

### When to Comment

**Current state:** Minimal comments (only 2 inline comments in `index.js`)

**✅ Good use of comments:**

```javascript
// Workaround for Express 5.x body parsing issue (see #123)
app.use(express.json({ limit: '10mb' }));

// Performance: cache log data for 5 minutes
const cachedLogs = memoize(fetchLogs, { maxAge: 5 * 60 * 1000 });
```

**❌ Avoid obvious comments:**

```javascript
// Bad: state the obvious
const port = 3000; // Set port to 3000

// Bad: repeat the code
// Parse JSON requests
app.use(express.json());
```

### JSDoc for Functions

**Recommended for exported functions and APIs:**

```javascript
/**
 * Fetch logs from the database
 * @param {Object} options - Query options
 * @param {string} options.level - Log level filter (info, warning, error)
 * @param {number} options.limit - Maximum number of entries to return
 * @returns {Promise<Object>} Log data with entries and metadata
 * @throws {ApiError} If database query fails
 * @example
 * const logs = await fetchLogs({ level: 'error', limit: 10 });
 */
async function fetchLogs({ level, limit = 50 }) {
  // implementation
}
```

## Environment Variables

**Current state:** Not used (hardcoded port 3000)

**Recommended pattern:**

```javascript
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});
```

**`.env.example` template:**

```
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

## Code Organization

### Current Structure

Single file with inline route handlers:

```javascript
app.get('/logs', (req, res) => { /* handler logic */ });
```

### Recommended Structure (when scaling)

**Separate concerns:**

```javascript
// routes/logs.js
const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logsController');

router.get('/', logsController.getLogs);
module.exports = router;

// controllers/logsController.js
exports.getLogs = (req, res, next) => {
  try {
    const logs = { /* static data */ };
    res.json(logs);
  } catch (error) {
    next(error);
  }
};

// index.js
const logsRoutes = require('./routes/logs');
app.use('/logs', logsRoutes);
```

## Anti-Patterns to Avoid

- ❌ **Callback Hell** - Use async/await instead of nested callbacks
- ❌ **Long Functions** - Functions >50 lines should be refactored
- ❌ **Magic Numbers** - Use named constants (`MAX_RETRIES` not `3`)
- ❌ **Hardcoded Configs** - Use environment variables
- ❌ **Broad Exception Catching** - Catch specific errors
- ❌ **Synchronous I/O** - Use async operations for file/network I/O
- ❌ **Ignoring Errors** - Always handle errors (even if just logging)

## Formatting Tools

**Current state:** No linter or formatter configured

**Recommended setup:**

### ESLint (Linting)

```bash
npm install --save-dev eslint
npx eslint --init
```

Recommended config (`.eslintrc.json`):

```json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12
  },
  "rules": {
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-console": "off"
  }
}
```

### Prettier (Formatting)

```bash
npm install --save-dev prettier
```

Config (`.prettierrc`):

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

## Best Practices Summary

- ✅ Use camelCase for variables/functions, PascalCase for classes
- ✅ Always use semicolons
- ✅ Prefer single quotes for strings
- ✅ Use 2-space indentation
- ✅ Keep lines under 100 characters
- ✅ Use async/await for asynchronous operations
- ✅ Implement centralized error handling
- ✅ Use structured logging (Winston/Pino)
- ✅ Document complex functions with JSDoc
- ✅ Use environment variables for configuration
- ✅ Set up ESLint and Prettier for consistency
