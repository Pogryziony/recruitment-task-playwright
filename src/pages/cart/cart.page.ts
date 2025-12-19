import { expect, type Locator, type Page } from '@playwright/test';
import { CartComponent } from '@components/cart/cart.component';
import { routes } from '@config/routes';
import { TimeoutMs } from '@config/timeouts';

export class CartPage {
  readonly page: Page;
  private readonly ui: CartComponent;

  constructor(page: Page) {
    this.page = page;
    this.ui = new CartComponent(page);
  }

  async goToCart() {
    await this.page.goto(routes.checkout.cart, { waitUntil: 'commit' });
    await this.ui.heading().waitFor({ state: 'visible', timeout: TimeoutMs.S20 });
  }

  cartTable(): Locator {
    return this.ui.cartTable();
  }

  updateButton(): Locator {
    return this.ui.updateButton();
  }

  rowForProductName(name: string): Locator {
    return this.ui.rowForProductName(name);
  }

  quantityInputForProduct(name: string): Locator {
    return this.ui.quantityInputForRow(this.ui.rowForProductName(name));
  }

  totalsTable(): Locator {
    return this.page.getByRole('table').filter({ has: this.page.getByRole('row', { name: /sub-total/i }) }).first();
  }

  couponInput(): Locator {
    return this.ui.couponInput();
  }

  applyCouponButton(): Locator {
    return this.ui.applyCouponButton();
  }

  couponMessage(): Locator {
    return this.ui.couponMessage();
  }

  async hasCouponUI(): Promise<boolean> {
    return (await this.couponInput().count()) > 0;
  }

  async expectCouponUiVisible() {
    await expect(this.couponInput().first()).toBeVisible();
    await expect(this.applyCouponButton().first()).toBeVisible();
  }

  async expectCouponMessageVisible() {
    await expect(this.couponMessage()).toBeVisible();
  }

  async expectHasLineItemForProduct(name: string) {
    await expect(this.rowForProductName(name)).toBeVisible();
  }

  async applyCoupon(code: string) {
    await this.couponInput().first().fill(code);
    await this.applyCouponButton().first().click();
  }

  async getTotalText(): Promise<string> {
    const row = this.ui.totalsTotalRow();
    const cells = row.getByRole('cell');
    const cellCount = await cells.count();
    const value = cellCount > 0 ? await cells.nth(cellCount - 1).textContent() : await row.textContent();
    return (value ?? '').trim();
  }

  async setFirstLineItemQuantity(qty: number) {
    const row = this.ui.lineItemRows().nth(1);
    const itemQuantityInput = this.ui.quantityInputForRow(row);
    await itemQuantityInput.waitFor({ state: 'visible' });
    await itemQuantityInput.fill(String(qty));
    await this.ui.updateButton().click();

    const el = await itemQuantityInput.elementHandle();
    if (el) {
      await this.page.waitForFunction(
        ({ el, expected }) => (el as HTMLInputElement).value === expected,
        { el, expected: String(qty) },
        { timeout: TimeoutMs.S20, polling: 200 },
      );
    }
  }

  async removeFirstLineItem() {
    const row = this.ui.lineItemRows().nth(1);
    const remove = this.ui.removeControlForRow(row);
    await remove.waitFor({ state: 'visible' });
    await remove.click();
  }

  async expectEmptyCart() {
    await expect(this.ui.mainContainer()).toContainText(/shopping cart is empty|\bempty\b/i);
  }
}
