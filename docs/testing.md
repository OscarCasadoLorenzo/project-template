# Testing Guide

This document explains the testing setup for the Project Template monorepo, including how to run tests, view coverage reports, and add tests to new packages.

## Table of Contents

- [Overview](#overview)
- [Folder Structure](#folder-structure)
- [Running Tests](#running-tests)
- [Coverage Reports](#coverage-reports)
- [Adding Tests to New Packages](#adding-tests-to-new-packages)
- [Writing Tests](#writing-tests)
- [CI Integration](#ci-integration)
- [Troubleshooting](#troubleshooting)

## Overview

The Project Template uses a unified testing workflow across the entire monorepo:

- **Testing Framework**: Jest
- **React Testing**: React Testing Library
- **Coverage Tool**: Istanbul
- **Build System**: Turborepo (with caching)

Each workspace (apps and packages) runs tests independently, generating its own coverage report. These reports are then merged into a single global coverage report at the root level.

## Folder Structure

```
project-template/
├── apps/
│   ├── frontend/                    # Next.js app
│   │   ├── coverage/                # Frontend coverage output
│   │   ├── jest.config.js          # Frontend Jest config
│   │   ├── jest.setup.js           # Frontend test setup
│   │   └── **/*.test.tsx           # Test files co-located with source
│   │
│   └── backend-rest/               # NestJS app
│       ├── coverage/               # Backend coverage output
│       ├── package.json            # Jest config inline
│       └── src/**/*.spec.ts        # Test files co-located with source
│
├── packages/
│   └── ui/                         # Shared UI components
│       ├── coverage/               # UI package coverage output
│       ├── jest.config.js         # UI Jest config
│       ├── jest.setup.js          # UI test setup
│       └── src/**/*.test.tsx      # Test files co-located with source
│
├── coverage/                       # MERGED global coverage (root)
│   ├── coverage-final.json        # Merged coverage data
│   ├── lcov.info                  # LCOV format for CI
│   └── index.html                 # HTML report
│
├── scripts/
│   └── merge-coverage.ts          # Coverage merge script (TypeScript)
│
└── turbo.json                     # Turborepo pipeline config
```

## Running Tests

### Run All Tests

From the root of the monorepo:

```bash
npm run test
```

This runs tests in all workspaces using Turborepo's parallel execution and caching.

### Run Tests for a Specific Workspace

#### Frontend (Next.js)

```bash
cd apps/frontend
npm run test
```

#### Backend (NestJS)

```bash
cd apps/backend-rest
npm run test
```

#### UI Package

```bash
cd packages/ui
npm run test
```

### Watch Mode

Run tests in watch mode for active development:

```bash
# Frontend
cd apps/frontend
npm run test:watch

# Backend
cd apps/backend-rest
npm run test:watch

# UI
cd packages/ui
npm run test:watch
```

### Generate Coverage

Generate coverage for a specific workspace:

```bash
# Frontend
cd apps/frontend
npm run test:coverage

# Backend
cd apps/backend-rest
npm run test:cov

# UI
cd packages/ui
npm run test:coverage
```

### Generate Global Merged Coverage

From the root:

```bash
npm run coverage
```

This will:

1. Run tests in all workspaces
2. Collect individual coverage reports
3. Merge them into a global report at `/coverage/`

## Coverage Reports

### Viewing Coverage Reports

#### Individual Workspace Coverage

Each workspace generates its own HTML coverage report:

```bash
# Frontend
open apps/frontend/coverage/index.html

# Backend
open apps/backend-rest/coverage/index.html

# UI
open packages/ui/coverage/index.html
```

#### Global Merged Coverage

After running `npm run coverage`:

```bash
open coverage/index.html
```

### Coverage Formats

Each workspace outputs coverage in multiple formats:

- **JSON** (`coverage-final.json`) - Raw coverage data
- **LCOV** (`lcov.info`) - For CI tools like Codecov, Coveralls
- **HTML** (`index.html`) - Interactive browser report
- **Text** - Console summary (during test run)

### Coverage Thresholds

Currently, no minimum coverage thresholds are enforced. To add thresholds, update the Jest config in each workspace:

```javascript
// jest.config.js
module.exports = {
  // ... other config
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## Adding Tests to New Packages

When adding a new package or app to the monorepo, follow these steps:

### 1. Install Dependencies

Add Jest and related dependencies to the new package's `package.json`:

```json
{
  "devDependencies": {
    "@types/jest": "^29.5.11",
    "jest": "^29.7.0",
    // For React components:
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "jest-environment-jsdom": "^29.7.0",
    // For Node.js/NestJS:
    "ts-jest": "^29.1.0"
  }
}
```

### 2. Create Jest Configuration

#### For React/Frontend Packages

Create `jest.config.js`:

```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "html"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/*.spec.{ts,tsx}",
    "!src/**/*.stories.tsx",
  ],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
};
```

Create `jest.setup.js`:

```javascript
import "@testing-library/jest-dom";
```

#### For Node.js/Backend Packages

Add to `package.json`:

```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverage": true,
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageReporters": ["json", "lcov", "text", "html"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

### 3. Add Test Scripts

Add to the package's `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 4. Update Coverage Merge Script

Add the new workspace to `scripts/merge-coverage.cjs`:

```javascript
const WORKSPACES = [
  "apps/frontend",
  "apps/backend-rest",
  "packages/ui",
  "apps/your-new-package", // Add here
];
```

### 5. Verify Turbo Pipeline

The `turbo.json` already includes the test task, so no changes are needed there. Turborepo will automatically detect and run tests in your new package.

## Writing Tests

### Frontend Component Tests

```typescript
// components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={onClick}>Click me</Button>)
    await user.click(screen.getByText('Click me'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
```

### Backend Service Tests

```typescript
// services/user.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";

describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a user", async () => {
    const user = await service.create({ name: "Test User" });
    expect(user).toHaveProperty("id");
    expect(user.name).toBe("Test User");
  });
});
```

### Hook Tests

```typescript
// hooks/useCounter.test.ts
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("should increment counter", () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

## CI Integration

### GitHub Actions Example

Add to `.github/workflows/test.yml`:

```yaml
name: Test & Coverage

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm install

      - name: Run tests and generate coverage
        run: npm run coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

      - name: Upload coverage artifact
        uses: actions/upload-artifact@v3
        with:
          name: coverage-report
          path: coverage/
```

### Netlify/Render Integration

The coverage merge script is compatible with most CI/CD platforms:

```bash
# Build command
npm install && npm run build

# Test command (optional pre-deploy check)
npm run coverage
```

## Troubleshooting

### Tests Not Found

**Issue**: "No tests found" error when running tests.

**Solution**:

- Check that test files match the configured pattern (`*.test.ts`, `*.spec.ts`, etc.)
- Verify the `testMatch` or `testRegex` in your Jest config
- Ensure test files are not in ignored directories

### Coverage Merge Fails

**Issue**: `merge-coverage.ts` fails to find coverage files.

**Solution**:

- Run tests first: `npm run test`
- Check that each workspace has a `coverage/coverage-final.json`
- Verify workspace paths in `scripts/merge-coverage.ts`

### Module Resolution Errors

**Issue**: Jest can't resolve imports like `@/components/...`

**Solution**:

- Check `moduleNameMapper` in `jest.config.js`
- Ensure paths match your `tsconfig.json` paths
- For Next.js, use `next/jest` preset

### React Testing Library Issues

**Issue**: `ReferenceError: document is not defined`

**Solution**:

- Ensure `testEnvironment: 'jsdom'` in Jest config
- Install `jest-environment-jsdom` package
- Check that `jest.setup.js` imports `@testing-library/jest-dom`

### Turborepo Cache Issues

**Issue**: Tests show cached results when code has changed.

**Solution**:

```bash
# Clear Turborepo cache
npx turbo run test --force

# Or clear all caches
npm run clean
```

### TypeScript Compilation Errors in Tests

**Issue**: TypeScript errors in test files.

**Solution**:

- Ensure `@types/jest` is installed
- Add `jest` to `types` in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["jest", "node"]
  }
}
```

## Best Practices

1. **Write tests alongside code** - Place test files next to the source files they test (e.g., `Button.tsx` → `Button.test.tsx`)
2. **Follow AAA pattern** - Arrange, Act, Assert
3. **Test behavior, not implementation** - Focus on what the code does, not how
4. **Use descriptive test names** - Make failures easy to understand
5. **Keep tests fast** - Mock external dependencies
6. **Aim for meaningful coverage** - 100% coverage ≠ 100% quality
7. **Run tests before committing** - Use git hooks (Husky) if needed
8. **Review coverage reports** - Identify untested edge cases
9. **Use consistent naming** - `*.test.ts` for unit tests, `*.spec.ts` for integration tests

## Additional Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Turborepo Testing Guide](https://turbo.build/repo/docs/crafting-your-repository/running-tasks#testing)
- [Istanbul Coverage](https://istanbul.js.org/)

---

**Last Updated**: November 16, 2025
