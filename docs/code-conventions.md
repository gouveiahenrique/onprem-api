# Code Conventions

**Last updated:** 2026-03-13

## Naming Conventions

### Variables and Functions

- **Style:** `camelCase`
- **Examples:**
  - `const app = express();`
  - `const port = 3000;`
  - Function parameters: `(req, res) => { ... }`

### Constants

- **Style:** `UPPER_SNAKE_CASE` (not used in current code, but recommended)
- **Examples:**
  - `const PORT = process.env.PORT || 3000;`
  - `const LOG_LEVELS = ['info', 'warning', 'error'];`

### Files

- **JavaScript:** `kebab-case.js` (`index.js`)
- **Config Files:** Lowercase with dots (`.gitignore`, `.mcp.json`)
- **Documentation:** `kebab-case.md` (`README.md`)

## Code Formatting

### Line Length

- **No enforced limit** (linter not configured)
- **Observed:** Lines stay under 100 characters naturally
- **Recommended:** Max 100-120 characters

### Indentation

- **Current:** 2 spaces (consistent throughout index.js)
- **No tabs used**

### Quotes

- **Current:** Single quotes `'` preferred
- **Examples:**
  - `const express = require('express');`
  - `res.send('Welcome to the API!');`
- **Exception:** JSON data uses double quotes (JSON spec)

### Semicolons

- **Current:** Semicolons used consistently
- **Style:** Always use semicolons at end of statements

### Spacing

- **Function calls:** No space before parentheses
  - `app.listen(port, () => { ... })`
- **Control flow:** Space after keywords
  - (Not yet present in code)
- **Object literals:** Space after colons
  - `{ level: 'info', message: 'text' }`

## Type Hints and Annotations

**Not used.** The project uses vanilla JavaScript without:
- TypeScript type annotations
- JSDoc type comments

**Recommended JSDoc** (for documentation):
```javascript
/**
 * Get log entries
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {void}
 */
app.get('/logs', (req, res) => {
  // implementation
});
```

## Async/Await Patterns

**Not currently used.** The application is synchronous:
- No database calls
- No external HTTP requests
- Static data only

**Recommended for future async operations:**
```javascript
app.get('/logs', async (req, res) => {
  try {
    const logs = await fetchLogsFromDatabase();
    res.json(logs);
  } catch (error) {
    res.status(500).json({
      error: {
        message: 'Failed to fetch logs',
        details: error.message
      }
    });
  }
});
```

## Error Handling

**Current state:** No error handling implemented.

**Recommended patterns:**

### Try-Catch for Async Operations

```javascript
app.get('/logs', async (req, res) => {
  try {
    const logs = await someAsyncOperation();
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Error Middleware

```javascript
// 404 handler (place after all routes)
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

// Error handler (must have 4 parameters)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});
```

## Logging

### Current Logging

- **Method:** `console.log()` on server start
- **Format:** Plain text message
- **Example:** `console.log('API server running at http://localhost:${port}');`

### Recommended Logging

For production applications, use structured logging:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// In development, also log to console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Usage
logger.info('Server started', { port: 3000 });
logger.error('Database connection failed', { error: err.message });
```

### Log Levels (Recommended)

- **DEBUG:** Detailed diagnostic info (development only)
- **INFO:** Normal operation events (server started, request received)
- **WARN:** Unexpected but handled (deprecated endpoint used)
- **ERROR:** Error occurred but system continues (external API failed)
- **CRITICAL:** System failure (cannot start server)

## Comments and Docstrings

### Current Style

- **Inline comments:** Short, descriptive
- **Examples:**
  - `// Middleware to parse JSON requests`
  - `// Define the /logs endpoint`
  - `// Start the server`

### When to Comment

- ✅ Purpose of middleware
- ✅ Endpoint descriptions
- ✅ Complex business logic (when added)
- ✅ Workarounds or non-obvious code
- ❌ Self-evident code (`i++; // increment i`)
- ❌ Redundant comments (`const port = 3000; // port is 3000`)

### Recommended JSDoc

```javascript
/**
 * API endpoint to retrieve system logs
 * Returns static log entries with different severity levels
 * @route GET /logs
 * @returns {Object} JSON object with timestamp, entries array, count, and status
 */
app.get('/logs', (req, res) => {
  // implementation
});
```

## Module Exports

**Current:** No exports (index.js runs directly)

**Recommended for testability:**
```javascript
// At end of index.js
module.exports = app;

// Create bin/server.js for starting server
const app = require('./index');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

## Environment Variables

**Not currently used.** Port is hardcoded to `3000`.

**Recommended pattern:**
```javascript
require('dotenv').config(); // Load .env file

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
```

Create `.env.example`:
```
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
```

## Anti-Patterns to Avoid

- ❌ **Hardcoded values** - Use environment variables for config
  - Current: `const port = 3000;` (hardcoded)
  - Better: `const port = process.env.PORT || 3000;`

- ❌ **No error handling** - Always handle errors
  - Current: No try-catch or error middleware
  - Better: Add error handling middleware

- ❌ **Server start in main file** - Separates concerns
  - Current: `app.listen()` in index.js
  - Better: Export app, start server in separate file

- ❌ **No input validation** - Validate all inputs
  - Future: When adding POST/PUT, validate request body

- ❌ **Magic numbers** - Use named constants
  - `const MAX_LOG_ENTRIES = 5;` instead of hardcoded `5`

- ❌ **Synchronous file operations** - Use async versions
  - `fs.readFileSync()` → `fs.promises.readFile()`

## Code Organization Recommendations

For future growth, consider:

1. **Separate routes** - `routes/logs.js`, `routes/index.js`
2. **Controllers layer** - `controllers/logsController.js`
3. **Services layer** - `services/logService.js`
4. **Middleware** - `middleware/errorHandler.js`, `middleware/validation.js`
5. **Config** - `config/index.js` (centralized configuration)
6. **Constants** - `constants/logLevels.js`

**Example refactored structure:**
```
src/
├── app.js              # Express app setup
├── routes/
│   ├── index.js       # Root routes
│   └── logs.js        # Logs routes
├── controllers/
│   └── logsController.js
├── services/
│   └── logService.js
├── middleware/
│   ├── errorHandler.js
│   └── validation.js
├── config/
│   └── index.js
└── constants/
    └── logLevels.js
bin/
└── server.js          # Server startup
```
