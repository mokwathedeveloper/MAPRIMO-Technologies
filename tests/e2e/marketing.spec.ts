import { test, expect } from '@playwright/test';

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
    await expect(page.getByText('Our Mission')).toBeVisible();
  });

  test('lead form validation works', async ({ page }) => {
    await page.goto('/contact');
    
    // Submit empty form
    await page.getByTestId('lead-submit').click();
    
    // Check for standard browser validation or our custom errors
    // Since we use 'required' attribute, browser might stop it, but let's check our field errors if any
    const emailInput = page.getByTestId('lead-email');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('lead form successful submission', async ({ page }) => {
    // We can mock the API response if we don't want to hit the real DB
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
    await expect(page.getByText('Transmission successful')).toBeVisible();
  });
});
