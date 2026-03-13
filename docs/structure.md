# Project Structure

**Last updated:** 2026-03-13

## Overview

Single-file application architecture with minimal structure. All API logic, routing, and middleware are consolidated in one entry point file.

## Directory Layout

```
project-root/
├── index.js               # Main application file (API endpoints, middleware, server)
├── package.json           # Project metadata and dependencies
├── package-lock.json      # Dependency lock file
├── README.md              # Project readme
├── docs/                  # Documentation (steering files)
├── .gitignore             # Git ignore rules
├── .openhands/            # Agent configuration
│   └── microagents/       # Microagent specifications
│       └── repo.md        # Project description
└── .mcp.json              # MCP server configuration
```

## Module Organization

### Single-File Structure (`index.js`)

The application follows a simple linear structure:
1. **Dependencies** - Require statements (express)
2. **App Initialization** - Express app setup
3. **Middleware** - JSON body parser
4. **Route Definitions** - API endpoints (GET /logs, GET /)
5. **Server Start** - Listen on port 3000

**No separation of concerns** - All logic (routing, controllers, data) is in one file.

## File Naming Conventions

- **JavaScript Files:** kebab-case (`index.js`)
- **Documentation:** kebab-case with extensions (`.md`, `.json`)
- **Config Files:** Lowercase with dots (`.gitignore`, `.mcp.json`)

## Import Patterns

- **CommonJS require:** `const express = require('express');`
- **No ES6 imports** (configured as CommonJS in package.json)
- **No internal modules** (single-file application)

## Configuration Files

- **Root:** `package.json`, `package-lock.json` (npm dependencies)
- **Environment:** No `.env` file (port hardcoded to 3000)
- **Git:** `.gitignore` (standard Node.js gitignore)
- **MCP:** `.mcp.json` (Model Context Protocol server config)

## Architectural Patterns

### Current State

- **No Separation of Concerns** - Single monolithic file
- **No Dependency Injection** - Direct instantiation only
- **No Error Handling** - No try-catch blocks or error middleware
- **Synchronous Code** - No async/await (static data only)
- **No Routing Layers** - Routes defined directly on app object

### Potential Improvements (if project grows)

- Separate routes into `routes/` directory
- Extract controllers to `controllers/` directory
- Add services layer for business logic
- Implement error handling middleware
- Add configuration management (dotenv)
- Organize as:
  ```
  src/
  ├── routes/        # Route definitions
  ├── controllers/   # Request handlers
  ├── services/      # Business logic
  ├── middleware/    # Custom middleware
  └── config/        # Configuration
  tests/
  ├── unit/          # Unit tests
  └── integration/   # Integration tests
  ```
