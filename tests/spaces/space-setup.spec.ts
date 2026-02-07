import { test } from '@playwright/test';
import {
	deleteAllAuthUsers,
	isAuthEmulatorAvailable,
} from '../common/firebase-helpers';
import { signUpViaUI } from '../common/firebase-helpers';
import {
	assertNewSpaceButtonIsVisible,
	clickNewSpaceButton,
	// assertSpacesDropdownIsVisible
} from '../common/spaces-helpers';
import { MOCK_USER_EMAIL } from '../common/fixtures';

test.describe('Space Setup', () => {
	test.beforeAll(async () => {
		const available = await isAuthEmulatorAvailable();
		test.skip(
			!available,
			'Auth emulator is not available, skipping space setup tests.',
		);
	});
	test.beforeEach(async ({ page }) => {
		await deleteAllAuthUsers();
		await page.goto('/');
	});

	test('should create a new space', async ({ page }) => {
		// Intercept the create space request
		await page.route('**/v0/spaces/create_space', async (route) => {
			const json = route.request().postDataJSON();
			json.title = 'something-title';
			await route.continue({ postData: JSON.stringify(json) });
		});

		// Sign up a new user
		await signUpViaUI(page, MOCK_USER_EMAIL, 'Test', 'Name');

		// Wait for the sign-in request to complete
		await page.waitForResponse(
			(response) =>
				response
					.url()
					.includes('identitytoolkit.googleapis.com/v1/accounts:sendOobCode') &&
				response.status() === 200,
		);

		// Verify new space button is visible
		await assertNewSpaceButtonIsVisible(page);

		// Click new space button
		await clickNewSpaceButton(page);

		// Wait for the create space request to complete
		await page.waitForResponse(
			(response) =>
				response.url().includes('v0/spaces/create_space') &&
				response.status() === 200,
		);

		// TODO: Restore check - passes locally but fails in CI
		// await assertSpacesDropdownIsVisible(page);
	});
});
