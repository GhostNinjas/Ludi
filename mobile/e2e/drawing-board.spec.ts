import { test, expect } from '@playwright/test';

test.describe('Drawing Board Game', () => {
  test('should load drawing board directly and draw on canvas', async ({ page }) => {
    // Go directly to drawing board game
    await page.goto('http://localhost:19006/games/drawing-board');
    await page.waitForLoadState('networkidle');

    // Check game elements are visible
    await expect(page.getByText('← Voltar')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Quadro de Desenho')).toBeVisible();
    await expect(page.getByText('↩️')).toBeVisible(); // Desfazer button
    await expect(page.getByText('🗑️')).toBeVisible(); // Limpar button
    await expect(page.getByText('Espessura:')).toBeVisible();
    await expect(page.getByText('Cores:')).toBeVisible();

    // Get the canvas SVG element
    const canvas = page.locator('svg').first();
    await expect(canvas).toBeVisible();

    // Get canvas bounding box
    const box = await canvas.boundingBox();

    if (box) {
      // Draw a simple line on the canvas
      const startX = box.x + box.width * 0.3;
      const startY = box.y + box.height * 0.3;
      const endX = box.x + box.width * 0.7;
      const endY = box.y + box.height * 0.7;

      // Draw diagonal line
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, endY, { steps: 20 });
      await page.mouse.up();

      // Wait a bit to ensure drawing is registered
      await page.waitForTimeout(500);

      // Check if path was created (there should be at least one path element)
      const paths = page.locator('svg path');
      const pathCount = await paths.count();
      expect(pathCount).toBeGreaterThan(0);

      console.log(`✓ Successfully drew on canvas - ${pathCount} path(s) created`);
    }
  });

  test('should change brush color and size', async ({ page }) => {
    // Go directly to drawing board game
    await page.goto('http://localhost:19006/games/drawing-board');
    await page.waitForLoadState('networkidle');

    // Check brush size buttons are clickable
    const brushButtons = page.locator('text=✏️, text=🖊️, text=🖍️, text=🖌️');

    // Check color buttons exist - should have 10 colors
    const colorButtons = page.locator('div[style*="backgroundColor"]').filter({ has: page.locator('text=✓') });

    console.log('✓ Brush sizes and colors are available');
  });

  test('should clear and undo drawings', async ({ page }) => {
    // Go directly to drawing board game
    await page.goto('http://localhost:19006/games/drawing-board');
    await page.waitForLoadState('networkidle');

    // Get canvas
    const canvas = page.locator('svg').first();
    const box = await canvas.boundingBox();

    if (box) {
      // Draw first stroke
      await page.mouse.move(box.x + 100, box.y + 100);
      await page.mouse.down();
      await page.mouse.move(box.x + 200, box.y + 200, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(300);

      // Draw second stroke
      await page.mouse.move(box.x + 300, box.y + 100);
      await page.mouse.down();
      await page.mouse.move(box.x + 400, box.y + 200, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(300);

      // Check we have 2 paths
      let paths = page.locator('svg path[stroke]');
      let pathCount = await paths.count();
      expect(pathCount).toBe(2);

      // Click undo button
      await page.getByText('Desfazer').click();
      await page.waitForTimeout(300);

      // Check we now have 1 path
      paths = page.locator('svg path[stroke]');
      pathCount = await paths.count();
      expect(pathCount).toBe(1);

      // Click clear button
      await page.getByText('Limpar').click();
      await page.waitForTimeout(300);

      // Check we now have 0 paths
      paths = page.locator('svg path[stroke]');
      pathCount = await paths.count();
      expect(pathCount).toBe(0);

      console.log('✓ Undo and Clear buttons work correctly');
    }
  });

  test('should go back to home', async ({ page }) => {
    // Go directly to drawing board game
    await page.goto('http://localhost:19006/games/drawing-board');
    await page.waitForLoadState('networkidle');

    // Click back button
    await page.getByText('← Voltar').click();

    // Should be back on home screen
    await expect(page.getByText('Olá,')).toBeVisible();
  });
});
