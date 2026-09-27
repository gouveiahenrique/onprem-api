# API Standards

## Transport

The application exposes an HTTP REST API over TCP. No HTTPS configuration was found in the repository.

## Implemented Endpoints

### `GET /`

- **Description:** Root welcome endpoint.
- **Response content-type:** `text/html` (Express default for `res.send(string)`).
- **Response body:** Plain text string — `"Welcome to the API! Try accessing the /logs endpoint."`.
- **Status code:** `200 OK`.
- **Authentication:** None observed.

### `GET /logs`

- **Description:** Returns a static collection of log entries.
- **Response content-type:** `application/json`.
- **Response shape:**

```json
{
  "timestamp": "<ISO-8601 string, server time at request>",
  "entries": [
    {
      "level": "<string>",
      "message": "<string>",
      "timestamp": "<ISO-8601 string>"
    }
  ],
  "count": "<integer>",
  "status": "<string>"
}
```

- **`entries` values:** The payload is static; the same five entries are returned on every call regardless of query parameters or state.
- **`timestamp` (top-level):** Generated dynamically via `new Date().toISOString()` at request time.
- **Status code:** `200 OK`.
- **Authentication:** None observed.

## Request Parsing

- `express.json()` middleware is registered globally (`index.js:6`), enabling JSON body parsing for all routes. No routes in the current implementation consume a request body.

## Authentication and Authorization

Not found in the codebase.

## Validation

Not found in the codebase.

## Error Handling

No explicit error handling middleware was found. Express 5 default error behaviour applies (framework-level).

## Versioning

API versioning was not found in the codebase (no version prefix in routes, no version header).
