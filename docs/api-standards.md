# API Standards

## Transport

The application exposes an HTTP/1.1 REST API. No HTTPS configuration, WebSocket, or GraphQL layer was found in the codebase.

## Base URL

```
http://localhost:3000
```

Port is hardcoded to `3000` in `index.js:3`.

## Endpoints

### `GET /`

Returns a plain-text welcome message.

**Response**
- Content-Type: `text/html; charset=utf-8` (Express default for `res.send(string)`)
- Body: `Welcome to the API! Try accessing the /logs endpoint.`

---

### `GET /logs`

Returns a static JSON payload containing mock log entries.

**Response**
- Content-Type: `application/json`
- HTTP Status: `200 OK`

**Response Schema**

```json
{
  "timestamp": "<ISO 8601 string — current server time at request>",
  "entries": [
    {
      "level": "<string>",
      "message": "<string>",
      "timestamp": "<ISO 8601 string>"
    }
  ],
  "count": "<integer>",
  "status": "<string>"
}
```

**Example Response**

```json
{
  "timestamp": "2026-09-27T12:00:00.000Z",
  "entries": [
    { "level": "info",    "message": "Application started successfully",  "timestamp": "2025-09-30T10:00:00Z" },
    { "level": "info",    "message": "User authentication successful",     "timestamp": "2025-09-30T10:05:23Z" },
    { "level": "warning", "message": "High memory usage detected",         "timestamp": "2025-09-30T10:15:45Z" },
    { "level": "error",   "message": "Database connection failed",         "timestamp": "2025-09-30T10:17:12Z" },
    { "level": "info",    "message": "Database connection restored",       "timestamp": "2025-09-30T10:18:30Z" }
  ],
  "count": 5,
  "status": "success"
}
```

The `entries` array is statically defined in `index.js`; only the top-level `timestamp` field is dynamic (set to `new Date().toISOString()` at request time).

## Middleware

| Middleware | Registration | Purpose |
|------------|-------------|---------|
| `express.json()` | `index.js:6` | Parses `application/json` request bodies |

## Authentication and Authorization

No authentication or authorization mechanisms were found in the codebase.

## Validation

No request validation logic was found in the codebase. The `GET /logs` endpoint accepts no query parameters or request body.

## Error Handling

No explicit error handlers are registered. Express default error handling applies at the framework level.

## Request / Response Format

All structured responses use JSON (`res.json()`). The root route uses `res.send()` returning plain text.
