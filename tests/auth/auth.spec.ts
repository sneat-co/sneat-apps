import { test, expect } from '@playwright/test';
import { MOCK_USER_EMAIL, MOCK_USER_PASS } from '../common/fixtures';
import {
	deleteAllAuthUsers,
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
		test('should sign user in', async ({ page }) => {
			await page.goto('/');

			// Ensure user exists by signing up via UI first (idempotent for our demo environment)
			await signUpViaUI(page, MOCK_USER_EMAIL, 'Test', 'Name');

			// Sign out to test sign-in flow
			await page.locator('ion-button[title="Sign-out"]').click();
			await expect(
				page.locator(
					'sneat-auth-menu-item ion-item ion-label:has-text("Please sign in")',
				),
			).toBeVisible();

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
			await page.goto('/');

			// Ensure user exists and is signed in
			await signUpViaUI(page, MOCK_USER_EMAIL, 'Test', 'Name');

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
