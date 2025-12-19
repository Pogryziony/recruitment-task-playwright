import { test, expect } from '../../src/fixtures/test';
import { CatalogHelpers } from '../../src/pages/catalog.page';
import { CartPage } from '../../src/pages/cart.page';

test.describe('Coupon / Discount', () => {
  test('applies an invalid coupon and verifies validation message (if coupon UI exists)', async ({ page }) => {
    const catalog = new CatalogHelpers(page);
    const cart = new CartPage(page);
    await catalog.openAnyProductFromHome();
    await catalog.addToCartFromPdp();

    await cart.goto();
    const hasCoupon = await cart.hasCouponUI();
    if (!hasCoupon) test.skip(true, 'Coupon field not present on cart page');

    await cart.applyCoupon('INVALID-CODE');
    await expect(cart.couponMessage()).toBeVisible();
  });
});
