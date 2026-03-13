# API Standards

**Last updated:** 2026-03-13

## REST Conventions

### HTTP Methods

- **GET** - Retrieve resource(s), idempotent, no body
- **POST** - Create resource, non-idempotent, body required
- **PUT** - Replace resource entirely, idempotent, body required
- **PATCH** - Partial update, idempotent, body with changes
- **DELETE** - Remove resource, idempotent, no body

### Current Endpoints

```
GET    /               # Welcome message
GET    /logs           # Retrieve log entries
```

### Recommended URL Patterns

```
GET    /api/v1/logs              # List logs (with pagination)
GET    /api/v1/logs/:id          # Get specific log entry
POST   /api/v1/logs              # Create log entry (if write is needed)
DELETE /api/v1/logs/:id          # Delete log entry
```

**Note:** Current implementation does not use `/api/v1/` prefix or versioning.

### Status Codes

Current implementation returns:
- **200 OK** - All successful GET requests

**Recommended full implementation:**
- **200 OK** - Successful GET, PUT, PATCH
- **201 Created** - Successful POST
- **204 No Content** - Successful DELETE
- **400 Bad Request** - Validation error
- **401 Unauthorized** - Missing/invalid authentication
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource doesn't exist
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server error

## Request Format

### Headers

```
Content-Type: application/json
Accept: application/json
```

**Recommended additions:**
```
Authorization: Bearer {token}
X-Request-ID: {uuid}
X-API-Version: v1
```

### Body (POST/PUT/PATCH)

Example for creating a log entry:
```json
{
  "level": "info",
  "message": "User logged in successfully",
  "timestamp": "2026-03-13T10:00:00Z",
  "metadata": {
    "userId": "123",
    "ip": "192.168.1.1"
  }
}
```

## Response Format

### Current Implementation

```json
{
  "timestamp": "2026-03-13T21:06:49.661Z",
  "entries": [
    {
      "level": "info",
      "message": "Application started successfully",
      "timestamp": "2025-09-30T10:00:00Z"
    }
  ],
  "count": 5,
  "status": "success"
}
```

### Recommended Standard Format

#### Success Response

```json
{
  "success": true,
  "data": {
    "id": "123",
    "level": "info",
    "message": "Application started successfully",
    "timestamp": "2025-09-30T10:00:00Z"
  },
  "metadata": {
    "requestId": "uuid-here",
    "timestamp": "2026-03-13T21:06:49.661Z"
  }
}
```

#### List Response (with pagination)

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5
  },
  "metadata": {
    "requestId": "uuid-here",
    "timestamp": "2026-03-13T21:06:49.661Z"
  }
}
```

#### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid log level provided",
    "details": [
      {
        "field": "level",
        "message": "Must be one of: info, warning, error, debug"
      }
    ]
  },
  "metadata": {
    "requestId": "uuid-here",
    "timestamp": "2026-03-13T21:06:49.661Z"
  }
}
```

## Authentication

**Current Implementation:** None

**Recommended:**
- **Type:** JWT (JSON Web Tokens) or API Keys
- **Header:** `Authorization: Bearer {token}`
- **Token Lifetime:** 1 hour (access token), 7 days (refresh token)
- **Refresh Endpoint:** POST /api/v1/auth/refresh

Example authentication flow:
```
POST /api/v1/auth/login
{
  "username": "admin",
  "password": "secure_password"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGVzdC1yZWZyZXNo...",
    "expiresIn": 3600
  }
}
```

## Error Handling

### Current Implementation

No explicit error handling middleware. Default Express error handler is used.

### Recommended Error Handling

```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    metadata: {
      requestId: req.id,
      timestamp: new Date().toISOString()
    }
  };
  res.status(statusCode).json(response);
});
```

## Versioning

**Current Implementation:** No versioning

**Recommended Strategy:** URL path versioning
- `/api/v1/logs` - Version 1
- `/api/v2/logs` - Version 2

**Versioning Rules:**
- New version required for breaking changes
- Maintain backward compatibility within a version
- Deprecation notice: Minimum 6 months before removal
- Include deprecation warnings in response headers

## Rate Limiting

**Current Implementation:** None

**Recommended:**
- **Limit:** 100 requests per minute per IP
- **Library:** express-rate-limit
- **Headers:**
  - X-RateLimit-Limit: 100
  - X-RateLimit-Remaining: 95
  - X-RateLimit-Reset: 1710363609

**Response (429 Too Many Requests):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later"
  }
}
```

## CORS

**Current Implementation:** No CORS configuration

**Recommended:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Request Logging

**Current Implementation:** None

**Recommended:**
- Use morgan middleware for HTTP request logging
- Log format: combined or JSON for production
- Include request ID for tracing
- Log response times and status codes
