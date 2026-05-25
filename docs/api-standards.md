# API Standards

**Last updated:** 2026-05-25

## Current Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Welcome message (plain text) |
| GET | `/logs` | Returns structured log entries (JSON) |

## REST Conventions

### HTTP Methods in Use

- **GET** — all current endpoints are read-only GET requests

### URL Patterns

```
GET /          # Root welcome route (text/plain)
GET /logs      # Fetch log entries (application/json)
```

No URL versioning (e.g., `/api/v1/`) is currently applied.

## Response Formats

### Success Response — `/logs`

```json
{
  "timestamp": "2026-05-25T10:00:00.000Z",
  "entries": [
    { "level": "info",    "message": "Application started successfully",    "timestamp": "2025-09-30T10:00:00Z" },
    { "level": "info",    "message": "User authentication successful",       "timestamp": "2025-09-30T10:05:23Z" },
    { "level": "warning", "message": "High memory usage detected",           "timestamp": "2025-09-30T10:15:45Z" },
    { "level": "error",   "message": "Database connection failed",           "timestamp": "2025-09-30T10:17:12Z" },
    { "level": "info",    "message": "Database connection restored",         "timestamp": "2025-09-30T10:18:30Z" }
  ],
  "count": 5,
  "status": "success"
}
```

**Top-level fields:**

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | ISO 8601 string | Server time when response was generated |
| `entries` | array | Log entry objects |
| `count` | number | Number of entries returned |
| `status` | string | Always `"success"` for 200 responses |

**Log entry fields:**

| Field | Type | Values |
|-------|------|--------|
| `level` | string | `"info"`, `"warning"`, `"error"` |
| `message` | string | Human-readable log message |
| `timestamp` | ISO 8601 string | Time the log event occurred |

### Success Response — `/` (root)

```
Content-Type: text/html
Body: Welcome to the API! Try accessing the /logs endpoint.
```

## Status Codes

| Code | When Used |
|------|-----------|
| 200 OK | Successful GET (both routes) |
| 404 Not Found | Express default for undefined routes |
| 500 Internal Server Error | Express default for unhandled errors |

No custom error handling is currently implemented; error responses use Express 5 defaults.

## Authentication

None. All endpoints are publicly accessible with no authentication or authorization.

## Versioning

No versioning strategy is currently applied. Both routes are mounted at the root path with no `/api/v1/` prefix.

## CORS

Not configured. CORS headers are not set; cross-origin requests will be blocked by browsers by default.

## Rate Limiting

Not configured.

## Pagination and Filtering

Not implemented. The `/logs` endpoint always returns all 5 hardcoded entries with no query parameter support.

## Recommended Standards (for future additions)

When adding new endpoints, follow these conventions to stay consistent:

- Mount under `/api/v1/` for versioned resources
- Return JSON for all responses; set `Content-Type: application/json`
- Use an `error` wrapper for non-2xx responses:
  ```json
  { "error": { "code": "NOT_FOUND", "message": "Resource not found" } }
  ```
- Use `req.query` for filters, `req.params` for resource IDs
- Prefer reading config from `process.env` (e.g., `PORT`, `API_KEY`)
