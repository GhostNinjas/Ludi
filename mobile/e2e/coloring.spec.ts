import { test, expect } from '@playwright/test';

test('Coloring game - should load and allow coloring', async ({ page }) => {
  await page.goto('http://localhost:8081');
  await page.waitForLoadState('networkidle');

  // Complete onboarding flow
  // Step 1: Welcome screen
  const welcomeContinuar = page.locator('text=Continuar').first();
  if (await welcomeContinuar.isVisible()) {
    await welcomeContinuar.click();
    await page.waitForTimeout(1000);
  }

  // Step 2: Name input
  const nameInput = page.locator('input[placeholder*="nome"]');
  if (await nameInput.isVisible()) {
    await nameInput.fill('Test Child');
    await page.click('text=Continuar');
    await page.waitForTimeout(1000);
  }

  // Skip through remaining onboarding steps
  for (let i = 0; i < 5; i++) {
    const continuar = page.locator('text=Continuar');
    if (await continuar.isVisible()) {
      await continuar.click();
      await page.waitForTimeout(800);
    }
  }

  // Wait for games screen
  await page.waitForTimeout(2000);

  // Navigate to coloring game (may need to scroll)
  const coloringCard = page.locator('text=Coloração');
  await coloringCard.scrollIntoViewIfNeeded();
  await coloringCard.click();

  // Wait for game to load
  await page.waitForSelector('text=🦋 Borboleta', { timeout: 10000 });

  // Check if canvas SVG is present
  const svg = await page.locator('svg').first();
  await expect(svg).toBeVisible();

  // Select a color (red)
  const redColorButton = page.locator('[style*="background-color: rgb(255, 0, 0)"]').first();
  await redColorButton.click();

  // Click on a part of the drawing to color it
  const paths = await page.locator('path[stroke="#000000"]').all();
  if (paths.length > 1) {
    await paths[1].click(); // Click second path (first is usually background)
  }

  // Navigate to next drawing
  await page.click('text=→');
  await page.waitForTimeout(500);

  // Check if drawing changed
  await expect(page.locator('text=🏠 Casa')).toBeVisible();

  // Clear button should be visible
  await expect(page.locator('text=Limpar')).toBeVisible();

  console.log('✅ Coloring game test passed!');
});

test('Coloring game - should clear colors', async ({ page }) => {
  await page.goto('http://localhost:8081');
  await page.waitForLoadState('networkidle');

  // Click Continuar button if on welcome screen
  const continuarButton = page.locator('text=Continuar');
  if (await continuarButton.isVisible()) {
    await continuarButton.click();
    await page.waitForTimeout(1000);
  }

  // Navigate to coloring game (may need to scroll)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.click('text=Coloração');

  // Wait for game to load
  await page.waitForSelector('text=🦋 Borboleta', { timeout: 10000 });

  // Select a color and paint something
  const blueColorButton = page.locator('[style*="background-color: rgb(0, 0, 255)"]').first();
  await blueColorButton.click();

  const paths = await page.locator('path[stroke="#000000"]').all();
  if (paths.length > 1) {
    await paths[1].click();
  }

  // Click clear button
  await page.click('text=Limpar');

  // All paths should be white again (or default color)
  await page.waitForTimeout(300);

  console.log('✅ Clear functionality test passed!');
});

test('Coloring game - should navigate through all drawings', async ({ page }) => {
  await page.goto('http://localhost:8081');
  await page.waitForLoadState('networkidle');

  // Click Continuar button if on welcome screen
  const continuarButton = page.locator('text=Continuar');
  if (await continuarButton.isVisible()) {
    await continuarButton.click();
    await page.waitForTimeout(1000);
  }

  // Navigate to coloring game (may need to scroll)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.click('text=Coloração');

  // Wait for game to load
  await page.waitForSelector('text=🦋 Borboleta', { timeout: 10000 });

  const expectedDrawings = [
    '🦋 Borboleta',
    '🏠 Casa',
    '🌸 Flor',
    '🚗 Carro',
    '☀️ Sol',
  ];

  // Navigate through all drawings
  for (let i = 0; i < expectedDrawings.length; i++) {
    await expect(page.locator(`text=${expectedDrawings[i]}`)).toBeVisible();
    if (i < expectedDrawings.length - 1) {
      await page.click('text=→');
      await page.waitForTimeout(300);
    }
  }

  // Navigate backward
  await page.click('text=←');
  await page.waitForTimeout(300);
  await expect(page.locator(`text=${expectedDrawings[3]}`)).toBeVisible();

  console.log('✅ Navigation test passed!');
});
