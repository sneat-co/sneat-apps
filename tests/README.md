# Playwright Tests

This directory contains end-to-end tests using Playwright, which have been migrated from the previous Cypress tests.

## Structure

- `auth/` - Authentication tests
- `spaces/` - Space management tests
- `common/` - Shared utilities and helpers
- `global-setup.ts` - Global setup for all tests

## Running Tests

You can run the Playwright tests using the following commands:

### Using Nx (pnx/PNPM)

```bash
# Run all tests
pnx run sneat-app:e2e

# Run in development mode (chromium only)
pnx run sneat-app:e2e:development

# Run in debug mode
pnx run sneat-app:e2e:debug

# Run with UI mode
pnx run sneat-app:e2e:ui
```

### Using Playwright CLI directly

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test auth/auth.spec.ts

# Run in debug mode
npx playwright test --debug

# Run with UI mode
npx playwright test --ui
```

## Firebase Emulators

These tests require Firebase emulators to be running. Make sure to start the emulators before running the tests:

```bash
# Start Firebase emulators
firebase emulators:start
```

## Configuration

The Playwright configuration is in `playwright.config.ts` at the root of the project. It includes:

- Base URL: http://localhost:4205
- Global setup
- Timeout settings
- Browser configurations

## Migrated from Cypress

These tests were migrated from Cypress tests that were previously in:

- `/apps/sneat-app/cypress/e2e/` (removed)

The migration preserves the same test coverage while taking advantage of Playwright's features.
