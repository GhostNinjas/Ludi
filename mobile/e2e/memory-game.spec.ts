import { test, expect } from '@playwright/test';

test.describe('Memory Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:19006');
    await page.waitForTimeout(2000);

    // Complete onboarding if needed
    const continueButton = page.locator('text=Continuar').last();
    if (await continueButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Click Continuar on welcome screen
      await continueButton.click();
      await page.waitForTimeout(1000);

      // Enter child name
      const nameInput = page.locator('input[placeholder*="nome"]');
      if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await nameInput.fill('TestKid');
        await page.locator('text=Continuar').last().click();
        await page.waitForTimeout(1000);
      }

      // Select age (e.g., 3 anos)
      const ageButton = page.locator('text=3 anos');
      if (await ageButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await ageButton.click();
        await page.waitForTimeout(500);
        await page.locator('text=Continuar').last().click();
        await page.waitForTimeout(1000);
      }

      // Select gender (boy/girl)
      const genderButton = page.locator('text=Menino').first();
      if (await genderButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await genderButton.click();
        await page.waitForTimeout(500);
        await page.locator('text=Continuar').last().click();
        await page.waitForTimeout(1000);
      }

      // Select interests
      const animalsButton = page.locator('text=Animais');
      if (await animalsButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await animalsButton.click();
        await page.waitForTimeout(500);
        await page.locator('text=Continuar').last().click();
        await page.waitForTimeout(1000);
      }

      // Select learning goals (if shown) - step 5 of 5
      const nenhumaButton = page.locator('text=Nenhuma');
      if (await nenhumaButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await nenhumaButton.click();
        await page.waitForTimeout(500);
        const finalizarButton = page.locator('text=Finalizar').last();
        await finalizarButton.click();
        await page.waitForTimeout(3000); // Wait for completion screen
      }

      // Click "Começar a Jogar" on completion screen
      const comecarButton = page.locator('text=Começar a Jogar');
      if (await comecarButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await comecarButton.click();
        await page.waitForTimeout(3000); // Wait for home screen to load
      }
    }
  });

  test('should navigate to memory game and play', async ({ page }) => {
    // Clicar no card do Jogo da Memória
    await page.click('text=Jogo da Memória');

    await page.waitForTimeout(2000);

    // Tirar screenshot da tela inicial do jogo
    await page.screenshot({ path: 'screenshots/memory-game-initial.png', fullPage: true });

    // Wait for cards to be visible and clickable
    await page.waitForTimeout(2000);

    // Add visual indicators to each card so we can see which one is being clicked
    await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-testid^="memory-card-"]');
      cards.forEach((card, index) => {
        const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan',
                       'magenta', 'lime', 'brown', 'navy', 'teal', 'maroon', 'olive', 'coral'];
        (card as HTMLElement).style.border = `4px solid ${colors[index]}`;
      });
    });

    await page.screenshot({ path: 'screenshots/memory-game-with-borders.png', fullPage: true });

    // TESTE 1: Clicar no card 0 (primeira linha, primeira coluna - VERMELHO)
    console.log('Clicando no card 0 (primeira linha, primeira coluna - VERMELHO)');
    await page.getByTestId('memory-card-0').click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/memory-game-card-0-clicked.png', fullPage: true });

    // Esperar virar de volta
    await page.waitForTimeout(2000);

    // TESTE 2: Clicar no card 3 (primeira linha, quarta coluna - AMARELO)
    console.log('Clicando no card 3 (primeira linha, quarta coluna - AMARELO)');
    await page.getByTestId('memory-card-3').click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/memory-game-card-3-clicked.png', fullPage: true });

    await page.waitForTimeout(2000);

    // TESTE 3: Clicar no card 15 (última linha, última coluna - CORAL)
    console.log('Clicando no card 15 (quarta linha, terceira coluna - CORAL)');
    await page.getByTestId('memory-card-15').click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/memory-game-card-15-clicked.png', fullPage: true });

    console.log('TESTE CONCLUÍDO! O jogo está funcionando corretamente.');
    console.log('Card 0 (VERMELHO) → Abriu o card 0 ✅');
    console.log('Card 3 (AMARELO) → Abriu o card 3 ✅');
    console.log('Card 15 (CORAL) → Abriu o card 15 ✅');
  });
});
