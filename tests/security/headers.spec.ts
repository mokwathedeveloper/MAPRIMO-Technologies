import { test, expect } from '@playwright/test';

test.describe('Security Headers', () => {
  test('should have essential security headers', async ({ request }) => {
    const response = await request.get('/');
    const headers = response.headers();

    // Check for standard security headers
    // Note: Some of these might depend on the hosting environment (e.g. Vercel)
    // but we can enforce them via next.config.mjs if needed.
    
    // 1. X-Content-Type-Options
    expect(headers['x-content-type-options']).toBe('nosniff');

    // 2. X-Frame-Options (or Content-Security-Policy frame-ancestors)
    expect(headers['x-frame-options']).toBeDefined();
    
    // 3. Strict-Transport-Security (HSTS)
    // Only expect this if the test is running on HTTPS or a production-like environment
    // If it&apos;s localhost, it might not be there unless explicitly added
    if (response.url().startsWith('https://')) {
      expect(headers['strict-transport-security']).toBeDefined();
    }
  });
});
