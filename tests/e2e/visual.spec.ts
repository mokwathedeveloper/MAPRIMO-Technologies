import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('home page matches snapshot', async ({ page }) => {
    await page.goto('/');
    
    // Wait for fonts and animations to settle
    await page.waitForLoadState('networkidle');
    
    // Mask dynamic elements if any (e.g. timestamps, random content)
    // await page.locator('.dynamic-element').evaluateAll(els => els.forEach(el => el.style.opacity = '0'));

    await expect(page).toHaveScreenshot('home-page.png', {
      maxDiffPixelRatio: 0.1, // Allow minor rendering differences
      fullPage: true,
    });
  });
});
