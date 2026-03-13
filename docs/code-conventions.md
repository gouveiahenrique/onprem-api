# Code Conventions

**Last updated:** 2026-03-13

## Naming Conventions

### Variables and Functions

- **JavaScript:** `camelCase`

```javascript
// Variables
const userName = 'John';
const logEntries = [];
const maxRetries = 3;

// Functions
function getUserName() { }
function calculateTotal() { }
function fetchLogsFromDatabase() { }
```

### Classes and Constructors

- **JavaScript:** `PascalCase`

```javascript
class UserService { }
class LogsController { }
class DatabaseConnection { }
```

### Constants

- **All Languages:** `UPPER_SNAKE_CASE`

```javascript
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_PORT = 3000;
const LOG_LEVELS = ['info', 'warning', 'error', 'debug'];
```

### Files

- **JavaScript:** `camelCase.js` (or `kebab-case.js` for multi-word)

```
logsController.js
userService.js
database-connection.js  // kebab-case acceptable
logs-routes.js
```

### Test Files

- **Pattern:** `*.test.js` or `*.spec.js`

```
logsController.test.js
userService.spec.js
logs.integration.test.js
```

## Code Formatting

### Line Length

- **Maximum:** 100 characters (preferred), 120 characters (acceptable)
- **Reason:** Readable on modern displays, works in split-screen

### Indentation

- **JavaScript:** 2 spaces (Node.js community standard)

```javascript
function example() {
  if (condition) {
    doSomething();
  }
}
```

### Quotes

- **JavaScript:** Single quotes `'` preferred for strings
- **Exception:** Use backticks `` ` `` for template literals
- **Exception:** Use double quotes `"` in JSON

```javascript
const name = 'John';  // Preferred
const greeting = `Hello, ${name}`;  // Template literals
const json = '{"key": "value"}';  // JSON string
```

### Semicolons

- **JavaScript:** Use semicolons (explicit ASI)

```javascript
const x = 5;
const y = 10;
```

### Trailing Commas

- **JavaScript:** Use trailing commas in multi-line arrays/objects

```javascript
const logs = [
  'log1',
  'log2',
  'log3',  // Trailing comma
];

const config = {
  port: 3000,
  host: 'localhost',  // Trailing comma
};
```

## Current Code Style Analysis

Based on `index.js`:

```javascript
// ✅ Good: Const declarations
const express = require('express');
const app = express();
const port = 3000;

// ✅ Good: Arrow functions for route handlers
app.get('/logs', (req, res) => { });

// ✅ Good: Object literal formatting
const logs = {
  timestamp: new Date().toISOString(),
  entries: [ ],
  count: 5,
  status: 'success'
};

// ⚠️ Issue: Hardcoded port (should use environment variable)
const port = 3000;  // Should be: process.env.PORT || 3000

// ⚠️ Issue: No error handling for async operations
```

## Async/Await Patterns

### Current Implementation

No async operations in current code.

### Recommended Patterns

```javascript
// Always use async/await for I/O operations
async function fetchUserLogs(userId) {
  try {
    const response = await fetch(`/api/users/${userId}/logs`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch logs:', error);
    throw error;
  }
}

// Use Promise.all for parallel operations
async function fetchMultipleLogs(userIds) {
  const promises = userIds.map(id => fetchUserLogs(id));
  const results = await Promise.all(promises);
  return results;
}
```

## Error Handling

### Current Implementation

No explicit error handling.

### Recommended Custom Error Classes

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.field = field;
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.resource = resource;
    this.id = id;
  }
}
```

### Try-Catch Structure

```javascript
// Route handler with error handling
app.get('/logs/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validation
    if (!id) {
      throw new ValidationError('ID is required', 'id');
    }

    // Business logic
    const log = await logsService.findById(id);

    if (!log) {
      throw new NotFoundError('Log', id);
    }

    res.json({ success: true, data: log });
  } catch (error) {
    next(error);  // Pass to error handling middleware
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      name: err.name,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});
```

## Logging

### Current Implementation

```javascript
console.log(`API server running at http://localhost:${port}`);
```

### Recommended Structured Logging

```javascript
// Use a logging library (winston, pino, or bunyan)
const logger = require('./config/logger');

logger.info('server_started', {
  port: port,
  environment: process.env.NODE_ENV,
  timestamp: new Date().toISOString()
});

