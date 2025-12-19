import { test } from '@playwright/test';
import { CatalogPage } from '@pages/product/catalog.page';
import { CartPage } from '@pages/cart/cart.page';

test.describe('Coupon / Discount', () => {
  let catalog: CatalogPage;
  let cart: CartPage;

  test.beforeEach(async ({ page }) => {
    catalog = new CatalogPage(page);
    cart = new CartPage(page);
  });

  test('applies an invalid coupon and verifies validation message', async () => {
    await test.step('Open any product from home', async () => {
      await catalog.openAnyProductFromHome();
    });

    await test.step('Add product to cart', async () => {
      await catalog.addToCartFromPdp();
    });

    await test.step('Open cart and verify coupon UI', async () => {
      await cart.goToCart();
      await cart.expectCouponUiVisible();
    });

    await test.step('Apply invalid coupon and verify message', async () => {
      await cart.applyCoupon('INVALID-CODE');
      await cart.expectCouponMessageVisible();
    });
  });
});
