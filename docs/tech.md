# Technical Overview

## Repository Purpose

`onprem-api` is a minimal on-premises HTTP API server. Based on the implemented routes, it exposes log data over HTTP in JSON format.

## Languages and Frameworks

| Attribute | Value |
|-----------|-------|
| Language | JavaScript (Node.js, CommonJS module system) |
| Framework | Express 5.x (`^5.1.0`) |
| Runtime | Node.js |
| Module format | CommonJS (`"type": "commonjs"` in `package.json`) |

## Major Technical Components

| Component | Location | Description |
|-----------|----------|-------------|
| HTTP server | `index.js` | Express application instance listening on port 3000 |
| JSON middleware | `index.js:6` | `express.json()` middleware parses incoming JSON request bodies |
| `/logs` endpoint | `index.js:9–25` | `GET /logs` — returns a static JSON payload of log entries |
| Root endpoint | `index.js:28–30` | `GET /` — returns a plain-text welcome message |

## Runtime Architecture

- Single-process, single-file application (`index.js` is the entry point defined in `package.json:main`).
- The server binds to `http://localhost:3000` at startup.
- No external services, databases, or message queues were found in the inspected codebase.

## Deployment Model

- Start command: `node index.js` (via `npm start`).
- No containerisation configuration (Dockerfile, docker-compose) was found in the repository.
- No CI/CD configuration was found in the repository.
- Port: `3000` (hardcoded in `index.js:3`).
