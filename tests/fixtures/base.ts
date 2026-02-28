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

    // Disable animations and transitions for more stable tests
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
          animation-duration: 0s !important;
          transition-duration: 0s !important;
        }
      `;
      document.head.appendChild(style);
    });

    await use(errors);

    // After the test, verify no console errors occurred
    expect(errors, `Expected no console errors, but found: \n${errors.join('\n')}`).toHaveLength(0);
  },
});

export { expect };
