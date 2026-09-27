# API Standards

## Transport

The application implements an HTTP/1.1 REST API served by Express.js on port 3000.

## Implemented Endpoints

### `GET /`

- **Handler**: `index.js:28–30`
- **Response content-type**: `text/html` (Express default for `res.send(string)`)
- **Response body**: Plain text string — `"Welcome to the API! Try accessing the /logs endpoint."`
- **Status code**: `200 OK`

---

### `GET /logs`

- **Handler**: `index.js:9–25`
- **Response content-type**: `application/json` (via `res.json()`)
- **Status code**: `200 OK`
- **Response shape** (static, hardcoded):

```json
{
  "timestamp": "<ISO-8601 string generated at request time>",
  "entries": [
    { "level": "info",    "message": "...", "timestamp": "<ISO-8601>" },
    { "level": "info",    "message": "...", "timestamp": "<ISO-8601>" },
    { "level": "warning", "message": "...", "timestamp": "<ISO-8601>" },
    { "level": "error",   "message": "...", "timestamp": "<ISO-8601>" },
    { "level": "info",    "message": "...", "timestamp": "<ISO-8601>" }
  ],
  "count": 5,
  "status": "success"
}
```

The `entries` array contains five hardcoded log records. The top-level `timestamp` field is generated dynamically at request time (`new Date().toISOString()`); all entry-level timestamps are static strings.

## Request Parsing

The `express.json()` middleware (`index.js:6`) is registered globally. Neither `GET /` nor `GET /logs` read request bodies; JSON parsing is present but unused by the current handlers.

## Authentication and Authorization

No authentication or authorization mechanism was found in the repository.

## Validation

No input validation was found in the repository. The implemented endpoints accept `GET` requests with no query parameters or path variables.

## Error Handling

No explicit error handlers or error-response schemas were found in the repository. Express.js default error handling applies at the framework level.

## Versioning

No API versioning scheme (URL prefix, header, or content negotiation) was found in the repository.
