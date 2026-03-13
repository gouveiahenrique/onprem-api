# Project Structure

**Last updated:** 2026-03-13

## Overview

Single-file Node.js application with minimal structure. Currently uses a monolithic architecture with all code in one file.

**Architectural Pattern:** Monolithic (single file)

**Recommended Evolution:** Modular structure with separation of concerns (routes, controllers, services, middleware).

## Directory Layout

```
project-root/
├── index.js              # Main application file (routes + server)
├── package.json          # Node.js dependencies and scripts
├── package-lock.json     # Locked dependency versions
├── .gitignore           # Git ignore patterns
├── .mcp.json            # MCP server configuration
├── README.md            # Project documentation
└── docs/                # Documentation (steering files)
    ├── tech.md
    ├── structure.md
    ├── api-standards.md
    ├── testing-standards.md
    └── code-conventions.md
```

## Current Structure Analysis

### Single File Application (index.js)

The entire application currently resides in `index.js`:
- Express app initialization
- Middleware configuration
- Route definitions (/logs, /)
- Server startup logic

**Lines of Code:** ~36 lines

## Recommended Modular Structure

For scalability, consider this structure:

```
project-root/
├── src/
│   ├── routes/           # Route definitions
│   │   └── logs.js
│   ├── controllers/      # Request handlers
│   │   └── logsController.js
│   ├── middleware/       # Custom middleware
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── config/          # Configuration
│   │   └── index.js
│   └── app.js           # Express app setup
├── tests/               # Test suite
│   ├── unit/
│   └── integration/
├── index.js             # Entry point (starts server)
├── .env.example         # Environment variables template
└── package.json
```

## File Naming Conventions

- **JavaScript Files:** camelCase (`logsController.js`, `errorHandler.js`)
- **Test Files:** `*.test.js` or `*.spec.js` pattern
- **Config Files:** lowercase with dash (`package.json`, `.env.example`)

## Module Organization (Recommended)

### Routes (`src/routes/`)

Define API endpoints and map to controllers:
```javascript
const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logsController');

router.get('/logs', logsController.getLogs);

module.exports = router;
```

### Controllers (`src/controllers/`)

Handle request/response logic:
```javascript
exports.getLogs = (req, res) => {
  // Business logic here
  res.json(data);
};
```

### Middleware (`src/middleware/`)

- Error handling middleware
- Request logging
- Authentication/authorization
- Request validation

### Configuration (`src/config/`)

- Environment variables loading
- Database configuration
- External service configuration

## Import Patterns

- **Require syntax:** CommonJS `require()` (not ES6 imports)
- **Relative imports:** Use relative paths (`../controllers/logsController`)
- **No circular dependencies:** Avoid circular require() calls

## Configuration Files

- **Root:** `package.json` (dependencies, scripts)
- **Environment:** `.env` (not committed), `.env.example` (template)
- **Linting:** `.eslintrc.json` (recommended to add)
- **Testing:** `jest.config.js` or `mocha.opts` (recommended to add)
- **Git:** `.gitignore` (comprehensive Node.js patterns)

## Entry Point

- **Main file:** `index.js` (defined in package.json)
- **Server startup:** `app.listen()` in index.js
- **Port configuration:** Currently hardcoded (3000), should use environment variable

## Architectural Patterns (Recommendations)

- **Separation of Concerns:** Split routes, controllers, services
- **Middleware Chain:** Error handling, logging, validation
- **Dependency Injection:** Pass dependencies to controllers
- **Configuration Management:** Environment-based configuration
- **Error Handling:** Centralized error middleware
