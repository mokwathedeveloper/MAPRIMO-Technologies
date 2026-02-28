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
    test('complete project lifecycle (create, view public, edit, delete)', async ({ page }) => {
      const projectTitle = `E2E Test Project ${Date.now()}`;
      const projectSlug = `e2e-test-${Date.now()}`;

      // 1. Create Project
      await page.goto('/admin/projects/new');
      await expect(page).toHaveURL(/\/admin\/projects\/new/);
      
      await expect(page.getByTestId('project-title')).toBeVisible();
      await page.getByTestId('project-title').fill(projectTitle);
      await page.getByTestId('project-slug').fill(projectSlug);
      await page.getByTestId('project-summary').fill('Automation testing project summary.');
      await page.getByTestId('project-published').check(); 
      await page.getByTestId('project-submit').click();

      // Verify creation
      await expect(page.getByText('Project created successfully')).toBeVisible();
      await expect(page).toHaveURL(/\/admin\/projects/);
      await expect(page.getByText(projectTitle)).toBeVisible();

      // 2. Verify visibility on public /work page
      await page.goto('/work');
      await expect(page.getByText(projectTitle)).toBeVisible();

      // 3. Edit Project
      await page.goto('/admin/projects');
      // Find the card with our project and click edit (Pencil icon)
      const projectCard = page.locator('.group', { hasText: projectTitle });
      await projectCard.getByTitle('Edit').click();
      
      const updatedTitle = `${projectTitle} (Updated)`;
      await page.fill('input[name="title"]', updatedTitle);
      await page.click('button[type="submit"]');

      // Verify edit
      await expect(page.getByText('Project updated successfully')).toBeVisible();
      await expect(page.getByText(updatedTitle)).toBeVisible();

      // 4. Delete Project
      await projectCard.getByRole('button', { name: /delete/i }).click();
      // Confirm dialog (assuming it uses window.confirm or a custom dialog)
      // If it's a custom dialog, we need to click the confirm button inside it.
      await page.getByRole('button', { name: 'Confirm Delete' }).click();

      // Verify deletion
      await expect(page.getByText(updatedTitle)).not.toBeVisible();
    });
  });
});
