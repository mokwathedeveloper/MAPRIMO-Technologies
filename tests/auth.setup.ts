import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Ensure the directory for the auth file exists
  if (!fs.existsSync(path.dirname(authFile))) {
    fs.mkdirSync(path.dirname(authFile), { recursive: true });
  }

  // Increase timeout for CI environment
  setup.setTimeout(90_000);

  // Use a dedicated admin login for E2E
  // These should be set in CI secrets
  const email = process.env.E2E_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.E2E_ADMIN_PASSWORD || 'password';

  await page.goto('/login', { waitUntil: 'networkidle' });
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();

  // Wait for navigation to admin or dashboard
  try {
    await expect(page).toHaveURL(/\/admin/, { timeout: 30_000 });
  } catch (error) {
    const errorMsg = await page.locator('.p-4.rounded-xl.bg-red-500\\/10').textContent().catch(() => 'No visible error message');
    throw new Error(`Authentication failed. Current URL: ${page.url()}. Error on page: ${errorMsg}. Details: ${error}`);
  }

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
