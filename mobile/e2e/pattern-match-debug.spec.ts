import { test, expect } from '@playwright/test';

test.describe('Pattern Match Game - Debug', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:19006');

    // Wait for app to load
    await page.waitForTimeout(2000);

    // Click on Pattern Match game card
    await page.getByText('Padrões').click();

    // Wait for game to load
    await page.waitForTimeout(1000);
  });

  test('should show pattern and allow interaction', async ({ page }) => {
    // Listen to console logs
    page.on('console', msg => {
      console.log('BROWSER LOG:', msg.text());
    });

    // Wait for the pattern to generate
    await page.waitForTimeout(2000);

    // Take a screenshot
    await page.screenshot({ path: '/tmp/pattern-match-test.png', fullPage: true });

    // Try to find and click an answer option
    const options = page.getByRole('button');
    const optionCount = await options.count();
    console.log(`Found ${optionCount} buttons on page`);

    // Wait to observe
    await page.waitForTimeout(5000);
  });
});
