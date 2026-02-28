import { test, expect } from '@/tests/fixtures/base';

test.describe('SEO & Metadata', () => {
  const routes = ['/', '/services', '/work', '/blog', '/about', '/contact'];

  test('should have essential SEO tags on all key pages', async ({ page }) => {
    for (const route of routes) {
      await page.goto(route);

      // Check Title
      await expect(page).toHaveTitle(/MAPRIMO Technologies/);

      // Check Meta Description
      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveAttribute('content', /.+/i);

      // Check Canonical URL
      const canonical = page.locator('link[rel="canonical"]');
      if (await canonical.count() > 0) {
        await expect(canonical).toHaveAttribute('href', /.+/);
      }
    }
  });

  test('home page should have specific keywords', async ({ page }) => {
    await page.goto('/');
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /premium|engineering|software|startups/i);
  });

  test('robots.txt is accessible', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect(text.toLowerCase()).toContain('user-agent: *');
  });

  test('sitemap.xml is accessible', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBeTruthy();
  });
});
