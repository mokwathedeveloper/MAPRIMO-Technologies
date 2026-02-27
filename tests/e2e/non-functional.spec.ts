import { test, expect } from '@playwright/test';

test.describe('Non-functional Tests', () => {
  test('essential SEO metadata exists', async ({ page }) => {
    const routes = ['/', '/services', '/work', '/blog', '/about', '/contact'];
    
    for (const route of routes) {
      await page.goto(route);
      
      // Check title
      await expect(page).toHaveTitle(/MAPRIMO/);
      
      // Check description meta tag
      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute('content', /.+/);
      
      // Check Open Graph tags
      const ogTitle = page.locator('meta[property="og:title"]');
      if (await ogTitle.count() > 0) {
        await expect(ogTitle).toHaveAttribute('content', /.+/);
      }
    }
  });

  test('no critical console errors on home page', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');
    
    // Ignore Supabase auth warning as it's common in development
    const criticalErrors = errors.filter(err => !err.includes('supabase.auth.getSession'));
    
    expect(criticalErrors).toEqual([]);
  });
});
