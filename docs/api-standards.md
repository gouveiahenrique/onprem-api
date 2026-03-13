# API Standards

**Last updated:** 2026-03-13

## REST Conventions

### HTTP Methods

Currently implemented:
- **GET** - Retrieve resource(s), idempotent, no body

Not yet implemented:
- **POST** - Create resource
- **PUT** - Replace resource
- **PATCH** - Partial update
- **DELETE** - Remove resource

### URL Patterns

```
GET    /                  # Welcome message
GET    /logs              # Get log entries (static data)
```

### Status Codes

Currently used:
- **200 OK** - Successful GET (implicit default)

Not yet implemented:
- **201 Created** - Successful POST
- **204 No Content** - Successful DELETE
- **400 Bad Request** - Validation error
- **401 Unauthorized** - Missing/invalid auth
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource doesn't exist
- **500 Internal Server Error** - Server error

## Request Format

### Headers

```
Content-Type: application/json
```

Currently no authentication or request ID tracking.

### Body

No POST/PUT/PATCH endpoints yet - body parsing configured via `express.json()` middleware.

## Response Format

### Success Response (GET /logs)

```json
{
  "timestamp": "2026-03-13T10:00:00.000Z",
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

### Success Response (GET /)

```
Welcome to the API! Try accessing the /logs endpoint.
```

### Error Response

Not standardized - uses Express default error handling:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /unknown</pre>
</body>
</html>
```

### Recommended Error Format

For production, should use:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "path": "/unknown",
    "timestamp": "2026-03-13T10:00:00Z"
  }
}
```

## Authentication

- **Type:** None implemented
- **Recommended:** JWT Bearer tokens or API keys for production

## Versioning

- **Strategy:** No versioning yet
- **Recommended:** URL path versioning (`/api/v1/logs`) for future

## Rate Limiting

- **Implemented:** No
- **Recommended:** Use `express-rate-limit` middleware for production

## CORS

- **Implemented:** No
- **Recommended:** Configure CORS policy for browser access

## Current Gaps

- No error handling middleware
- No input validation
- No authentication/authorization
- No request logging
- No rate limiting
- No CORS configuration
- No API versioning
- Inconsistent response format (JSON vs plain text)
- No pagination for list endpoints
- No query parameter filtering
