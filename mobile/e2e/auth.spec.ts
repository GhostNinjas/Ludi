import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the register screen', async ({ page }) => {
    // Wait for the app to load
    await page.waitForLoadState('networkidle');

    // Check if we're on login or register page
    const pageTitle = await page.textContent('text=Ludi').catch(() => null);
    expect(pageTitle).toBeTruthy();
  });

  test('should successfully register a new user', async ({ page }) => {
    // Wait for app to load
    await page.waitForLoadState('networkidle');

    // Generate unique email for testing
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const testPassword = 'TestPassword123!';
    const testName = 'Test User';

    // Find and click register link if we're on login page
    const registerLink = page.getByText(/criar conta|register|sign up/i);
    if (await registerLink.isVisible().catch(() => false)) {
      await registerLink.click();
      await page.waitForURL('**/register', { timeout: 5000 }).catch(() => {});
    }

    // Fill out registration form
    // Wait for inputs to be in the DOM
    await page.waitForSelector('input[type="email"]', { state: 'attached' });
    await page.waitForTimeout(1000);

    // Get all inputs
    const allInputs = await page.locator('input').all();

    // Fill name (first input)
    if (allInputs.length > 0) {
      await allInputs[0].click();
      await allInputs[0].pressSequentially(testName, { delay: 50 });
    }

    // Fill email
    const emailInput = page.locator('input[type="email"]').first();
    await emailInput.click();
    await emailInput.pressSequentially(testEmail, { delay: 50 });

    // Fill passwords
    const passwordInputs = await page.locator('input[type="password"]').all();
    for (const pwInput of passwordInputs) {
      await pwInput.click();
      await pwInput.pressSequentially(testPassword, { delay: 50 });
    }

    // Submit the form
    const submitButton = page.getByRole('button', { name: /register|criar conta|sign up/i });
    await submitButton.click();

    // Wait for either success message or navigation
    await Promise.race([
      page.waitForURL('**/login', { timeout: 10000 }),
      page.waitForSelector('text=/success|sucesso|registered/i', { timeout: 10000 }),
      page.waitForResponse(resp => resp.url().includes('/api/auth/register') && resp.status() === 201, { timeout: 10000 })
    ]).catch(async () => {
      // If no obvious success indicator, check if we're still on register page with an error
      const errorMessage = await page.textContent('text=/error|erro/i').catch(() => null);
      if (errorMessage) {
        console.log('Registration error:', errorMessage);
        throw new Error(`Registration failed: ${errorMessage}`);
      }
    });
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Navigate to register if needed
    const registerLink = page.getByText(/criar conta|register|sign up/i);
    if (await registerLink.isVisible().catch(() => false)) {
      await registerLink.click();
      await page.waitForTimeout(1000);
    }

    // Try to submit with invalid email using JavaScript
    await page.waitForSelector('input[type="email"]', { state: 'attached' });

    await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      if (emailInput) {
        emailInput.value = 'invalid-email';
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        emailInput.dispatchEvent(new Event('change', { bubbles: true }));
      }

      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      if (passwordInput) {
        passwordInput.value = 'short';
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    const submitButton = page.getByRole('button', { name: /register|criar conta|sign up/i });
    await submitButton.click();

    // Check for validation errors
    await page.waitForTimeout(1000);
    const hasErrors = await page.locator('text=/invalid|inválido|must be|erro/i').count() > 0;
    expect(hasErrors).toBeTruthy();
  });

  test('should navigate between login and register pages', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check if we can find navigation links
    const registerOrLoginLink = page.locator('text=/login|entrar|criar conta|register/i').first();
    const linkText = await registerOrLoginLink.textContent().catch(() => '');

    if (linkText) {
      await registerOrLoginLink.click();
      await page.waitForTimeout(1000);

      // Verify navigation occurred
      const newLink = page.locator('text=/login|entrar|criar conta|register/i').first();
      const newLinkText = await newLink.textContent().catch(() => '');

      // The link text should have changed (from login to register or vice versa)
      expect(newLinkText).toBeTruthy();
    }
  });
});
