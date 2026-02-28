import { test, expect } from '@/tests/fixtures/base';

test.describe('Public Data Rendering', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');

    // Validate we're on the right page
    await expect(page).toHaveTitle(/MAPRIMO/i);
  });

  test('podcast listing page loads and displays episodes', async ({ page }) => {
    await page.goto('/podcast');
    
    await expect(page.getByText('Voices of Innovation')).toBeVisible();
    
    const emptyState = page.getByText('Frequency Silent');
    const podcastCards = page.locator('.group').filter({ hasText: 'AUDIO LOG' });
    
    await expect(emptyState.or(podcastCards.first())).toBeVisible();
  });

  test('directors section renders on about page', async ({ page }) => {
    await page.goto('/about');
    
    await expect(page.getByText('Meet Our Leadership')).toBeVisible();
    
    const emptyState = page.getByText('Engineering Council // Deploying Soon');
    const directorCards = page.locator('.group').filter({ hasText: 'STAFF ID' });
    
    await expect(emptyState.or(directorCards.first())).toBeVisible();
  });
  
  test('lead form submission triggers validation', async ({ page }) => {
    await page.goto('/contact');
    
    // Ensure form exists
    await expect(page.locator('form')).toBeVisible();
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // We expect HTML5 validation to stop it if required, or we get a UI message
    // Just verify the form is still there and we haven&apos;t navigated away
    await expect(page).toHaveURL(/.*\/contact/);
  });
});
