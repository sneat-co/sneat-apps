'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
import test_1 from '@playwright/test';
// const test_1 = require("@playwright/test");
(0, test_1.test)('has title', async ({ page }) => {
	await page.goto('https://playwright.dev/');
	// Expect a title "to contain" a substring.
	await (0, test_1.expect)(page).toHaveTitle(/Playwright/);
});
(0, test_1.test)('get started link', async ({ page }) => {
	await page.goto('https://playwright.dev/');
	// Click the get started link.
	await page.getByRole('link', { name: 'Get started' }).click();
	// Expects page to have a heading with the name of Installation.
	await (0, test_1.expect)(
		page.getByRole('heading', { name: 'Installation' }),
	).toBeVisible();
});
