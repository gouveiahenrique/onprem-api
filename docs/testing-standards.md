# Testing Standards

**Last updated:** 2026-05-25

## Current State

No testing framework is configured. `package.json` defines the test script as:

```json
"test": "echo \"Error: no test specified\" && exit 1"
```

The guidance below documents the recommended standards to adopt when tests are added.

## Recommended Testing Framework

- **Unit / Integration Tests:** Jest or Mocha + Supertest
- **HTTP Integration Tests:** Supertest (integrates with Express app directly)

## Recommended Test Organization

```
tests/
├── unit/                  # Isolated logic tests (no HTTP, no I/O)
│   └── *.test.js
└── integration/           # Full HTTP round-trip tests via Supertest
    └── *.test.js
```

## Test Naming Conventions

### JavaScript (Jest / Mocha)

```javascript
// File: logs.test.js
// Describe block: GET /logs
// Test: should return 200 with log entries
// Test: should return status "success" in body
```

## Test Structure (AAA Pattern)

```javascript
const request = require('supertest');
const app = require('../index');

describe('GET /logs', () => {
  it('should return 200 with log entries', async () => {
    // Arrange — app is already configured

    // Act
    const res = await request(app).get('/logs');

    // Assert
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.entries)).toBe(true);
  });
});
```

## Mocking Strategy

### Unit Tests

- Mock I/O boundaries (file system, external HTTP calls, databases) if introduced
- Keep handler logic pure and extractable for isolated testing

### Integration Tests

- Use the real Express app instance — no mocking of Express internals
- Supertest drives HTTP without starting a live server on a port

## Coverage Targets

- **Overall:** ≥80% (lines/branches)
- **Route handlers:** ≥90%

### Coverage Commands (once configured)

```bash
# Jest with coverage
npx jest --coverage

# nyc (Istanbul) with Mocha
npx nyc mocha
```

## Setup Steps (when adding tests)

1. Install test dependencies:
   ```bash
   npm install --save-dev jest supertest
   ```
2. Update `package.json` test script:
   ```json
   "test": "jest"
   ```
3. Export the app from `index.js` for Supertest:
   ```javascript
   // At bottom of index.js — only listen when run directly
   if (require.main === module) {
     app.listen(port, () => console.log(`...`));
   }
   module.exports = app;
   ```

## Best Practices

- ✅ Tests should be fast (<100ms per unit test)
- ✅ Tests should be independent (no shared mutable state between tests)
- ✅ Clear test names that describe expected behavior
- ✅ One logical assertion per test where feasible
- ❌ Don't start a real server on a port in tests — use Supertest
- ❌ Don't test Express internals (routing, middleware behavior)
