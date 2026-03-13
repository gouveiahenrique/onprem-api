# API Standards

**Last updated:** 2026-03-13

## REST Conventions

### HTTP Methods

Currently implemented:
- **GET** - Retrieve resources (read-only)

Not yet implemented:
- POST, PUT, PATCH, DELETE

### URL Patterns

```
GET    /              # Welcome message
GET    /logs          # Retrieve log entries
```

**Naming conventions:**
- Lowercase paths
- Plural nouns for collections (`/logs` not `/log`)
- No trailing slashes

### Status Codes

Currently used:
- **200 OK** - Successful GET requests

**Recommended to add:**
- **404 Not Found** - Unknown routes (currently returns default Express 404)
- **500 Internal Server Error** - Unhandled exceptions
- **400 Bad Request** - Invalid query parameters (if added)

## Request Format

### Headers

Currently no special headers required.

**Recommended for production:**
```
Content-Type: application/json
Accept: application/json
X-Request-ID: {uuid}          # For request tracing
```

### Query Parameters

Not currently used.

**Recommended patterns if added:**
```
GET /logs?level=error          # Filter by log level
GET /logs?limit=10&offset=20   # Pagination
GET /logs?since=2025-09-30     # Date filtering
```

## Response Format

### Success Response

Current format (`GET /logs`):

```json
{
  "timestamp": "2026-03-13T10:00:00.000Z",
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

**Structure:**
- Top-level metadata (`timestamp`, `count`, `status`)
- Data array (`entries`)
- Each entry has `level`, `message`, `timestamp`

### Error Response

**Not currently implemented.**

**Recommended format:**

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "status": 404,
    "timestamp": "2026-03-13T10:00:00.000Z"
  }
}
```

### Pagination

**Not currently implemented** (static data, no pagination needed).

**Recommended format if data grows:**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

## Authentication

**Not currently implemented** - All endpoints are public.

**Recommended for production:**
- **Type:** JWT (JSON Web Tokens) or API Keys
- **Header:** `Authorization: Bearer {token}`
- **Middleware:** Express middleware to validate tokens

## Versioning

**Not currently implemented** - No API versioning strategy.

**Recommended strategy:**
- **URL path versioning:** `/api/v1/logs`, `/api/v2/logs`
- **Rationale:** Clear, explicit, easy to route
- **Alternative:** Header versioning (`Accept: application/vnd.api+json;version=1`)

## Rate Limiting

**Not currently implemented.**

**Recommended for production:**
- Use `express-rate-limit` middleware
- Limit: 100 requests per minute per IP
- Response headers:
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 95`
  - `X-RateLimit-Reset: 1610000000`
- Response (429): `{"error": {"code": "RATE_LIMIT_EXCEEDED", "message": "Too many requests"}}`

## CORS

**Not currently implemented** (no `cors` middleware).

**Recommended for production:**
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Logging and Monitoring

**Current logging:**
- `console.log()` on server startup
- No request logging
- No error logging

**Recommended:**
- Structured logging (Winston, Pino)
- Request logging middleware (Morgan)
- Error logging with stack traces
- Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL

## Health Check Endpoint

**Not currently implemented.**

**Recommended:**
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## API Documentation

**Not currently implemented.**

**Recommended:**
- Use Swagger/OpenAPI for API documentation
- Install `swagger-jsdoc` and `swagger-ui-express`
- Auto-generate docs from JSDoc comments
- Serve docs at `/api-docs`
