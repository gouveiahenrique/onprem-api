# Repository Structure

## Top-Level Layout

Based on direct directory listing, the repository (excluding `.git/`, `.codegraph/`, and `node_modules/`, which is not present on disk) contains:

```
.
├── index.js             # Single application file: Express app, routes, and server startup
├── package.json          # Project metadata, single dependency (express), npm scripts
├── package-lock.json     # Locked dependency tree for express and its transitive dependencies
├── README.md              # Contains only the title "# onprem-api"
├── .gitignore              # Standard multi-ecosystem ignore file (Node, Python, .NET, Java, iOS, Android)
├── .claudeignore            # Ignore rules for build/cache directories across ecosystems
├── .mcp.json                 # MCP server configuration (cognee, codegraph) — tooling configuration, not application code
├── .bus-metrics-otel.json     # OpenTelemetry/metrics bus configuration — tooling configuration, not application code
└── .openhands/
    └── microagents/
        └── repo.md            # Repository description document for an OpenHands microagent
```

## Module Organization

The repository implements no module decomposition beyond the single `index.js` file. There are no subdirectories such as `src/`, `routes/`, `controllers/`, `models/`, `services/`, or `lib/`. All route definitions, middleware registration, and server startup logic reside in `index.js`.

## Responsibilities

- `index.js`: Defines the Express app, JSON body-parsing middleware, the `/logs` and `/` routes, and starts the HTTP listener on port 3000.
- `package.json`: Declares the package name `onprem-api`, entry point (`index.js`), the `express` runtime dependency, and the `start`/`test` npm scripts.
- `package-lock.json`: Pins exact resolved versions of `express` and its transitive dependencies.

## Dependencies Between Components

Not applicable — there is only one application file (`index.js`) with no internal cross-file dependencies. Its only external dependency is the `express` package, imported via `require('express')` (`index.js:1`).

## Architectural Boundaries

Not found in codebase: layering, separation of routing/business logic/data access, or any modular boundary. The application is a flat, single-file script.
