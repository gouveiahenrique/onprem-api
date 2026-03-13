# Project Structure

**Last updated:** 2026-03-13

## Overview

Simple single-file Node.js API with minimal architecture. No layered structure or modularization currently implemented. Suitable for small proof-of-concept or demo applications.

## Directory Layout

```
onprem-api/
├── index.js               # Main application file (entry point)
├── package.json           # npm dependencies and scripts
├── package-lock.json      # Dependency lock file
├── .gitignore            # Git ignore patterns
├── .mcp.json             # MCP server configuration
├── .openhands/           # Agent workspace
│   └── microagents/
│       └── repo.md
├── docs/                 # Documentation (steering files)
└── README.md             # Project readme
```

## Current Architecture

**Monolithic Single-File Architecture**

All application logic resides in `index.js`:
- Express app initialization
- Middleware configuration
- Route definitions
- Server startup

## Module Organization

**Not applicable** - Single-file application with no module structure.

### Recommended Structure (for future scaling)

If the project grows beyond a simple demo, consider this structure:

```
onprem-api/
├── src/
│   ├── index.js           # Entry point
│   ├── app.js             # Express app configuration
│   ├── routes/            # Route handlers
│   │   └── logs.js
│   ├── controllers/       # Business logic
│   │   └── logsController.js
│   ├── middleware/        # Custom middleware
│   │   └── errorHandler.js
│   ├── config/            # Configuration
│   │   └── index.js
│   └── utils/             # Utility functions
├── tests/                 # Test suite
│   ├── unit/
│   └── integration/
├── docs/                  # Documentation
└── package.json
```

## File Naming Conventions

- **JavaScript files:** camelCase (`index.js`, `logsController.js`)
- **Config files:** kebab-case (`.gitignore`, `package.json`)
- **Documentation:** kebab-case (`README.md`, `api-standards.md`)

## Import Patterns

- **CommonJS used:** `require()` for imports, `module.exports` for exports
- **No ES modules:** `"type": "commonjs"` in package.json
- **No relative/absolute distinction:** Single-file app has no imports

## Configuration Files

- **Root:** `package.json` (dependencies, scripts, metadata)
- **Environment:** Not configured (no `.env` file)
- **Git:** `.gitignore` (Node.js standard patterns)
- **MCP:** `.mcp.json` (MCP server configuration for agents)

## Architectural Patterns

**Current:**
- None (procedural single-file script)

**Recommended for scaling:**
- **MVC Pattern** - Separate routes, controllers, models
- **Middleware Chain** - Authentication, validation, error handling
- **Dependency Injection** - Pass config/services to modules
- **Environment-based Config** - Use `dotenv` for different environments

## Code Organization

### Current Route Structure

```javascript
app.get('/', handler)       // Welcome message
app.get('/logs', handler)   // Static logs endpoint
```

### Recommended Improvements

1. **Extract routes** - Move to `src/routes/logs.js`
2. **Extract controllers** - Business logic in `src/controllers/`
3. **Add middleware** - Error handling, request logging, validation
4. **Add config module** - Centralize port, environment settings
5. **Add tests directory** - Unit and integration tests
