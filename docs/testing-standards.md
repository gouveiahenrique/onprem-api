# Testing Standards

**Last updated:** 2026-03-13

## Testing Framework

**Not yet implemented.** The project has:
- No test files
- No testing framework installed
- `npm test` script exits with error

Recommended frameworks:
- **Jest** - Popular choice for Node.js, built-in mocking
- **Mocha + Chai** - Flexible, modular testing
- **Supertest** - HTTP assertions for Express apps

## Test Organization

**Recommended structure** (not yet implemented):

```
tests/
├── unit/                  # Fast isolated tests
│   ├── routes.test.js    # Route handler tests
│   └── middleware.test.js # Middleware tests
└── integration/           # Tests with real server
    └── api.test.js       # API endpoint tests
```

## Test Naming Conventions

### Recommended (Jest/Mocha)

```javascript
// File: tests/integration/api.test.js
// Pattern: <feature>.test.js or <feature>.spec.js

describe('GET /logs', () => {
  it('should return 200 and log entries', async () => {
    // test logic
  });

  it('should return current timestamp', async () => {
    // test logic
  });
});

describe('GET /', () => {
  it('should return welcome message', async () => {
    // test logic
  });
});
```

## Test Structure (AAA Pattern)

```javascript
const request = require('supertest');
const app = require('../index'); // Export app from index.js

describe('GET /logs', () => {
  it('should return log entries with correct structure', async () => {
    // Arrange (Given)
    const expectedFields = ['timestamp', 'entries', 'count', 'status'];

    // Act (When)
    const response = await request(app).get('/logs');

    // Assert (Then)
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body.entries).toBeInstanceOf(Array);
    expect(response.body.count).toBe(5);
    expect(response.body.status).toBe('success');
  });
});
```

## Mocking Strategy

### Unit Tests

For unit tests (when logic is extracted):
- **Mock Express request/response objects**
- **Mock external dependencies** (if any added in future)
- **Use jest.fn()** for spy functions

```javascript
// Example unit test for extracted route handler
const { getLogsHandler } = require('../src/controllers/logs');

describe('getLogsHandler', () => {
  it('should call res.json with log data', () => {
    const req = {};
    const res = {
      json: jest.fn()
    };

    getLogsHandler(req, res);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'success',
        count: 5
      })
    );
  });
});
```

### Integration Tests

For integration tests:
- **Use real Express app** (via supertest)
- **No mocking of app internals**
- **Test actual HTTP responses**

```javascript
const request = require('supertest');
const app = require('../index');

describe('API Integration Tests', () => {
  it('should handle 404 for unknown routes', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
  });
});
```

## Coverage Targets

**Not yet configured.** Recommended targets:
- **Overall Coverage:** ≥80%
- **Routes:** ≥90% (critical paths)
- **Middleware:** ≥80%
- **Error Handlers:** ≥90% (when implemented)

### Coverage Commands

Recommended setup with Jest:
```bash
# Install
npm install --save-dev jest supertest

# Run tests with coverage
npm test -- --coverage

# Coverage report
open coverage/lcov-report/index.html
```

Add to package.json:
```json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  },
  "jest": {
    "testEnvironment": "node",
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
      "**/*.js",
      "!node_modules/**",
      "!coverage/**"
    ],
    "coverageThresholds": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## CI/CD Integration

**Not yet configured.** Recommended GitHub Actions workflow:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Test Data Management

- **Static data:** Currently in index.js (logs array)
- **Fixtures:** Create `tests/fixtures/` for shared test data
- **Factories:** Not needed yet (no database, no complex objects)
- **Cleanup:** Not needed (no side effects, no database)

## Required Changes to Make Code Testable

The current `index.js` needs modification to be testable:

```javascript
// Current (not testable):
app.listen(port, () => { ... });

// Recommended (testable):
// Export app without starting server
module.exports = app;

// Create separate bin/server.js:
const app = require('./index');
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

Update package.json:
```json
{
  "scripts": {
    "start": "node bin/server.js",
    "test": "jest"
  }
}
```

## Best Practices

- ✅ Test actual HTTP responses (integration tests)
- ✅ Validate response structure and data types
- ✅ Test edge cases (404, invalid routes)
- ✅ Keep tests fast (<100ms per test)
- ✅ One assertion concept per test
- ✅ Clear test names (describe behavior, not implementation)
- ❌ Don't test Express internals
- ❌ Don't test third-party libraries (Express itself)
