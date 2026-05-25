# Technology Stack

**Last updated:** 2026-05-25

## Summary

`onprem-api` is a minimal Node.js REST API built with Express 5, exposing a single `/logs` endpoint that returns structured log entries as JSON.

## Languages

- **Primary Language:** JavaScript (CommonJS, Node.js runtime)
- **Secondary Languages:** None

## Frameworks

### Backend

- **Main Framework:** Express 5.1.0 — HTTP server and routing
- **API Documentation:** None configured (OpenAPI/Swagger not present)

## Major Dependencies

### Runtime Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| express | ^5.1.0 | HTTP server framework and routing |

Express 5 transitively bundles:
| Library | Version | Purpose |
|---------|---------|---------|
| body-parser | 2.2.0 | JSON/URL-encoded body parsing |
| accepts | 2.0.0 | Content negotiation |
| mime-types | 3.0.0 | MIME type resolution |

### Development Dependencies

None defined — no test runner, linter, or formatter is currently configured.

## Build Tools

- **Package Manager:** npm (package-lock.json lockfileVersion 3)
- **Task Runner:** npm scripts (`npm start` → `node index.js`)
- **Bundler:** None (plain Node.js, no transpilation)

## Development Tools

- **Linter:** None configured
- **Formatter:** None configured
- **Type Checker:** None (plain JavaScript, no TypeScript or JSDoc types)
- **Pre-commit Hooks:** None

## Runtime Environment

- **Entry Point:** `index.js`
- **Default Port:** 3000 (hardcoded)
- **Module System:** CommonJS (`require`/`module.exports`)
- **Container:** Not configured (no Dockerfile or docker-compose)
- **CI/CD:** Not configured

## External Services

- **Database:** None
- **Cache:** None
- **Message Queue:** None
- **Object Storage:** None

## Constraints

- Node.js version compatible with Express 5 required (Node.js 18+ recommended per Express 5 docs)
- CommonJS only — no ESM (`import`/`export`) syntax
- Port 3000 is hardcoded; no environment variable override currently wired up
