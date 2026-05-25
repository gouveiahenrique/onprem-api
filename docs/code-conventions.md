# Code Conventions

**Last updated:** 2026-05-25

## Language and Module System

- **Language:** JavaScript (no TypeScript)
- **Module system:** CommonJS — use `require()` and `module.exports`, not `import`/`export`
- **Runtime:** Node.js — browser APIs (`fetch`, `window`, `document`) are not available

## Naming Conventions

### Variables and Functions

- `camelCase` for all variables and functions
  ```javascript
  const port = 3000;
  const logEntries = [];
  function buildLogResponse() { ... }
  ```

### Constants

- `camelCase` for module-level config (matching current code style)
  ```javascript
  const port = 3000;
  ```
- `UPPER_SNAKE_CASE` for true constants shared across the app (when introduced)
  ```javascript
  const MAX_LOG_ENTRIES = 100;
  ```

### Files

- `kebab-case.js` for new source files (e.g., `log-service.js`, `error-handler.js`)
- `camelCase.js` is acceptable if it matches an existing module name

## Code Formatting

No formatter is currently configured. Follow these rules manually until one is added:

| Rule | Value |
|------|-------|
| Indentation | 2 spaces |
| Quotes | Single quotes `'` for strings |
| Semicolons | Yes, required |
| Max line length | 100 characters |
| Trailing commas | Allowed in multiline objects/arrays |

Example (matches current `index.js` style):
```javascript
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/logs', (req, res) => {
  const logs = {
    timestamp: new Date().toISOString(),
    entries: [],
    count: 0,
    status: 'success',
  };
  res.json(logs);
});
```

## Response Construction

- Always use `res.json()` for JSON responses — do not manually set `Content-Type`
- Always use `res.send()` for plain text responses
- Set HTTP status explicitly when not 200: `res.status(404).json({ error: ... })`

## Error Handling

No custom error handling is currently implemented. When adding error handling:

- Register a 4-argument error middleware **last** in the middleware stack:
  ```javascript
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: { message: 'Internal server error' } });
  });
  ```
- Use `next(err)` to forward errors from async handlers
- For async route handlers, wrap in try/catch and call `next(err)`:
  ```javascript
  app.get('/resource', async (req, res, next) => {
    try {
      const data = await fetchData();
      res.json(data);
    } catch (err) {
      next(err);
    }
  });
  ```

## Async/Await

- Prefer `async/await` over `.then()/.catch()` chains for readability
- Always handle rejections — either with try/catch or by passing to `next(err)`

## Comments

- Avoid comments that restate the code
- Use comments only to explain non-obvious decisions or workarounds
- The current `index.js` inline comments (`// Middleware to parse JSON requests`, `// Define the /logs endpoint`) are acceptable for orientation but not required going forward

## Logging

No structured logging library is configured. Current approach uses `console.log` only for server startup. For production use:

- Avoid `console.log` in request handlers (it has no log levels or structure)
- Prefer a lightweight logger like `pino` when observability is needed

## Configuration

- Hardcoded values like `port = 3000` should be replaced with `process.env.PORT || 3000` to support environment-specific deployment
- Secrets (API keys, DB passwords) must never be hardcoded — use environment variables and keep them out of version control (`.env` is in `.gitignore`)

## Anti-Patterns to Avoid

- **Synchronous blocking calls** in route handlers (`fs.readFileSync`, `JSON.parse` on large input)
- **Unhandled promise rejections** — always await or catch
- **Hardcoded secrets** — use `process.env`
- **Mutating `req`/`res`** outside of dedicated middleware
- **Calling `app.listen()` in tests** — export `app` separately and let the test runner control the lifecycle (see `docs/testing-standards.md`)
