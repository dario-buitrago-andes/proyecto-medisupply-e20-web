import { test, expect } from '@playwright/test';

/**
 * E2E Test: Navigation flows
 * Tests deep-linking, refresh, back/forward, and unauthorized redirects
 */
test.describe('Navigation', () => {
  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    await page.goto('/productos');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/(login|$)/, { timeout: 3000 });
  });

  test('should navigate between routes after login', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Navigate to different routes
    const routes = ['/productos', '/proveedores', '/vendedores', '/planes-venta'];
    
    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      // Verify we're on the correct route
      expect(page.url()).toContain(route);
    }
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Navigate forward
    await page.goto('/productos');
    await page.waitForLoadState('networkidle');
    
    // Go back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    // Should still be authenticated
    const token = await page.evaluate(() => localStorage.getItem('access_token'));
    expect(token).toBeTruthy();
  });

  test('should handle page refresh on protected route', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Navigate to protected route
    await page.goto('/productos');
    await page.waitForLoadState('networkidle');
    
    // Refresh
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should still be on protected route (not redirected to login)
    expect(page.url()).toContain('/productos');
  });
});

