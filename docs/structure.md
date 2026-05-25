# Project Structure

**Last updated:** 2026-05-25

## Overview

Flat single-file architecture. The entire application lives in `index.js` at the project root — no src/ directory, no module separation. This is a minimal Express API with one endpoint.

## Directory Layout

```
onprem-api/
├── index.js            # Entire application (server setup + routes)
├── package.json        # npm manifest and scripts
├── package-lock.json   # Locked dependency tree
├── .gitignore          # Standard Node.js gitignore
├── README.md           # Project title only
└── docs/               # Steering documentation (generated)
```

## Module Organization

All code is in a single file (`index.js`):

1. **Express app instantiation** — `const app = express()`
2. **Middleware registration** — `app.use(express.json())`
3. **Route handlers** — inline functions on `app.get(...)`
4. **Server startup** — `app.listen(...)`

No modules, classes, services, or adapters are used.

## File Naming Conventions

- **Source files:** lowercase with no separator (`index.js`) — matches Node.js entry-point convention
- **Config files:** standard ecosystem names (`package.json`, `.gitignore`)

## Import Patterns

- **CommonJS `require`** used throughout (`const express = require('express')`)
- No internal imports — single file, nothing to import between modules

## Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, npm scripts, project metadata |
| `package-lock.json` | Exact resolved dependency tree |
| `.gitignore` | Files excluded from version control |

No `.env` file, no environment-specific config files, no linter/formatter configs.

## Architectural Patterns

- **Monolithic single file** — no layering or separation of concerns
- **Inline route handlers** — business logic embedded directly in route callbacks
- **Static data** — the `/logs` endpoint returns hardcoded fixture data, not live data
- **No middleware stack** — only `express.json()` is registered; no auth, CORS, logging, or error middleware
