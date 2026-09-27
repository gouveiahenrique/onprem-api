# Repository Structure

## Overview

The repository contains a minimal flat structure with no subdirectories beyond the generated `node_modules` directory (excluded by `.gitignore`).

```
onprem-api/
├── index.js          # Application entry point and sole source file
├── package.json      # NPM package manifest and dependency declarations
├── package-lock.json # Dependency lock file
├── README.md         # Empty placeholder readme
├── .gitignore        # Standard Node.js gitignore
└── .mcp.json         # MCP server configuration (codegraph, cognee)
```

## File Responsibilities

| File | Responsibility |
|---|---|
| `index.js` | Express application initialization, middleware registration, route handlers, server startup |
| `package.json` | Package metadata, script definitions (`start`, `test`), dependency declaration |
| `package-lock.json` | Locked dependency tree for reproducible installs |

## Architectural Boundaries

The entire application logic resides in `index.js`. There are no observed module boundaries, subdirectories for routes/controllers/middleware, or separation of concerns at the file level.

## Dependencies

The sole runtime dependency is `express` (^5.1.0). There are no observed internal modules, shared libraries, or workspace packages.
