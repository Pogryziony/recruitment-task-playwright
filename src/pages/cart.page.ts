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

  async totalText(): Promise<string> {
    const row = this.page.getByRole('row').filter({ hasText: /^Total:/i }).first();
    const cells = row.getByRole('cell');
    const cellCount = await cells.count();
    const value = cellCount > 0 ? await cells.nth(cellCount - 1).textContent() : await row.textContent();
    return (value ?? '').trim();
  }
}
