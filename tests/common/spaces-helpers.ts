import { Page, expect } from '@playwright/test';

/**
 * Get the new space button
 */
export function getNewSpaceButton(page: Page) {
  return page.locator('ion-fab-button[title="Create new space"]');
}

/**
 * Assert that the new space button is visible
 */
export async function assertNewSpaceButtonIsVisible(page: Page): Promise<void> {
  await expect(getNewSpaceButton(page)).toBeVisible({ timeout: 15000 });
}

/**
 * Click the new space button
 */
export async function clickNewSpaceButton(page: Page): Promise<void> {
  await getNewSpaceButton(page).click();
}

/**
 * Get the spaces dropdown
 */
export function getSpacesDropdown(page: Page) {
  return page.locator('sneat-space-menu ion-list ion-item ion-select');
}

/**
 * Assert that the spaces dropdown is visible
 */
export async function assertSpacesDropdownIsVisible(page: Page): Promise<void> {
  // Note: Shadow DOM handling is different in Playwright
  const dropdown = getSpacesDropdown(page);
  await expect(dropdown).toBeVisible();

  // Check for text within the dropdown (may need adjustment based on actual DOM structure)
  const hasSpaceText = await dropdown.evaluate((el) => {
    const shadowRoot = el.shadowRoot;
    return shadowRoot ? shadowRoot.textContent.includes('Space') : false;
  });

  expect(hasSpaceText).toBeTruthy();
}
