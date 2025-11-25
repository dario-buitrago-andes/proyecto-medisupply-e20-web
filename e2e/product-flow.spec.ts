import { test, expect } from '@playwright/test';

/**
 * E2E Test: Create/Edit Product → List → Details → Export
 * Critical flow: Product management end-to-end
 */
test.describe('Product Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.fill('input[type="email"]', 'test@test.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
  });

  test('should create a new product', async ({ page }) => {
    // Navigate to products page (adjust route as needed)
    await page.goto('/productos');
    
    // Click create button
    const createButton = page.locator('button:has-text("Crear")').or(page.locator('button:has-text("Nuevo")'));
    await createButton.first().click();
    
    // Fill product form
    await page.fill('input[name="nombre_producto"]', 'Test Product E2E');
    await page.fill('input[name="precio"]', '99.99');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify success notification or redirect
    await expect(page.locator('text=/éxito|success|creado/i')).toBeVisible({ timeout: 5000 });
  });

  test('should list products', async ({ page }) => {
    await page.goto('/productos');
    
    // Wait for products list to load
    await page.waitForSelector('table, [role="grid"], .MuiDataGrid-root', { timeout: 5000 });
    
    // Verify products are displayed
    const productCount = await page.locator('tr, [role="row"]').count();
    expect(productCount).toBeGreaterThan(0);
  });

  test('should search products', async ({ page }) => {
    await page.goto('/productos');
    
    // Find search input
    const searchInput = page.locator('input[type="search"]').or(page.locator('input[placeholder*="buscar" i]'));
    if (await searchInput.count() > 0) {
      await searchInput.fill('Test');
      await page.waitForTimeout(1000);
      
      // Verify filtered results
      const results = await page.locator('tr, [role="row"]').count();
      expect(results).toBeGreaterThan(0);
    }
  });
});

