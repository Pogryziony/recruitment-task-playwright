import { test, expect } from '../../src/fixtures/test';
import { CatalogHelpers } from '../../src/pages/catalog.page';
import { CartPage } from '../../src/pages/cart.page';

test.describe('Coupon / Discount', () => {
  test('applies an invalid coupon and verifies validation message', async ({ page }) => {
    const catalog = new CatalogHelpers(page);
    const cart = new CartPage(page);
    await catalog.openAnyProductFromHome();
    await catalog.addToCartFromPdp();

    await cart.goto();
    await expect(cart.couponInput().first()).toBeVisible();
    await expect(cart.applyCouponButton().first()).toBeVisible();

    await cart.applyCoupon('INVALID-CODE');
    await expect(cart.couponMessage()).toBeVisible();
  });
});
