# Technology Stack

**Last updated:** 2026-05-25

## Summary

`onprem-api` is a minimal Node.js REST API built with Express 5, providing log-retrieval endpoints for on-premises deployments.

## Languages

- **Primary Language:** JavaScript (CommonJS, Node.js runtime)

## Frameworks

### Backend

- **Main Framework:** Express 5.1+
- **Module System:** CommonJS (`require`/`module.exports`)
- **API Documentation:** None currently configured

## Major Dependencies

### Runtime Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| express | ^5.1.0 | HTTP server and routing |

### Development Dependencies

| Tool | Version | Purpose |
|------|---------|---------|
| (none configured) | — | No dev dependencies declared |

## Build Tools

- **Package Manager:** npm (lockfileVersion 3)
- **Task Runner:** npm scripts
- **Entry Point:** `index.js`

## Development Tools

- **Linter:** None configured
- **Formatter:** None configured
- **Type Checker:** None (plain JavaScript, no TypeScript)
- **Pre-commit Hooks:** None configured

## Runtime Environment

- **Runtime:** Node.js (version not pinned — Express 5 requires Node.js 18+)
- **Default Port:** 3000
- **Container:** Not configured (no Dockerfile present)
- **CI/CD:** Not configured

## External Services

- **Database:** None (log data is static/hardcoded)
- **Cache:** None
- **Message Queue:** None

## Constraints

- Node.js 18+ required (Express 5 drops support for older versions)
- CommonJS module format — `require()` throughout, no ESM `import`
- No `.env` / configuration management currently in place
