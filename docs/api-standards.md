# API Standards

## Interface Type

HTTP REST API implemented with Express.js.

## Defined Routes

### `GET /`

Returns a plain-text welcome message.

**Response**

- Content-Type: `text/html` (Express default for `res.send(string)`)
- Body: `Welcome to the API! Try accessing the /logs endpoint.`

---

### `GET /logs`

Returns a static JSON object containing hardcoded log entries.

**Response**

- Content-Type: `application/json`
- Status: `200 OK`

**Response Schema**

```json
{
  "timestamp": "<ISO 8601 string — generated at request time>",
  "entries": [
    {
      "level": "info | warning | error",
      "message": "<string>",
      "timestamp": "<ISO 8601 string — static>"
    }
  ],
  "count": "<integer>",
  "status": "success"
}
```

**Example Response**

```json
{
  "timestamp": "2026-09-27T10:00:00.000Z",
  "entries": [
    { "level": "info",    "message": "Application started successfully",   "timestamp": "2025-09-30T10:00:00Z" },
    { "level": "info",    "message": "User authentication successful",      "timestamp": "2025-09-30T10:05:23Z" },
    { "level": "warning", "message": "High memory usage detected",          "timestamp": "2025-09-30T10:15:45Z" },
    { "level": "error",   "message": "Database connection failed",          "timestamp": "2025-09-30T10:17:12Z" },
    { "level": "info",    "message": "Database connection restored",        "timestamp": "2025-09-30T10:18:30Z" }
  ],
  "count": 5,
  "status": "success"
}
```

The `entries` array is static (hardcoded in `index.js`). The top-level `timestamp` field is generated dynamically at request time using `new Date().toISOString()`.

## Middleware

| Middleware | Registration | Purpose |
|---|---|---|
| `express.json()` | Global, applied to all routes | Parses incoming JSON request bodies |

## Authentication

Not found in codebase. No authentication or authorization middleware is implemented.

## Validation

Not found in codebase. No request parameter or body validation is implemented.

## Error Handling

Not found in codebase. No explicit error-handling middleware is registered.

## Base URL

The server listens on `http://localhost:3000` when run locally. No reverse proxy or base path configuration was found in the repository.
