# Testing Standards

**Last updated:** 2026-05-25

## Current State

No test framework is configured. The `package.json` test script is the npm placeholder:

```json
"test": "echo \"Error: no test specified\" && exit 1"
```

No test files, test directories, or coverage tooling exist in the project.

## Recommended Setup

Given the project is a minimal Express 5 API in CommonJS JavaScript, the following stack fits with zero transpilation:

| Tool | Purpose |
|------|---------|
| [Jest](https://jestjs.io/) 29+ | Test runner and assertion library |
| [supertest](https://github.com/ladjs/supertest) 7+ | HTTP integration testing against Express app |

Install:
```bash
npm install --save-dev jest supertest
```

Update `package.json`:
```json
"scripts": {
  "test": "jest",
  "test:coverage": "jest --coverage"
}
```

## Test Organization

```
tests/
├── unit/               # Pure function tests (no HTTP, no I/O)
└── integration/        # Express route tests via supertest
```

## Test Naming Conventions

- **Files:** `<subject>.test.js` (e.g., `logs.test.js`, `app.test.js`)
- **Describe blocks:** name the module or route under test
- **Test names:** plain English describing the behavior (`"returns 200 with log entries"`)

Example:
```javascript
// tests/integration/logs.test.js
const request = require('supertest');
const app = require('../../index');  // export app without calling listen()

describe('GET /logs', () => {
  it('returns 200 with log entries', async () => {
    const res = await request(app).get('/logs');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.entries).toHaveLength(5);
  });

  it('returns entries with required fields', async () => {
    const res = await request(app).get('/logs');
    res.body.entries.forEach(entry => {
      expect(entry).toHaveProperty('level');
      expect(entry).toHaveProperty('message');
      expect(entry).toHaveProperty('timestamp');
    });
  });
});
```

## Test Structure (AAA Pattern)

```javascript
it('description of expected behavior', async () => {
  // Arrange — set up input data or mocks

  // Act — call the function or make the HTTP request
  const res = await request(app).get('/logs');

  // Assert — verify the outcome
  expect(res.status).toBe(200);
});
```

## Mocking Strategy

**Unit tests** — mock all I/O (filesystem, database, external HTTP). Use Jest's built-in `jest.mock()` and `jest.fn()`.

**Integration tests** — test the full Express request/response cycle via supertest. No external services to mock currently (all data is static).

## Coverage Targets

| Area | Target |
|------|--------|
| Route handlers | 100% (small surface) |
| Overall | ≥80% |

Run with coverage:
```bash
npm run test:coverage
# Generates coverage/ directory with HTML report
```

## Prerequisite: Export the App

For supertest to work, `index.js` must export the `app` object separately from calling `listen`. Recommended pattern:

```javascript
// index.js
const express = require('express');
const app = express();

// ... middleware and routes ...

module.exports = app;  // add this export

if (require.main === module) {
  app.listen(3000, () => console.log('Running on port 3000'));
}
```

This allows tests to import the app without starting the server.

## CI/CD Integration

Not configured. When adding CI (e.g., GitHub Actions):

```yaml
- name: Install dependencies
  run: npm ci

- name: Run tests
  run: npm test
```
