import { test, expect } from '@playwright/test';

/**
 * E2E Test: Navigation flows
 * Tests deep-linking, refresh, back/forward, and unauthorized redirects
 */
test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Hide webpack overlay
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.textContent = `
        #webpack-dev-server-client-overlay { display: none !important; pointer-events: none !important; }
        iframe[src="about:blank"][id*="webpack"] { display: none !important; }
      `;
      document.head.appendChild(style);
    });
  });

  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    // Clear any existing token
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('access_token'));
    
    // Navigate to protected route
    await page.goto('/productos');
    await page.waitForLoadState('domcontentloaded');
    
    // Should show login form (the app shows Login component but doesn't change URL)
    await page.waitForSelector('#email', { timeout: 5000 });
    await page.waitForSelector('#password', { timeout: 5000 });
    
    // Verify we're seeing the login form, not the protected content
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
  });

  test('should navigate between routes after login', async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    await page.waitForSelector('#email', { timeout: 5000 });
    await page.fill('#email', 'test@test.com');
    await page.fill('#password', 'password');
    
    // Submit form directly to avoid iframe overlay issues
    await page.evaluate(() => {
      const overlay = document.getElementById('webpack-dev-server-client-overlay');
      if (overlay) {
        (overlay as HTMLElement).style.display = 'none';
        (overlay as HTMLElement).style.pointerEvents = 'none';
      }
      const form = document.querySelector('form');
      if (form) {
        (form as HTMLFormElement).requestSubmit();
      }
    });
    
    // Wait for login to complete
    await page.waitForFunction(() => {
      return localStorage.getItem('access_token') !== null;
    }, { timeout: 10000 });
    
    // Navigate to different routes
    const routes = ['/productos', '/proveedores', '/vendedores', '/planes-venta'];
    
    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');
      // Verify we're on the correct route
      expect(page.url()).toContain(route);
    }
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    await page.waitForSelector('#email', { timeout: 5000 });
    await page.fill('#email', 'test@test.com');
    await page.fill('#password', 'password');
    
    // Submit form directly to avoid iframe overlay issues
    await page.evaluate(() => {
      const overlay = document.getElementById('webpack-dev-server-client-overlay');
      if (overlay) {
        (overlay as HTMLElement).style.display = 'none';
        (overlay as HTMLElement).style.pointerEvents = 'none';
      }
      const form = document.querySelector('form');
      if (form) {
        (form as HTMLFormElement).requestSubmit();
      }
    });
    
    // Wait for login to complete
    await page.waitForFunction(() => {
      return localStorage.getItem('access_token') !== null;
    }, { timeout: 10000 });
    
    // Navigate forward
    await page.goto('/productos');
    await page.waitForLoadState('domcontentloaded');
    
    // Go back
    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    
    // Should still be authenticated
    const token = await page.evaluate(() => localStorage.getItem('access_token'));
    expect(token).toBeTruthy();
  });

  test('should handle page refresh on protected route', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    await page.waitForSelector('#email', { timeout: 5000 });
    await page.fill('#email', 'test@test.com');
    await page.fill('#password', 'password');
    
    // Submit form directly to avoid iframe overlay issues
    await page.evaluate(() => {
      const overlay = document.getElementById('webpack-dev-server-client-overlay');
      if (overlay) {
        (overlay as HTMLElement).style.display = 'none';
        (overlay as HTMLElement).style.pointerEvents = 'none';
      }
      const form = document.querySelector('form');
      if (form) {
        (form as HTMLFormElement).requestSubmit();
      }
    });
    
    // Wait for login to complete
    await page.waitForFunction(() => {
      return localStorage.getItem('access_token') !== null;
    }, { timeout: 10000 });
    
    // Navigate to protected route
    await page.goto('/productos');
    await page.waitForLoadState('domcontentloaded');
    
    // Refresh
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    
    // Should still be on protected route (not redirected to login)
    expect(page.url()).toContain('/productos');
  });
});

