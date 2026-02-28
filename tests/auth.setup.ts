import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Use a dedicated admin login for E2E
  // These should be set in CI secrets
  const email = process.env.E2E_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.E2E_ADMIN_PASSWORD || 'password';

  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /login|sign in/i }).click();

  // Wait for navigation to admin or dashboard
  await expect(page).toHaveURL(/\/admin/);

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
