# Technology Stack

**Last updated:** 2026-03-13

## Summary

A lightweight Node.js REST API built with Express.js that serves static log data through HTTP endpoints.

## Languages

- **Primary Language:** JavaScript (Node.js)
- **Node.js Version:** Compatible with Node.js 14+ (CommonJS module system)

## Frameworks

### Backend

- **Main Framework:** Express.js 5.1.0
- **Module System:** CommonJS (require/module.exports)
- **API Documentation:** None currently implemented

## Major Dependencies

### Runtime Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| express | ^5.1.0 | Web framework for REST API |

### Development Dependencies

None currently configured.

## Build Tools

- **Package Manager:** npm (using package-lock.json)
- **Task Runner:** npm scripts
  - `npm start` - Start the server
  - `npm test` - Test command (not yet implemented)

## Development Tools

- **Linter:** Not configured
- **Formatter:** Not configured
- **Type Checker:** Not configured (vanilla JavaScript)
- **Pre-commit Hooks:** Not configured

## Runtime Environment

- **Port:** 3000 (default)
- **Container:** Not configured (can run directly with Node.js)
- **Orchestration:** Not configured
- **CI/CD:** Not configured

## External Services

- **Database:** None (static data only)
- **Cache:** None
- **Message Queue:** None
- **Object Storage:** None

## Constraints

- Node.js 14+ required (CommonJS support)
- Express 5.x compatible code
- Single-file application (minimal structure)
- No external dependencies beyond Express
