# Testing Standards

**Last updated:** 2026-03-13

## Testing Framework

- **Current:** None configured
- **Recommended:** Jest or Mocha for Node.js testing

## Test Organization

Recommended structure (not yet implemented):

```
tests/
├── unit/                  # Fast isolated tests (no I/O)
│   ├── routes/           # Route handler tests
│   └── utils/            # Utility function tests
├── integration/           # Tests with real dependencies
│   └── api/              # Full API endpoint tests
└── e2e/                   # Full workflow tests
```

## Test Naming Conventions

### Recommended for JavaScript (Jest/Mocha)

```javascript
// File: logs.test.js
describe('GET /logs', () => {
  it('should return logs with correct structure', async () => {
    // test implementation
  });

  it('should return 200 status code', async () => {
    // test implementation
  });

  it('should include timestamp in response', async () => {
    // test implementation
  });
});
```

## Test Structure (AAA Pattern)

```javascript
describe('GET /logs', () => {
  it('should return logs array', async () => {
    // Arrange (Given)
    const request = supertest(app);

    // Act (When)
    const response = await request.get('/logs');

    // Assert (Then)
    expect(response.status).toBe(200);
    expect(response.body.entries).toBeInstanceOf(Array);
    expect(response.body.entries).toHaveLength(5);
  });
});
```

## Mocking Strategy

### Unit Tests

Currently no unit tests. Recommended approach:

```javascript
// Mock Express request/response
const mockReq = {};
const mockRes = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

// Test route handler directly
logsHandler(mockReq, mockRes);
expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
  status: 'success'
}));
```

### Integration Tests

Use `supertest` for API testing:

```javascript
const request = require('supertest');
const app = require('../index');

describe('API Integration Tests', () => {
  it('GET /logs returns valid JSON', async () => {
    const response = await request(app)
      .get('/logs')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.status).toBe('success');
  });
});
```

## Coverage Targets

Recommended (not yet enforced):
- **Overall Coverage:** ≥80%
- **Routes:** ≥90%
- **Utilities:** ≥85%
- **Critical paths:** 100%

### Coverage Commands

Recommended setup:

```bash
# Install Jest with coverage
npm install --save-dev jest

# Run tests with coverage
npm test -- --coverage

# Generate HTML report
npm test -- --coverage --coverageReporters=html
```

## CI/CD Integration

Not yet configured. Recommended:

### GitHub Actions Example

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm test -- --coverage
```

## Test Data Management

Currently uses static data in code. Recommended:

- **Fixtures:** Separate test data files (`tests/fixtures/logs.json`)
- **Factories:** Test data generation functions
- **Seeds:** Not applicable (no database)

## Best Practices

### Recommended (not yet implemented):

- ✅ Tests should be fast (<100ms per test)
- ✅ Tests should be independent (can run in any order)
- ✅ One assertion concept per test
- ✅ Clear descriptive test names
- ✅ Setup/teardown hooks for common logic
- ❌ Don't test framework code (Express internals)
- ❌ Don't test third-party libraries

## Current Gaps

- No testing framework installed
- No test files exist
- No test scripts in package.json
- No coverage reporting
- No CI/CD pipeline
- No integration tests
- No mocking utilities
- No test documentation

## Recommended Setup Steps

1. Install testing dependencies:
   ```bash
   npm install --save-dev jest supertest
   ```

2. Add test script to package.json:
   ```json
   "scripts": {
     "test": "jest",
     "test:watch": "jest --watch",
     "test:coverage": "jest --coverage"
   }
   ```

3. Create `tests/` directory with sample tests

4. Configure Jest in package.json:
   ```json
   "jest": {
     "testEnvironment": "node",
     "coveragePathIgnorePatterns": ["/node_modules/"],
     "testMatch": ["**/tests/**/*.test.js"]
   }
   ```
