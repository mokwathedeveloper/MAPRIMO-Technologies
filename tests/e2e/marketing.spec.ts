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
    const servicesLink = page.getByRole('link', { name: 'Services', exact: true });
    await servicesLink.click({ trial: true });
    await servicesLink.click();
    await expect(page).toHaveURL(/\/services/);
    await expect(page.getByText('Our Capabilities')).toBeVisible();

    // Test Work navigation
    const workLink = page.getByRole('link', { name: 'Work', exact: true });
    await workLink.click({ trial: true });
    await workLink.click();
    await expect(page).toHaveURL(/\/work/);
    await expect(page.getByText('Our Portfolio')).toBeVisible();

    // Test About navigation
    const aboutLink = page.getByRole('link', { name: 'About', exact: true });
    await aboutLink.click({ trial: true });
    await aboutLink.click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByRole('main').getByText('Our Mission', { exact: true })).toBeVisible();
  });

  test('lead form validation errors work', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill invalid email
    const emailField = page.getByTestId('lead-email');
    await emailField.fill('not-an-email');
    await emailField.blur(); // Trigger validation UI if any
    
    await page.getByTestId('lead-submit').click();
    
    // Check for validation error message from Zod or UI
    // Ensure we wait for the error to appear
    await expect(page.getByTestId('error-email').or(page.getByText(/Invalid email/i))).toBeVisible({ timeout: 10000 });
  });

  test('lead form rate limit protection works', async ({ page }) => {
    // Mock the API to return 429
    await page.route('**/api/lead', async (route) => {
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Too many requests. Please try again in 1 minute.' }),
      });
    });

    await page.goto('/contact', { waitUntil: 'networkidle' });
    
    await page.getByTestId('lead-name').fill('Spammer');
    await page.getByTestId('lead-email').fill('spam@example.com');
    await page.getByTestId('lead-message').fill('Spamming the lead form.');
    
    await page.getByTestId('lead-submit').click();
    
    // Check for rate limit error message
    await expect(page.getByText(/Too many requests/i)).toBeVisible({ timeout: 10000 });
  });

  test('lead form successful submission', async ({ page }) => {
    // Mock the API response
    await page.route('**/api/lead', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Success' }),
      });
    });

    await page.goto('/contact', { waitUntil: 'networkidle' });
    
    await page.getByTestId('lead-name').fill('QA Tester');
    await page.getByTestId('lead-email').fill('tester@example.com');
    await page.getByTestId('lead-company').fill('QA Corp');
    await page.getByTestId('lead-message').fill('This is a test message for E2E validation.');
    
    await page.getByTestId('lead-submit').click();
    
    // Check for success message using robust text or testid
    // Increased timeout for progressive loading states in the UI
    await expect(page.getByTestId('lead-success').or(page.getByText(/Protocol Completed/i))).toBeVisible({ timeout: 15000 });
  });
});
