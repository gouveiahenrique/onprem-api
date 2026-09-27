# Code Conventions

## Language and Module System

- JavaScript with Node.js CommonJS modules (`require` / `module.exports`).
- `"type": "commonjs"` is explicitly declared in `package.json`.

## File Organisation

- All application logic is contained in a single file (`index.js`).
- No subdirectory structure or module separation was observed.

## Naming Conventions

| Element | Convention observed | Example |
|---------|-------------------|---------|
| Variables | `camelCase` | `app`, `port`, `logs` |
| Constants | `camelCase` (not `UPPER_SNAKE_CASE`) | `port`, `app` |
| Route paths | lowercase with leading slash | `/logs`, `/` |

## Application Bootstrap Pattern

The observed pattern in `index.js`:

1. Require framework and instantiate application (`const app = express()`).
2. Register global middleware.
3. Define route handlers inline as arrow functions.
4. Call `app.listen()` at the end of the file.

## Route Handler Pattern

Route handlers are registered inline using arrow function callbacks:

```js
app.get('/path', (req, res) => {
  // ...
  res.json(payload);
});
```

## Response Pattern

- JSON responses use `res.json(object)`.
- Plain-text responses use `res.send(string)`.

## Linting and Formatting

No linter (ESLint, Biome, etc.) or formatter (Prettier) configuration was found in the repository.

## Comments

Inline comments are used sparingly to describe intent at block level (e.g., `// Middleware to parse JSON requests`, `// Define the /logs endpoint`).
