import { test as base, expect } from '@playwright/test';

export const test = base.extend<{
  consoleErrors: string[];
}>({
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        // Filter out known/acceptable errors if any
        if (!msg.text().includes('Warning: ')) {
          errors.push(msg.text());
        }
      }
    });
    page.on('pageerror', err => {
      errors.push(err.message);
    });

    await use(errors);

    // After the test, verify no console errors occurred
    expect(errors, `Expected no console errors, but found: 
${errors.join('
')}`).toHaveLength(0);
  },
});

export { expect };
