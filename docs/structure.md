# Project Structure

**Last updated:** 2026-05-25

## Overview

Flat single-file layout. All application logic lives in `index.js` at the project root. No src/ directory or module hierarchy — this is a minimal API with a single entry point.

## Directory Layout

```
onprem-api/
├── index.js               # Entry point — Express app, routes, server startup
├── package.json           # Manifest and npm scripts
├── package-lock.json      # Locked dependency tree
├── README.md              # Project description (minimal)
├── .gitignore             # Standard Node.js ignore patterns
└── docs/                  # Steering documentation
```

## Module Organization

All code is in a single file (`index.js`):

- **Middleware setup** — `express.json()` body parsing
- **Route handlers** — inline handler functions on the app instance
- **Server startup** — `app.listen()` at module bottom

## File Naming Conventions

- **JavaScript:** `camelCase` or `kebab-case` (only one file currently)
- **Module format:** CommonJS (`require`/`module.exports`)

## Import Patterns

- **Relative imports:** Not applicable at current scale
- **Third-party imports:** `require('express')` at top of file
- **No barrel files or index modules** — single-file project

## Configuration Files

- **Root:** `package.json` (dependencies, scripts, metadata)
- **Lock:** `package-lock.json` (reproducible installs)
- **Ignore:** `.gitignore` (standard Node.js patterns)
- **No `.env.example`** — port is hardcoded (`3000`)

## Architectural Patterns

- **Flat / monolith:** No layering, no dependency injection
- **Inline handlers:** Route logic defined directly in `app.get()` callbacks
- **Static data:** Log entries are hardcoded in the handler; no persistence layer
