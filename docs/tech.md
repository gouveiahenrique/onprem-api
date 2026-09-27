# Technical Overview

## Repository Purpose

`onprem-api` is a lightweight Node.js HTTP API server designed to serve static log data. The repository implements a single-process HTTP service exposing two GET endpoints — a root welcome route and a `/logs` route that returns a fixed JSON payload of mock log entries.

## Languages and Frameworks

| Component     | Detail                          |
|---------------|---------------------------------|
| Language      | JavaScript (Node.js, CommonJS)  |
| Framework     | Express.js `^5.1.0`             |
| Module system | CommonJS (`require` / `module.exports`) |
| Runtime       | Node.js                         |

## Major Technical Components

| Component         | Location    | Role                                                             |
|-------------------|-------------|------------------------------------------------------------------|
| HTTP Server       | `index.js`  | Initialises Express, registers middleware and routes, binds to port 3000 |
| JSON Middleware   | `index.js:6`| `express.json()` — parses incoming JSON request bodies          |
| `/logs` handler   | `index.js:9–25` | Returns a static JSON object containing five hardcoded log entries |
| Root handler      | `index.js:28–30` | Returns a plain-text welcome string                          |

## Runtime Architecture

The application is a single-process, synchronous HTTP server. No background workers, message queues, database connections, or external service integrations are present in the repository. The server listens on **port 3000** (hardcoded).

## Deployment / Runtime Model

The application is started directly with Node.js (`node index.js` or `npm start`). No containerisation configuration, infrastructure-as-code, or process management files were found in the repository.
