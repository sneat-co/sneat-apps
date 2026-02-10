import { test, expect } from '@playwright/test';
import { MOCK_USER_EMAIL, MOCK_USER_PASS } from '../common/fixtures';
import {
	createUser,
	deleteAllAuthUsers,
	initializeFirebaseEmulators,
	loginViaUI,
	signUpViaUI,
	isAuthEmulatorAvailable,
} from '../common/firebase-helpers';

test.describe.skip('Email Auth', () => {
	test.beforeAll(async () => {
		const available = await isAuthEmulatorAvailable();
		test.skip(
			!available,
			'Auth emulator is not available, skipping auth tests.',
		);
	});
	test.beforeEach(async ({ page }) => {
		// Try to reset users if emulator is available, ignore otherwise
		await deleteAllAuthUsers();
		await page.goto('/');
	});

	test('should sign up new user', async ({ page }) => {
		// Sign up a new user via UI
		await signUpViaUI(page, MOCK_USER_EMAIL, 'Test', 'Name');

		// Verify sign-in button is no longer visible (user is signed in)
		await expect(
			page.locator(
				'sneat-auth-menu-item ion-item ion-label:has-text("Please sign in")',
			),
		).not.toBeVisible();
	});

	test.describe('Sign In/Out', () => {
		test.beforeAll(async () => {
			await initializeFirebaseEmulators();
		});

		test('should sign user in', async ({ page }) => {
			await createUser(MOCK_USER_EMAIL, MOCK_USER_PASS);
			await page.goto('/');

			// Now sign in
			await loginViaUI(page, MOCK_USER_EMAIL, MOCK_USER_PASS);

			// Verify sign-in button is no longer visible
			await expect(
				page.locator(
					'sneat-auth-menu-item ion-item ion-label:has-text("Please sign in")',
				),
			).not.toBeVisible();

			// Verify new space button is visible
			await expect(
				page.locator('ion-fab-button[title="Create new space"]'),
			).toBeVisible();
		});

		test('should user sign out', async ({ page }) => {
			await createUser(MOCK_USER_EMAIL, MOCK_USER_PASS);
			await page.goto('/');

			// Sign in
			await loginViaUI(page, MOCK_USER_EMAIL, MOCK_USER_PASS);

			// Verify new space button is visible
			await expect(
				page.locator('ion-fab-button[title="Create new space"]'),
			).toBeVisible();

			// Sign out
			await page.locator('ion-button[title="Sign-out"]').click();

			// Verify sign-in button is visible again
			await expect(
				page.locator(
					'sneat-auth-menu-item ion-item ion-label:has-text("Please sign in")',
				),
			).toBeVisible();
		});
	});
});
