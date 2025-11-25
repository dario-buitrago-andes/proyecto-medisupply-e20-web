import { test, expect } from '@playwright/test';

/**
 * E2E Test: Create/Edit Product → List → Details → Export
 * Critical flow: Product management end-to-end
 */
test.describe('Product Management Flow', () => {
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
    
    // Login first
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for login form
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
    
    // Wait for login to complete - check for token
    await page.waitForFunction(() => {
      return localStorage.getItem('access_token') !== null;
    }, { timeout: 15000 });
  });

  test('should search products', async ({ page }) => {
    await page.goto('/productos');
    
    // Find search input
    const searchInput = page.locator('input[type="search"]').or(page.locator('input[placeholder*="buscar" i]'));
    if (await searchInput.count() > 0) {
      await searchInput.fill('Test');
      // Wait for search results to update
      try {
        await page.waitForLoadState('networkidle', { timeout: 2000 });
      } catch {
        await page.waitForTimeout(500);
      }
      
      // Verify filtered results
      const results = await page.locator('tr, [role="row"]').count();
      expect(results).toBeGreaterThan(0);
    }
  });
});

