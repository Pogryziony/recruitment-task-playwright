import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/index.php?rt=checkout/cart');
    await expect(this.page.getByRole('heading', { name: /shopping cart/i })).toBeVisible();
  }

  cartTable(): Locator {
    // Cart items table can be unclassed; anchor off the header row.
    const headerRow = this.page.getByRole('row', { name: /image name model unit price quantity total remove/i });
    return this.page.getByRole('table').filter({ has: headerRow }).first();
  }

  updateButton(): Locator {
    return this.page.getByRole('button', { name: /update/i });
  }

  rowForProductName(name: string): Locator {
    // Row name includes many cells; match the product name substring.
    return this.cartTable().getByRole('row', { name: new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') });
  }

  quantityInputForProduct(name: string): Locator {
    return this.rowForProductName(name).getByRole('textbox').first();
  }

  totalsTable(): Locator {
    // Totals are in a separate table containing rows like "Sub-Total" and "Total".
    return this.page.getByRole('table').filter({ has: this.page.getByRole('row', { name: /sub-total/i }) }).first();
  }

  couponInput(): Locator {
    // Prefer IDs first (if present), then fall back to name-based matching.
    return this.page.locator(
      '#coupon_coupon, #coupon_code, form#coupon input[id*="coupon" i], form#coupon input[name*="coupon" i], input[id*="coupon" i], input[name*="coupon" i]',
    );
  }

  applyCouponButton(): Locator {
    // Prefer IDs first (if present), then fall back to text/value/title.
    return this.page.locator(
      'form#coupon #apply_coupon, form#coupon #coupon_apply, #apply_coupon, #coupon_apply, form#coupon button:has-text("Apply"), form#coupon input[value*="Apply" i], button:has-text("Apply"), input[value*="Apply" i], button[title*="Apply" i], input[title*="Apply" i]',
    );
  }

  couponMessage(): Locator {
    return this.page.locator('#maincontainer .alert, #maincontainer .alert-error, #maincontainer .error, #maincontainer .help-block').first();
  }

  async hasCouponUI(): Promise<boolean> {
    return (await this.couponInput().count()) > 0;
  }

  async applyCoupon(code: string) {
    await this.couponInput().first().fill(code);
    await this.applyCouponButton().first().click();
  }

  async totalText(): Promise<string> {
    const row = this.page.getByRole('row').filter({ hasText: /^Total:/i }).first();
    const cells = row.getByRole('cell');
    const cellCount = await cells.count();
    const value = cellCount > 0 ? await cells.nth(cellCount - 1).textContent() : await row.textContent();
    return (value ?? '').trim();
  }
}
