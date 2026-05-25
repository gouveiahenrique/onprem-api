# Code Conventions

**Last updated:** 2026-05-25

## Naming Conventions

### Variables and Functions

- **Style:** `camelCase`
- **Examples:** `const port = 3000`, `app.get('/logs', (req, res) => {...})`

### Constants

- **Style:** `camelCase` for module-level bindings (current practice)
- **Recommended for true constants:** `UPPER_SNAKE_CASE` (e.g., `const PORT = 3000`)

### Files

- **Style:** `kebab-case.js` (e.g., `index.js`, `log-handler.js`)

## Module System

- **Format:** CommonJS (`require` / `module.exports`)
- **No ESM** (`import`/`export`) — `"type": "commonjs"` in `package.json`
- All `require()` calls go at the top of the file

## Code Formatting

### Indentation

- **2 spaces** (as used in `index.js`)

### Quotes

- **Single quotes** `'` for strings (as used in `index.js`)

### Line Length

- **Soft limit:** 100 characters

### Semicolons

- **Required** at end of statements (as used in `index.js`)

## Async Patterns

- Current code is synchronous (static data, no I/O)
- For any future async work: use `async`/`await` over raw Promise chains
- Wrap async route handlers to propagate errors to Express error middleware:

```javascript
// Preferred pattern for async handlers
app.get('/resource', async (req, res, next) => {
  try {
    const data = await fetchSomething();
    res.json({ data });
  } catch (err) {
    next(err);
  }
});
```

## Error Handling

### Current

No error handling beyond Express defaults.

### Recommended

Add a centralised error handler after all routes:

```javascript
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } });
});
```

## Logging

### Current

`console.log` only (server startup message).

### Recommended

Use `console.error` for errors, `console.warn` for warnings, `console.info` for operational events. For structured logging at scale, adopt a library such as `pino`.

Log levels to follow:
- **info** — normal operation events
- **warn** — unexpected but handled situations
- **error** — errors requiring attention

## Comments

- Only add comments when the WHY is non-obvious
- Do not comment self-evident code
- Example of acceptable comment:

```javascript
// Express 5 no longer wraps async errors automatically in some edge cases
app.use(async (req, res, next) => { ... });
```

## Anti-Patterns to Avoid

- ❌ **Hardcoded port without env fallback** — use `process.env.PORT || 3000`
- ❌ **Hardcoded data in route handlers** — extract to a data layer or config when data grows
- ❌ **No error middleware** — always add a catch-all error handler
- ❌ **`var` declarations** — use `const` (preferred) or `let`
- ❌ **Broad `catch` swallowing errors** — always log or rethrow
