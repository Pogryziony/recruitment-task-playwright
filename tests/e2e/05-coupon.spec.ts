import { test, expect } from '../../src/fixtures/test';
import { CatalogHelpers } from '../../src/pages/catalog.page';

test.describe('Coupon / Discount', () => {
  test('applies an invalid coupon and verifies validation message (if coupon UI exists)', async ({ page }) => {
    const catalog = new CatalogHelpers(page);
    await catalog.openAnyProductFromHome();
    await catalog.addToCartFromPdp();

    await page.goto('/index.php?rt=checkout/cart');
    await expect(page.locator('body')).toContainText(/shopping cart/i);

    const couponInput = page.locator('input[name*="coupon" i], input[id*="coupon" i]');
    const hasCoupon = (await couponInput.count()) > 0;
    if (!hasCoupon) {
      test.skip(true, 'Coupon field not present on cart page');
    }

    await couponInput.first().fill('INVALID-CODE');

    const applyBtn = page.locator('button:has-text("Apply"), input[value*="Apply" i], button[title*="Apply" i], input[title*="Apply" i]').first();
    await applyBtn.click();

    await expect(page.locator('.alert, .alert-error, .error, .help-block').first()).toBeVisible();
  });
});
