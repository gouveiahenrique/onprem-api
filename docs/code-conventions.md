# Code Conventions

## Module System

The repository uses CommonJS modules (`"type": "commonjs"` in `package.json`). Dependencies are loaded with `require()`.

## File Organization

The entire application is contained in a single file: `index.js`. No sub-directory structure for source code exists in the repository.

## Naming Conventions

| Artifact             | Convention observed                            | Example                    |
|----------------------|------------------------------------------------|----------------------------|
| Variables            | `camelCase`                                    | `app`, `port`, `logs`      |
| Constants            | `camelCase` (no `UPPER_SNAKE_CASE` observed)   | `port = 3000`              |
| Route path strings   | lowercase, hyphen-separated (kebab)            | `/logs`                    |

## Coding Patterns

### Route definition

Routes are defined inline in `index.js` using the Express `app.get(path, handler)` pattern. No router modules or controller files are used.

### Response serialization

- JSON responses: `res.json(object)` — sets `Content-Type: application/json` automatically.
- Plain-text responses: `res.send(string)`.

### Port configuration

The server port (`3000`) is hardcoded as a numeric literal. No environment variable (`process.env.PORT`) or configuration file is used for port binding.

## Linting and Formatting

No linter (ESLint, Biome, etc.) or formatter (Prettier) configuration files were found in the repository. No `lint` npm script is defined in `package.json`.
