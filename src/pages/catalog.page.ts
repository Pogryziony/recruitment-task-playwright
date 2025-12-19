import { expect, type Locator, type Page } from '@playwright/test';

export class CatalogHelpers {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  productDetailLinks(): Locator {
    // Links to product details exist across home (Featured/Latest) and listings.
    return this.page.locator('a[href*="rt=product/product&product_id="]');
  }

  async openAnyProductFromHome() {
    await this.page.goto('/');

    const link = this.productDetailLinks().first();
    await expect(link).toBeVisible();

    const name = (await link.textContent())?.trim() ?? '';
    await link.click();

    await expect(this.page).toHaveURL(/rt=product\/product&product_id=/);
    await expect(this.page.locator('h1')).toBeVisible();

    return { name };
  }

  async addToCartFromPdp() {
    // PDP add-to-cart button varies; use a few safe fallbacks.
    const add = this.page
      .locator('a[title*="Add to Cart" i], button[title*="Add to Cart" i], a.cart')
      .filter({ hasNotText: /0 items/i })
      .first();

    await expect(add).toBeVisible();
    await add.click();
  }
}
