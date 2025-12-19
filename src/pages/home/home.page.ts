import { expect, type Page } from '@playwright/test';
import { HomeComponent } from '@components/home/home.component';
import { routes } from '@config/routes';
import { TimeoutMs } from '@config/timeouts';

export class HomePage {
  readonly page: Page;
  private readonly ui: HomeComponent;

  constructor(page: Page) {
    this.page = page;
    this.ui = new HomeComponent(page);
  }

  async goToHome() {
    await this.page.goto(routes.home, { waitUntil: 'commit' });
    await this.ui.brandLink().waitFor({ state: 'visible', timeout: TimeoutMs.S20 });
  }

  async search(query: string) {
    const searchInput = this.ui.searchInput().first();
    await searchInput.fill(query);

    const searchCriteriaHeading = this.page.locator('#maincontainer').first().locator(':text("Search Criteria")').first();

    const waitForSearchResults = this.page.waitForURL(routes.product.matchers.search, {
      timeout: TimeoutMs.S20,
      waitUntil: 'commit',
    });

    const submit = this.ui.searchSubmit().first();
    if (await submit.isVisible()) {
      await submit.click({ noWaitAfter: true });
      await waitForSearchResults;
      try {
        await searchCriteriaHeading.waitFor({ state: 'visible', timeout: TimeoutMs.S10 });
        return;
      } catch {
        await this.page.goto(routes.product.search(query), { waitUntil: 'commit' });
        await searchCriteriaHeading.waitFor({ state: 'visible', timeout: TimeoutMs.S20 });
        return;
      }
    }

    await searchInput.press('Enter');
    await waitForSearchResults;

    try {
      await searchCriteriaHeading.waitFor({ state: 'visible', timeout: TimeoutMs.S10 });
    } catch {
      await this.page.goto(routes.product.search(query), { waitUntil: 'commit' });
      await searchCriteriaHeading.waitFor({ state: 'visible', timeout: TimeoutMs.S20 });
    }
  }

  async goToSpecialsFromHome() {
    await this.goToHome();

    await Promise.all([
      this.page.waitForURL(routes.product.matchers.specials, { timeout: TimeoutMs.S20, waitUntil: 'commit' }),
      this.ui.specialsLink().click({ noWaitAfter: true }),
    ]);
  }

  async goToFirstCategoryFromHome() {
    await this.goToHome();

    const category = this.ui.categoryLinks().first();
    await category.waitFor({ state: 'visible', timeout: TimeoutMs.S20 });

    await Promise.all([
      this.page.waitForURL(routes.product.matchers.category, { timeout: TimeoutMs.S20, waitUntil: 'commit' }),
      category.click({ noWaitAfter: true }),
    ]);
  }
}
