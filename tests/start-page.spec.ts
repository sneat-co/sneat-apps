import { test, expect } from '@playwright/test';

test.describe('Start page for new user', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('should show "Please sign in" linking to /login', async ({ page }) => {
		const signInItem = page.locator(
			'sneat-auth-menu-item ion-item[routerLink="/login"]',
		);
		await expect(signInItem).toBeVisible();
		await expect(signInItem.locator('ion-label')).toContainText(
			'Please sign in',
		);
	});

	test('should navigate to login page when clicking "Please sign in"', async ({
		page,
	}) => {
		const signInItem = page.locator(
			'sneat-auth-menu-item ion-item[routerLink="/login"]',
		);
		await signInItem.click();

		// Verify we navigated to /login
		await expect(page).toHaveURL(/\/login/);

		// Verify the login page loaded with its title
		const loginTitle = page.locator('ion-title');
		await expect(loginTitle).toContainText('Login @');

		// Verify login options are present
		await expect(page.getByText('Quick login')).toBeVisible();
		await expect(page.getByText('Login with Google')).toBeVisible();
	});
});
