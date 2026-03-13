# API Standards

**Last updated:** 2026-03-13

## REST Conventions

### HTTP Methods

Currently implemented:
- **GET** - Retrieve resource(s), idempotent, no body

Not yet implemented:
- POST, PUT, PATCH, DELETE

### URL Patterns

```
GET    /              # Welcome message (root)
GET    /logs          # Get static log entries
```

### Status Codes

Currently used:
- **200 OK** - All successful GET requests (implicit)

Not yet implemented:
- 201, 204, 400, 401, 403, 404, 409, 500

## Request Format

### Headers

No custom headers required. Standard Express defaults:
```
Accept: application/json
```

### Body

Not applicable (GET-only endpoints, no request bodies).

## Response Format

### Success Response (GET /logs)

```json
{
  "timestamp": "2026-03-13T18:00:00.000Z",
  "entries": [
    {
      "level": "info",
      "message": "Application started successfully",
      "timestamp": "2025-09-30T10:00:00Z"
    },
    {
      "level": "warning",
      "message": "High memory usage detected",
      "timestamp": "2025-09-30T10:15:45Z"
    },
    {
      "level": "error",
      "message": "Database connection failed",
      "timestamp": "2025-09-30T10:17:12Z"
    }
  ],
  "count": 5,
  "status": "success"
}
```

**Response Structure:**
- `timestamp` (string) - ISO 8601 current server time
- `entries` (array) - List of log entry objects
  - `level` (string) - Log level (info, warning, error)
  - `message` (string) - Log message
  - `timestamp` (string) - ISO 8601 event time
- `count` (number) - Total number of entries
- `status` (string) - Response status ("success")

### Success Response (GET /)

Plain text response:
```
Welcome to the API! Try accessing the /logs endpoint.
```

### Error Response

**Not currently implemented.** No error handling middleware exists.

Recommended format for future implementation:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Route not found",
    "path": "/invalid-path",
    "timestamp": "2026-03-13T18:00:00Z"
  }
}
```

## Authentication

**Not implemented.** All endpoints are publicly accessible.

## Versioning

**Not implemented.** No API version prefix (e.g., `/api/v1/`).

Recommended for future:
- URL path versioning: `/api/v1/logs`
- Breaking changes require new version

## Rate Limiting

**Not implemented.** No rate limiting middleware.

## Error Handling

**Not implemented.** The application has no:
- Try-catch blocks
- Error handling middleware
- 404 handler for unknown routes
- 500 handler for server errors

Recommended additions:
```javascript
// 404 handler (add after all routes)
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
      path: req.path
    }
  });
});

// 500 error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }
  });
});
```

## CORS

**Not configured.** No CORS middleware present.

For frontend integration, add:
```javascript
const cors = require('cors');
app.use(cors());
```

## Content Negotiation

- **JSON responses:** `res.json()` sets `Content-Type: application/json`
- **Text responses:** `res.send()` sets `Content-Type: text/html`
- No explicit Accept header checking
