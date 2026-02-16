import { FullConfig } from '@playwright/test';
import { initializeFirebaseEmulators } from './common/firebase-helpers';

/**
 * Global setup function that runs before all tests
 *
 * This is used to set up the Firebase emulators and other global state
 * that should be initialized once before all tests run.
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  // Initialize Firebase emulators
  await initializeFirebaseEmulators();
}

export default globalSetup;
