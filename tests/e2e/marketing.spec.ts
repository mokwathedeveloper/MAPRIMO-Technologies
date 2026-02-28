import { test, expect } from '@/tests/fixtures/base';

test.describe('Marketing Site', () => {
  test('home page loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/MAPRIMO Technologies/);
    await expect(page.getByText('Full-Stack Engineering for Startups')).toBeVisible();
  });

  test('navigation works across routes', async ({ page }) => {
    await page.goto('/');
    
    // Test Services navigation
    await page.getByRole('link', { name: 'Services', exact: true }).click();
    await expect(page).toHaveURL(/\/services/);
    await expect(page.getByText('Our Capabilities')).toBeVisible();

    // Test Work navigation
    await page.getByRole('link', { name: 'Work', exact: true }).click();
    await expect(page).toHaveURL(/\/work/);
    await expect(page.getByText('Our Portfolio')).toBeVisible();

    // Test About navigation
    await page.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByRole('main').getByText('Our Mission', { exact: true })).toBeVisible();
  });

  test('lead form validation errors work', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill invalid email
    await page.getByTestId('lead-email').fill('not-an-email');
    await page.getByTestId('lead-submit').click();
    
    // Check for validation error message from Zod
    await expect(page.getByTestId('error-email')).toContainText('Invalid email address');
  });

  test('lead form rate limit protection works', async ({ page }) => {
    // Mock the API to return 429
    await page.route('**/api/lead', async route => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Too many requests. Please try again in 1 minute.' }),
      });
    });

    await page.goto('/contact');
    
    await page.getByTestId('lead-name').fill('Spammer');
    await page.getByTestId('lead-email').fill('spam@example.com');
    await page.getByTestId('lead-message').fill('Spamming the lead form.');
    
    await page.getByTestId('lead-submit').click();
    
    // Check for rate limit error message
    await expect(page.getByText('Too many requests')).toBeVisible();
  });

  test('lead form successful submission', async ({ page }) => {
    // We can mock the API response if we don&apos;t want to hit the real DB
    await page.route('**/api/lead', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Success' }),
      });
    });

    await page.goto('/contact');
    
    await page.getByTestId('lead-name').fill('QA Tester');
    await page.getByTestId('lead-email').fill('tester@example.com');
    await page.getByTestId('lead-company').fill('QA Corp');
    await page.getByTestId('lead-message').fill('This is a test message for E2E validation.');
    
    await page.getByTestId('lead-submit').click();
    
    // Check for success message
    await expect(page.getByTestId('lead-success')).toBeVisible();
    await expect(page.getByText('Protocol Completed')).toBeVisible();
  });
});
