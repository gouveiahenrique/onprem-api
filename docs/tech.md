# Technical Overview

## Repository Purpose

`onprem-api` is a Node.js HTTP API server intended for on-premises deployment. Based on repository evidence, it exposes log data over HTTP using a single JSON endpoint.

## Languages and Frameworks

| Attribute | Value |
|---|---|
| Language | JavaScript (CommonJS modules) |
| Runtime | Node.js |
| Framework | Express.js v5.1.0 |
| Module system | CommonJS (`require`) |

## Runtime Architecture

The application is a single-process, single-file HTTP server. The entry point is `index.js`, which is also the `main` field in `package.json`.

The server:
- Binds to port `3000` (hardcoded)
- Registers `express.json()` middleware for JSON request body parsing
- Defines two HTTP routes (see `docs/api-standards.md`)
- Starts listening via `app.listen()`

There is no process manager, clustering, or background worker configuration in the repository.

## Major Technical Components

| Component | File | Description |
|---|---|---|
| HTTP server | `index.js` | Express application, route definitions, server startup |

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| express | ^5.1.0 | HTTP framework |

No other runtime dependencies are declared in `package.json`.

## Deployment / Runtime Model

The application is started with:

```bash
npm start
# resolves to: node index.js
```

No containerization configuration (Dockerfile, docker-compose), process manager configuration (PM2, systemd), or cloud deployment configuration was found in the inspected repository files. The name `onprem-api` and the repository description suggest an on-premises deployment target.

Port configuration is hardcoded to `3000` in `index.js`; no environment variable override was found.
