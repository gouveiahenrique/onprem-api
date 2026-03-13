# Testing Standards

**Last updated:** 2026-03-13

## Testing Framework

**Current Implementation:** None configured

**Recommended:**
- **Unit Tests:** Jest (preferred for Node.js)
- **Integration Tests:** Supertest (for API endpoint testing)
- **E2E Tests:** Not applicable for simple API

### Installation

```bash
npm install --save-dev jest supertest
```

## Test Organization

**Recommended structure:**

```
tests/
├── unit/                  # Fast isolated tests (no I/O)
│   ├── controllers/      # Controller logic tests
│   ├── services/         # Business logic tests
│   └── utils/            # Utility function tests
├── integration/           # Tests with real dependencies
│   ├── api/              # API endpoint tests
│   │   └── logs.test.js
│   └── middleware/       # Middleware integration tests
└── fixtures/              # Test data and mocks
    └── logsData.js
```

**Current state:** No tests directory exists.

## Test Naming Conventions

### File Naming

```
src/controllers/logsController.js
tests/unit/controllers/logsController.test.js

src/routes/logs.js
tests/integration/api/logs.test.js
```

### Test Function Naming

```javascript
describe('GET /logs', () => {
  it('should return 200 status code', async () => {
    // test implementation
  });

  it('should return logs array with 5 entries', async () => {
    // test implementation
  });

  it('should return correct timestamp format', async () => {
    // test implementation
  });
});
```

## Test Structure (AAA Pattern)

**Arrange-Act-Assert Pattern:**

```javascript
const request = require('supertest');
const app = require('../src/app');

describe('GET /logs', () => {
  it('should return logs with success status', async () => {
    // Arrange
    const expectedCount = 5;

    // Act
    const response = await request(app)
      .get('/logs')
      .expect('Content-Type', /json/)
      .expect(200);

    // Assert
    expect(response.body.status).toBe('success');
    expect(response.body.count).toBe(expectedCount);
    expect(response.body.entries).toHaveLength(5);
  });
});
```

## Example Tests for Current API

### Integration Test for /logs Endpoint

```javascript
// tests/integration/api/logs.test.js
const request = require('supertest');
const app = require('../../../index');

describe('Logs API', () => {
  describe('GET /logs', () => {
    it('should return 200 and JSON content type', async () => {
      const response = await request(app)
        .get('/logs')
        .expect(200)
        .expect('Content-Type', /json/);
    });

    it('should return logs with correct structure', async () => {
      const response = await request(app).get('/logs');

      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('entries');
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('status');
    });

    it('should return 5 log entries', async () => {
      const response = await request(app).get('/logs');

      expect(response.body.entries).toHaveLength(5);
      expect(response.body.count).toBe(5);
    });

    it('should return entries with correct properties', async () => {
      const response = await request(app).get('/logs');
      const entry = response.body.entries[0];

      expect(entry).toHaveProperty('level');
      expect(entry).toHaveProperty('message');
      expect(entry).toHaveProperty('timestamp');
    });

    it('should return valid log levels', async () => {
      const response = await request(app).get('/logs');
      const validLevels = ['info', 'warning', 'error', 'debug'];

      response.body.entries.forEach(entry => {
        expect(validLevels).toContain(entry.level);
      });
    });

    it('should return ISO 8601 timestamp format', async () => {
      const response = await request(app).get('/logs');
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

      expect(response.body.timestamp).toMatch(isoRegex);
    });
  });

  describe('GET /', () => {
    it('should return 200 and welcome message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('Welcome to the API');
    });
  });
});
```

## Mocking Strategy

### Unit Tests

- **Mock all external dependencies** (database, HTTP, file I/O)
- **Use Jest mocks** for function and module mocking

```javascript
jest.mock('../src/services/logsService');

const logsService = require('../src/services/logsService');

test('should call logsService.getLogs', () => {
  logsService.getLogs.mockReturnValue([{ level: 'info', message: 'test' }]);

  const result = logsService.getLogs();

  expect(logsService.getLogs).toHaveBeenCalledTimes(1);
  expect(result).toHaveLength(1);
});
```

### Integration Tests

- **Use real Express app** (no mocking of framework)
- **Mock external services** (databases, third-party APIs)
- **Use test databases** if database is added

## Coverage Targets

**Recommended:**
- **Overall Coverage:** ≥80%
- **Controllers/Routes:** ≥90%
- **Services/Business Logic:** ≥90%
- **Utilities:** ≥85%

### Coverage Commands

```bash
# Run tests with coverage
npm test -- --coverage

# Run tests with coverage and open HTML report
npm test -- --coverage --coverageReporters=html
open coverage/index.html
```

### Jest Configuration (package.json)

```json
{
  "jest": {
    "testEnvironment": "node",
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
      "src/**/*.js",
      "index.js",
      "!src/**/*.test.js"
    ],
    "coverageThreshold": {
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

**Recommended GitHub Actions Workflow:**

```yaml
name: Tests

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

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Test Data Management

### Fixtures

Create reusable test data:

```javascript
// tests/fixtures/logsData.js
module.exports = {
  validLog: {
    level: 'info',
    message: 'Test log message',
    timestamp: '2025-09-30T10:00:00Z'
  },
  logsArray: [
    { level: 'info', message: 'Log 1', timestamp: '2025-09-30T10:00:00Z' },
    { level: 'warning', message: 'Log 2', timestamp: '2025-09-30T10:05:00Z' }
  ]
};
```

### Factories

For dynamic test data generation (when needed):

```javascript
const createLog = (overrides = {}) => ({
  level: 'info',
  message: 'Default message',
  timestamp: new Date().toISOString(),
  ...overrides
});
```

## Best Practices

- ✅ Tests should be fast (<100ms per test)
- ✅ Tests should be independent (can run in any order)
- ✅ One logical assertion per test (focused tests)
- ✅ Clear test names that describe what's being tested
- ✅ Avoid test logic (no if/for/while in tests)
- ✅ Use descriptive variable names in tests
- ✅ Clean up after tests (if resources are created)
- ❌ Don't test implementation details
- ❌ Don't test external libraries (trust Express works)
- ❌ Don't duplicate tests (DRY principle)

## Running Tests

**Recommended npm scripts:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration"
  }
}
```
