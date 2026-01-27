import { type Locator, type Page } from '@playwright/test';

export class CatalogComponent {
  constructor(private readonly page: Page) {}

  productDetailLinks(): Locator {
    return this.page.locator(
      'a[href*="rt=product/product" i][href*="product_id=" i], a.prdocutname',
    );
  }

  productTitle(): Locator {
    return this.page.locator('h1');
  }

  addToCartButton(): Locator {
    return this.page
      .locator('a[title*="Add to Cart" i], button[title*="Add to Cart" i], a.cart')
      .filter({ hasNotText: /0 items/i })
      .first();
  }
}