logger.error('database_connection_failed', {
  error: error.message,
  stack: error.stack,
  timestamp: new Date().toISOString()
});
```

### Log Levels

- **DEBUG:** Detailed diagnostic info (development only)
- **INFO:** Normal operation events (server started, request received)
- **WARN:** Unexpected but handled (validation failed, retry attempt)
- **ERROR:** Error occurred but system continues (API call failed)
- **FATAL:** System failure (cannot continue)

```javascript
// Log level usage
logger.debug('request_details', { method: req.method, url: req.url });
logger.info('user_created', { userId: user.id });
logger.warn('rate_limit_approaching', { remaining: 5 });
logger.error('payment_failed', { error: err.message });
logger.fatal('database_unavailable', { error: err.message });
```

## Comments and Docstrings

### When to Comment

- ✅ Complex algorithms (explain "why", not "what")
- ✅ Non-obvious business logic
- ✅ Workarounds for bugs (link to issue)
- ✅ API documentation (JSDoc)
- ❌ Self-evident code

### JSDoc for Functions

```javascript
/**
 * Fetches log entries for a specific user
 *
 * @param {string} userId - The user's unique identifier
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of logs to return
 * @param {string} options.level - Filter by log level (info, warning, error)
 * @returns {Promise<Array<Object>>} Array of log entries
 * @throws {NotFoundError} When user doesn't exist
 *
 * @example
 * const logs = await getUserLogs('user123', { limit: 10, level: 'error' });
 */
async function getUserLogs(userId, options = {}) {
  // Implementation
}
```

### Inline Comments

```javascript
// Good: Explains WHY
// Use port 3000 as default for local development compatibility
const port = process.env.PORT || 3000;

// Bad: Explains WHAT (already obvious)
// Set port to 3000
const port = 3000;

// Good: Explains workaround
// HACK: Express 5.x has a bug with async error handling
// See: https://github.com/expressjs/express/issues/1234
app.use((err, req, res, next) => {
  // Workaround code
});
```

## Module Exports

### CommonJS (Current)

```javascript
// Single export
module.exports = app;

// Multiple exports
module.exports = {
  getUserLogs,
  createLog,
  deleteLog
};

// Named exports (alternative)
exports.getUserLogs = getUserLogs;
exports.createLog = createLog;
```

### ES6 Modules (If migrating)

```javascript
// Named exports
export function getUserLogs() { }
export function createLog() { }

// Default export
export default app;

// Import
import app from './app.js';
import { getUserLogs, createLog } from './logs.js';
```

## Anti-Patterns to Avoid

### ❌ God Objects/Classes

```javascript
// Bad: Single class doing too much
class ApplicationManager {
  handleRequests() { }
  connectDatabase() { }
  sendEmails() { }
  processPayments() { }
  generateReports() { }
}

// Good: Separate responsibilities
class RequestHandler { }
class DatabaseConnection { }
class EmailService { }
class PaymentProcessor { }
class ReportGenerator { }
```

### ❌ Long Functions

```javascript
// Bad: Function >50 lines
function processUser() {
  // 100 lines of code
}

// Good: Extract smaller functions
function processUser() {
  validateUser();
  enrichUserData();
  saveToDatabase();
  sendNotification();
}
```

### ❌ Magic Numbers

```javascript
// Bad
if (retries < 3) { }

// Good
const MAX_RETRIES = 3;
if (retries < MAX_RETRIES) { }
```

### ❌ Callback Hell

```javascript
// Bad: Nested callbacks
getData(function(data) {
  processData(data, function(result) {
    saveResult(result, function(response) {
      sendNotification(response, function(status) {
        // ...
      });
    });
  });
});

// Good: Use async/await
async function handleData() {
  const data = await getData();
  const result = await processData(data);
  const response = await saveResult(result);
  const status = await sendNotification(response);
}
```

### ❌ Mutating Function Parameters

```javascript
// Bad
function addLog(logs, newLog) {
  logs.push(newLog);  // Mutates input
  return logs;
}

// Good
function addLog(logs, newLog) {
  return [...logs, newLog];  // Returns new array
}
```

### ❌ Broad Exception Catching

```javascript
// Bad
try {
  // code
} catch (error) {
  // Catches ALL errors, even unexpected ones
}

// Good
try {
  // code
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors
  } else if (error instanceof NotFoundError) {
    // Handle not found
  } else {
    throw error;  // Re-throw unexpected errors
  }
}
```

## Recommended Linter Configuration

### ESLint (.eslintrc.json)

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
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "arrow-spacing": "error",
    "comma-dangle": ["error", "always-multiline"]
  }
}
```

### Prettier (.prettierrc)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```
