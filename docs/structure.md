# Repository Structure

## Top-Level Layout

```
onprem-api/
├── index.js           # Application entry point — HTTP server, middleware, routes
├── package.json       # Project metadata, dependency declarations, npm scripts
├── package-lock.json  # Dependency lock file (npm)
├── README.md          # Minimal project readme (title only)
├── .gitignore         # Standard Node.js gitignore
└── .openhands/
    └── microagents/
        └── repo.md    # Repository description for OpenHands agent tooling
```

## Module Responsibilities

### `index.js`

The sole application module. It:

1. Requires and initialises Express (`express()`).
2. Registers the `express.json()` body-parsing middleware.
3. Defines the `GET /logs` route handler that returns a static JSON log payload.
4. Defines the `GET /` route handler that returns a welcome string.
5. Starts the HTTP listener on port 3000.

There are no sub-modules, routers, controllers, service layers, or utility files in the repository.

### `package.json`

Declares:
- Package name: `onprem-api`
- Version: `1.0.0`
- Module system: `commonjs`
- Single runtime dependency: `express ^5.1.0`
- Scripts: `start` (`node index.js`), `test` (placeholder — exits with error)

## Architectural Boundaries

The repository contains a single architectural boundary: the HTTP server process. No database layer, external service client, authentication middleware, or secondary process boundary was found in the inspected codebase.
