# Project Structure

**Last updated:** 2026-03-13

## Overview

Single-file monolithic architecture. All application logic is contained in `index.js`. This pattern is suitable for small APIs and prototypes but should be refactored for production use.

## Directory Layout

```
onprem-api/
├── index.js               # Main application file (server, routes, logic)
├── package.json           # Node.js dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── .gitignore            # Git ignore patterns
├── .mcp.json             # MCP configuration
├── README.md             # Project documentation
├── .openhands/           # Openhands configuration
│   └── microagents/
│       └── repo.md
└── docs/                 # Documentation (steering files)
```

## Module Organization

Currently no modular organization - all code in single file:

```javascript
// index.js structure:
// 1. Imports (require statements)
// 2. App initialization (express())
// 3. Middleware (express.json())
// 4. Route handlers (GET /logs, GET /)
// 5. Server startup (app.listen())
```

### Recommended Future Structure

For production or larger APIs, consider:

```
src/
├── index.js              # Entry point
├── config/               # Configuration management
│   └── environment.js
├── routes/               # Route definitions
│   └── logs.js
├── controllers/          # Business logic
│   └── logsController.js
├── middleware/           # Custom middleware
│   └── errorHandler.js
└── utils/                # Utility functions
    └── logger.js
tests/
├── unit/                 # Unit tests
└── integration/          # API integration tests
```

## File Naming Conventions

- **JavaScript:** camelCase for files (`logsController.js`)
- **Config files:** lowercase with hyphens (`.gitignore`, `package.json`)
- **Documentation:** UPPERCASE or lowercase (`README.md`, `docs/tech.md`)

## Import Patterns

- **CommonJS:** `require()` and `module.exports`
- **No ES6 Modules:** Package.json specifies `"type": "commonjs"`
- **Relative imports:** Not applicable (single file)

## Configuration Files

- **Root:** `package.json` (dependencies, scripts, metadata)
- **Git:** `.gitignore` (standard Node.js patterns)
- **MCP:** `.mcp.json` (MCP server configuration)
- **Environment:** `.env` patterns in `.gitignore` (not yet implemented)

## Architectural Patterns

- **Monolithic:** Single file contains all logic
- **No Dependency Injection:** Direct instantiation
- **Synchronous:** No async/await patterns (static data)
- **No Error Handling:** Relies on Express default error handlers
- **No Logging:** Uses console.log only

## Current Limitations

- No separation of concerns (routes, controllers, models mixed)
- No test structure
- No configuration management (hardcoded port 3000)
- No environment-based config (.env support)
- No middleware organization
- No input validation
