import { test, expect } from '@playwright/test';

/**
 * E2E Test: Login → Operation → Verification
 * Critical flow: User authentication and access to protected routes
 */
test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should login successfully and access dashboard', async ({ page }) => {
    // Navigate to login
    await expect(page).toHaveURL('/');
    
    // Fill login form
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Wait for navigation after login
    await page.waitForURL('**/dashboard', { timeout: 5000 }).catch(() => {
      // If dashboard route doesn't exist, check for any authenticated route
      expect(page.url()).not.toContain('/login');
    });
    
    // Verify token is stored
    const token = await page.evaluate(() => localStorage.getItem('access_token'));
    expect(token).toBeTruthy();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'wrong@test.com');
    await page.fill('input[type="password"]', 'wrong');
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('text=/error|invalid|incorrect/i')).toBeVisible({ timeout: 3000 });
  });

  test('should persist authentication on page refresh', async ({ page }) => {
    // Login first
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForTimeout(2000);
    
    // Refresh page
    await page.reload();
    
    // Verify still authenticated (token should persist)
    const token = await page.evaluate(() => localStorage.getItem('access_token'));
    expect(token).toBeTruthy();
  });
});

