import { test, expect } from '@playwright/test';

test.describe('SEO & Metadata', () => {
  test('home page should have correct SEO tags', async ({ page }) => {
    await page.goto('/');

    // Check Title
    await expect(page).toHaveTitle(/MAPRIMO Technologies/);

    // Check Meta Description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /premium|engineering|software|startups/i);

    // Check OpenGraph Tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toBeDefined();

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toBeDefined();

    // Check Canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toBeDefined();
  });

  test('robots.txt is accessible', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect(text).toContain('User-agent: *');
  });

  test('sitemap.xml is accessible', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBeTruthy();
  });
});
