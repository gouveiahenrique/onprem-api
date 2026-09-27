# Technical Overview

## Repository Purpose

`onprem-api` is a lightweight Node.js HTTP API server that exposes static mock log data via a REST endpoint. The application is designed as a simple on-premises service returning pre-defined log entries.

## Languages and Frameworks

| Component | Detail |
|-----------|--------|
| Language | JavaScript (Node.js, CommonJS modules) |
| Runtime | Node.js |
| Framework | Express.js `^5.1.0` |
| Module system | CommonJS (`"type": "commonjs"` in `package.json`) |

## Runtime Architecture

The application is a single-process HTTP server. On startup, Express binds to port `3000` and serves incoming HTTP requests synchronously via registered route handlers. There is no background processing, worker threads, or message queue integration found in the codebase.

## Major Technical Components

### HTTP Server (`index.js`)
- Instantiates an Express application.
- Registers `express.json()` middleware for JSON request body parsing.
- Registers two route handlers (see `docs/api-standards.md`).
- Starts the HTTP listener on port `3000`.

## Dependencies

| Package | Version | Role |
|---------|---------|------|
| `express` | `^5.1.0` | HTTP server and routing framework |

No other runtime dependencies are declared in `package.json`.

## Deployment / Runtime Model

The server is started via:

```bash
npm start
# or
node index.js
```

The process listens on `http://localhost:3000`. No containerisation configuration, environment variable handling, or external service connections were found in the codebase. Port is hardcoded to `3000` in `index.js`.
