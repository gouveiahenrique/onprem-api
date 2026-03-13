# Testing Standards

**Last updated:** 2026-03-13

## Testing Framework

**Current state:** No testing framework configured.

**Recommended:**
- **Unit Tests:** Jest 29+ (Node.js standard)
- **Integration Tests:** Supertest (Express endpoint testing)
- **E2E Tests:** Not needed for current API scope

## Test Organization

**Current structure:** No `tests/` directory exists.

**Recommended structure:**

```
tests/
├── unit/                  # Fast isolated tests
│   └── routes/
│       └── logs.test.js
└── integration/           # Tests with real dependencies
    └── api/
        └── logs.integration.test.js
```

## Test Setup

### Install Testing Dependencies

```bash
npm install --save-dev jest supertest
```

### Configure Jest

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
      "**/*.js",
      "!**/node_modules/**",
      "!**/coverage/**"
    ]
  }
}
```

## Test Naming Conventions

### File Naming

- **Unit tests:** `*.test.js` (e.g., `logs.test.js`)
- **Integration tests:** `*.integration.test.js`
- **Location:** Mirror source structure in `tests/` directory

### Test Naming

```javascript
describe('GET /logs', () => {
  it('should return logs with 200 status', async () => { ... });
  it('should return 5 log entries', async () => { ... });
  it('should include timestamp in response', async () => { ... });
});
```

**Naming pattern:** `should [expected behavior]`

## Test Structure (AAA Pattern)

```javascript
const request = require('supertest');
const app = require('../index');

describe('GET /logs', () => {
  it('should return logs with correct structure', async () => {
    // Arrange (setup - none needed for this static endpoint)

    // Act (execute the request)
    const response = await request(app).get('/logs');

    // Assert (verify results)
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('entries');
    expect(response.body.entries).toHaveLength(5);
    expect(response.body.status).toBe('success');
  });
});
```

## Example Test Suite

### Unit Test Example (`tests/unit/routes/logs.test.js`)

```javascript
const request = require('supertest');
const express = require('express');

// Mock the route handler
const createLogsRoute = () => {
  const app = express();
  app.use(express.json());

  app.get('/logs', (req, res) => {
    const logs = {
      timestamp: new Date().toISOString(),
      entries: [
        { level: 'info', message: 'Test log', timestamp: '2025-09-30T10:00:00Z' }
      ],
      count: 1,
      status: 'success'
    };
    res.json(logs);
  });

  return app;
};

describe('GET /logs', () => {
  let app;

  beforeEach(() => {
    app = createLogsRoute();
  });

  it('should return 200 status code', async () => {
    const response = await request(app).get('/logs');
    expect(response.status).toBe(200);
  });

  it('should return JSON content type', async () => {
    const response = await request(app).get('/logs');
    expect(response.headers['content-type']).toMatch(/json/);
  });

  it('should have required fields', async () => {
    const response = await request(app).get('/logs');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('entries');
    expect(response.body).toHaveProperty('count');
    expect(response.body).toHaveProperty('status');
  });

  it('should return entries as array', async () => {
    const response = await request(app).get('/logs');
    expect(Array.isArray(response.body.entries)).toBe(true);
  });

  it('each log entry should have level, message, timestamp', async () => {
    const response = await request(app).get('/logs');
    const entry = response.body.entries[0];
    expect(entry).toHaveProperty('level');
    expect(entry).toHaveProperty('message');
    expect(entry).toHaveProperty('timestamp');
  });
});

describe('GET /', () => {
  it('should return welcome message', async () => {
    const app = express();
    app.get('/', (req, res) => res.send('Welcome to the API! Try accessing the /logs endpoint.'));

    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Welcome to the API');
  });
});
```

## Mocking Strategy

**Current needs:** Minimal (static data, no external dependencies)

**When scaling:**
- Mock database connections (`jest.mock('pg')`)
- Mock external API calls (`jest.mock('axios')`)
- Mock time (`jest.useFakeTimers()`)

## Coverage Targets

**Recommended targets:**
- **Overall Coverage:** ≥80%
- **Routes/Controllers:** ≥90%
- **Middleware:** ≥85%
- **Utilities:** ≥80%

**Current state:** 0% (no tests)

### Generate Coverage Report

```bash
npm run test:coverage
# Opens coverage/lcov-report/index.html
```

## CI/CD Integration

**Current state:** No CI/CD configured.

**Recommended GitHub Actions workflow:**

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm ci
    - run: npm test
    - run: npm run test:coverage
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
```

## Test Data Management

**Current needs:** Static data in code (no fixtures needed)

**When scaling:**
- Use test fixtures (`tests/fixtures/logs.json`)
- Use factory pattern for test data
- Reset database state between tests

## Best Practices

- ✅ Tests should be fast (<100ms per test)
- ✅ Tests should be independent (no shared state)
- ✅ One expectation focus per test
- ✅ Clear test descriptions
- ✅ Avoid test logic (no if/for statements)
- ✅ Use `beforeEach`/`afterEach` for setup/cleanup
- ❌ Don't test Express internals (trust the framework)
- ❌ Don't test JSON serialization (trust Node.js)

## Next Steps

1. **Install Jest and Supertest:** `npm install --save-dev jest supertest`
2. **Create tests/ directory:** `mkdir -p tests/unit tests/integration`
3. **Write first test:** Cover `GET /logs` endpoint
4. **Configure coverage:** Add Jest config to `package.json`
5. **Set up CI:** Add GitHub Actions workflow
6. **Aim for 80%+ coverage** before adding new features
