# Repository Structure

## Top-Level Layout

```
onprem-api/
├── index.js          # Application entry point; all routes and server bootstrap
├── package.json      # Project manifest, dependency declarations, npm scripts
├── package-lock.json # Locked dependency tree
└── README.md         # Minimal placeholder (title only)
```

## Module Responsibilities

| File | Responsibility |
|------|---------------|
| `index.js` | Bootstraps the Express application, registers middleware, defines all HTTP route handlers, and starts the TCP listener |
| `package.json` | Declares runtime dependency (`express`), defines `start` script, identifies `index.js` as the main entry point |
| `package-lock.json` | Records the exact resolved dependency versions for reproducible installs |

## Architectural Boundaries

The repository is a single-module application. No subdirectories, additional source files, or internal package boundaries were found. All application logic — middleware configuration, route definitions, and server initialisation — resides in `index.js`.

## Dependencies

| Package | Version constraint | Role |
|---------|-------------------|------|
| `express` | `^5.1.0` | HTTP server framework |

No development dependencies are declared in `package.json`.
