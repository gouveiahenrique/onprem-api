# API Standards

**Last updated:** 2026-05-25

## REST Conventions

### HTTP Methods

Currently only GET is used. Intended conventions for expansion:

- **GET** — Retrieve resource(s), idempotent, no body
- **POST** — Create resource, non-idempotent, body required
- **PUT** — Replace resource entirely, idempotent, body required
- **PATCH** — Partial update, body with changed fields only
- **DELETE** — Remove resource, idempotent, no body

### Existing Endpoints

```
GET /          # Welcome message (plain text)
GET /logs      # Returns static log entries (JSON)
```

### URL Pattern Conventions (for future routes)

```
GET    /api/v1/{resource}          # List resources
GET    /api/v1/{resource}/{id}     # Get specific resource
POST   /api/v1/{resource}          # Create resource
PUT    /api/v1/{resource}/{id}     # Replace resource
PATCH  /api/v1/{resource}/{id}     # Partially update resource
DELETE /api/v1/{resource}/{id}     # Delete resource
```

### Status Codes

- **200 OK** — Successful GET (currently used)
- **201 Created** — Successful POST
- **204 No Content** — Successful DELETE
- **400 Bad Request** — Validation error
- **401 Unauthorized** — Missing/invalid auth
- **403 Forbidden** — Insufficient permissions
- **404 Not Found** — Resource doesn't exist
- **500 Internal Server Error** — Server error

## Request Format

### Headers

```
Content-Type: application/json
```

No authentication headers currently required.

## Response Format

### Current `/logs` Response

```json
{
  "timestamp": "2026-05-25T10:00:00.000Z",
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
    }
  ],
  "count": 5,
  "status": "success"
}
```

### Recommended Standard Success Response (for future routes)

```json
{
  "data": { ... }
}
```

### Recommended List Response (for future routes)

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### Recommended Error Response (for future routes)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": []
  }
}
```

## Authentication

- **Current:** None — all endpoints are unauthenticated
- **Recommended for production:** API key via `Authorization: Bearer {token}` header

## Versioning

- **Current:** No versioning (paths are `/logs`, `/`)
- **Recommended:** URL path versioning (`/api/v1/`) for any breaking changes

## Rate Limiting

- **Current:** None configured
- **Recommended:** Add rate-limiting middleware (e.g., `express-rate-limit`) before exposing publicly
