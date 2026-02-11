# Playwright E2E Tests

This directory contains end-to-end tests for the Sneat application using Playwright, which have been migrated from the previous Cypress tests.

## Test Structure

- `tests/start-page.spec.ts` - Tests for the start/landing page (no Firebase required)
- `tests/auth/` - Authentication flow tests (requires Firebase emulators)
- `tests/spaces/` - Space management tests (requires Firebase emulators + backend)
- `tests/commune/` - Commune setup tests (WIP, currently skipped)
- `tests/common/` - Shared test utilities and helpers
- `global-setup.ts` - Global setup that runs before all tests

## Running Tests

### Prerequisites

1. **Node.js and pnpm** - Ensure you have the correct versions installed
2. **Playwright browsers** - Install with:
   ```bash
   pnpm exec playwright install chromium
   ```
3. **Java 21+** - Required for Firebase emulators (if running auth/space tests)
   ```bash
   java -version  # Should be 21 or higher
   ```

### Using Nx (Recommended)

```bash
# Run all tests
pnpm nx run sneat-app:e2e

# Run in development mode (chromium only)
pnpm nx run sneat-app:e2e:development

# Run in debug mode
pnpm nx run sneat-app:e2e:debug

# Run with UI mode
pnpm nx run sneat-app:e2e:ui
```

### Using Playwright CLI Directly

```bash
# Run all tests
pnpm playwright test

# Run specific test file
pnpm playwright test tests/start-page.spec.ts

# Run in debug mode
pnpm playwright test --debug

# Run with UI mode
pnpm playwright test --ui
```

## Test Categories

### Tests Without External Dependencies ✅

These tests run without requiring Firebase emulators or backend services:

- Start page tests (2 tests) - Verify basic UI navigation and authentication prompts

### Tests Requiring Firebase Emulators 🔄

These tests require Firebase Authentication and Firestore emulators:

- Auth tests (3 tests) - Sign up, sign in, and sign out flows

### Tests Requiring Backend Server 🔄

These tests require the backend server (port 4300):

- Space setup tests (2 tests) - Space creation workflow

Tests will check for availability of required services and gracefully skip if not available.

## Running Tests with Firebase Emulators and Backend

Firebase emulators and the backend server are now enabled by default in `playwright.config.ts`. When you run the tests, all required services will automatically start:

### Prerequisites

1. **Java 21+** - Required for Firebase emulators

   ```bash
   java -version  # Should be 21 or higher
   ```

2. **Firebase Tools** - Should be installed via npm dependencies

3. **Backend Server** - Automatically handled:
   - In GitHub Actions: Runs `./sneat-server` binary
   - Locally: Expects `sneat-go-server` repo in sibling directory

### Running All Tests

```bash
# Run all tests (all services start automatically)
pnpm playwright test
```

The following services will start automatically:

- **Firebase emulators** on ports 9099 (Auth) and 8080 (Firestore)
- **Backend server** on port 4300
- **App server** on port 4205

### Local Development

If you want to run tests without all services (some tests will skip):

1. **Comment out Firebase emulator config** in `playwright.config.ts`

2. **Run tests**:
   ```bash
   pnpm playwright test
   ```

### Alternative: Manual Emulator Setup

```bash
# Terminal 1: Start Firebase emulators manually
firebase emulators:start --only auth,firestore --project demo-sneat-app --config ./firebase/firebase-ci.json

# Terminal 2: Run tests (with emulator config commented out)
pnpm playwright test
```

## Configuration

- `playwright.config.ts` - Main Playwright configuration
  - Base URL: http://localhost:4205
  - Global setup
  - Timeout settings (120s for webServer, 10s for actions)
  - Browser configurations (currently Chromium only)
  - WebServer auto-start for app and emulators
- `tests/global-setup.ts` - Global setup that runs before all tests
- `firebase/firebase-ci.json` - Firebase emulator configuration

## Test Utilities

### Firebase Helpers (`tests/common/firebase-helpers.ts`)

- `initializeFirebaseEmulators()` - Initialize Firebase emulator connection
- `isAuthEmulatorAvailable()` - Check if auth emulator is running
- `deleteAllAuthUsers()` - Clear all users from auth emulator
- `createUser()` - Create a test user programmatically
- `loginViaUI()` - Sign in via the application UI
- `signUpViaUI()` - Sign up via the application UI

### Space Helpers (`tests/common/spaces-helpers.ts`)

- Helpers for space-related UI interactions

### Fixtures (`tests/common/fixtures.ts`)

- Test data constants (test emails, Firebase config, etc.)

## Current Status

With Firebase emulators and backend server enabled (default):

- ✅ **7 tests total** - All tests can run with full services
  - 2 start-page tests (work without external dependencies)
  - 3 auth tests (require Firebase emulators)
  - 2 space tests (require Firebase emulators + backend server)
- ❌ **0 tests failing** - No broken tests

Tests will automatically skip if required services fail to start (e.g., Java not installed, backend not available).

## Troubleshooting

### "Executable doesn't exist" Error

Install Playwright browsers:

```bash
pnpm exec playwright install chromium
```

### Firebase Emulator Connection Issues

1. Verify Java 21+ is installed: `java -version`
2. Check if emulator ports (9099, 8080) are available
3. Review Firebase emulator logs for errors
4. In some environments, Firebase emulator downloads may be blocked - tests will skip gracefully

### Test Timeouts

Increase timeout in test or playwright config:

```typescript
test.setTimeout(60000); // 60 seconds
```

### Port Already in Use

If ports 4205, 9099, or 8080 are in use:

```bash
# Find and kill process using the port
lsof -ti:4205 | xargs kill -9
lsof -ti:9099 | xargs kill -9
```

## Migration Notes

These tests were migrated from Cypress tests that were previously in `/apps/sneat-app/cypress/e2e/`. The migration preserves the same test coverage while taking advantage of Playwright's features:

- Better TypeScript support
- Faster execution
- Better debugging tools
- More reliable selectors
