import { test, expect } from '../../src/fixtures/test';
import { CatalogHelpers } from '../../src/pages/catalog.page';
import { CartPage } from '../../src/pages/cart.page';

test.describe('Cart', () => {
  test('adds a product to cart and verifies cart contents', async ({ page }) => {
    const catalog = new CatalogHelpers(page);
    const { name } = await catalog.openAnyProductFromHome();
    await catalog.addToCartFromPdp();

    // Go to cart page
    const cart = new CartPage(page);
    await cart.goto();

    // Verify line item exists (name match is tolerant)
    if (name) {
      await expect(cart.rowForProductName(name)).toBeVisible();
    }

    await expect(cart.cartTable()).toBeVisible();
  });

  test('updates quantity and verifies totals update', async ({ page }) => {
    const catalog = new CatalogHelpers(page);
    await catalog.openAnyProductFromHome();
    await catalog.addToCartFromPdp();

    const cart = new CartPage(page);
    await cart.goto();

    // Use the first line item row (we don't rely on ordering elsewhere; cart usually has 1 item here).
    const lineItemRow = cart.cartTable().getByRole('row').nth(1);
    const qtyInput = lineItemRow.getByRole('textbox').first();
    await expect(qtyInput).toBeVisible();

    const beforeTotal = await cart.totalText();

    await qtyInput.fill('2');

    // Update button usually present per row or cart form.
    await cart.updateButton().click();

    // Cart updates may happen with delayed UI refresh.
    await expect.poll(async () => await cart.totalText()).not.toBe(beforeTotal);
  });

  test('removes an item from the cart after setting quantity to 2', async ({ page }) => {
    const catalog = new CatalogHelpers(page);
    await catalog.openAnyProductFromHome();
    await catalog.addToCartFromPdp();

    const cart = new CartPage(page);
    await cart.goto();

    const lineItemRow = cart.cartTable().getByRole('row').nth(1);
    const qtyInput = lineItemRow.getByRole('textbox').first();
    await expect(qtyInput).toBeVisible();

    await qtyInput.fill('2');
    await cart.updateButton().click();
    await expect(qtyInput).toHaveValue('2');

    const remove = lineItemRow.locator('a[title*="Remove" i], button[title*="Remove" i], a[href*="remove" i]').first();
    await expect(remove).toBeVisible();
    await remove.click();

    // After removal, the UI may either hide the cart table entirely or render an empty-cart message.
    await expect(page.locator('#maincontainer')).toContainText(/shopping cart is empty|\bempty\b/i);
    const tableCount = await cart.cartTable().count();
    if (tableCount > 0) {
      await expect(cart.cartTable().getByRole('row')).toHaveCount(1);
    } else {
      await expect(cart.cartTable()).toHaveCount(0);
    }
  });
});
