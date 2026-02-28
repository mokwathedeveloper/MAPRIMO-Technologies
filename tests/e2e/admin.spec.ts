import { test, expect } from '@playwright/test';

test.describe('Admin Security & Management', () => {
  test('redirects to login if not authenticated', async ({ page }) => {
    // Attempt to access admin dashboard directly
    await page.goto('/admin');
    
    // Should be redirected to login page by the server-side guard
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText('Authorized Personnel Only')).toBeVisible();
  });

  test.describe('Admin Dashboard Features', () => {
    test('project creation flow', async ({ page }) => {
      // 1. Navigate to new project
      await page.goto('/admin/projects/new');
      
      // 2. Fill in project details
      await page.fill('input[name="title"]', 'E2E Test Project');
      await page.fill('input[name="slug"]', 'e2e-test-project');
      await page.fill('textarea[name="summary"]', 'This is an E2E test project summary.');
      
      // 3. Submit
      await page.click('button[type="submit"]');

      // 4. Verify success toast and redirection
      await expect(page.getByText('Project created successfully')).toBeVisible();
      await expect(page).toHaveURL(/\/admin\/projects/);
    });
  });
});
