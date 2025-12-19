import { expect, type Page } from '@playwright/test';
import { CatalogComponent } from '@components/product/catalog.component';
import { routes } from '@config/routes';
import { TimeoutMs } from '@config/timeouts';

export class CatalogPage {
  readonly page: Page;
  private readonly ui: CatalogComponent;

  constructor(page: Page) {
    this.page = page;
    this.ui = new CatalogComponent(page);
  }

  async openFirstProductFromListing() {
    const link = this.ui.productDetailLinks().first();
    await link.waitFor({ state: 'visible' });

    const name = (await link.textContent())?.trim() ?? '';
    await Promise.all([
      this.page.waitForURL(routes.product.matchers.details, { timeout: TimeoutMs.S20, waitUntil: 'commit' }),
      link.click({ noWaitAfter: true }),
    ]);
    await this.ui.productTitle().waitFor({ state: 'visible', timeout: TimeoutMs.S15 });

    return { name };
  }

  async openAnyProductFromHome() {
    await this.page.goto(routes.home, { waitUntil: 'commit' });

    return await this.openFirstProductFromListing();
  }

  async addToCartFromPdp() {
    await this.ui.addToCartButton().waitFor({ state: 'visible' });
    await this.ui.addToCartButton().click();
  }

  async expectProductTitleContains(name: string) {
    await expect(this.ui.productTitle()).toContainText(name);
  }

  async expectProductTitleVisible() {
    await expect(this.ui.productTitle()).toBeVisible();
  }

  async expectAddToCartVisible() {
    await expect(this.ui.addToCartButton()).toBeVisible();
  }
}
