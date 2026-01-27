import { expect, type Page } from '@playwright/test';
import { SearchComponent } from '@components/product/search.component';
import { TimeoutMs } from '@config/timeouts';

export class SearchResultsPage {
  readonly page: Page;
  private readonly ui: SearchComponent;

  constructor(page: Page) {
    this.page = page;
    this.ui = new SearchComponent(page);
  }

  async waitForResultsOrEmpty() {
    await this.ui.contentPanel().waitFor({ state: 'visible' });

    await this.ui.searchCriteriaHeading().waitFor({ state: 'visible', timeout: TimeoutMs.S20 });

    await Promise.any([
      this.ui.resultTitles().first().waitFor({ state: 'visible', timeout: TimeoutMs.S20 }),
      this.ui.noResultsText().waitFor({ state: 'visible', timeout: TimeoutMs.S20 }),
    ]);
  }

  async tryApplyRangeFilterFromUI(): Promise<boolean> {
    if (await this.ui.priceBucketFilter().isVisible()) {
      await this.ui.priceBucketFilter().click();
      return true;
    }

    if (await this.ui.nativeRangeInput().isVisible()) {
      await this.ui.nativeRangeInput().focus();
      await this.ui.nativeRangeInput().press('ArrowRight');
      return true;
    }

    return false;
  }

  async expectAllTitlesContain(term: RegExp) {
    const count = await this.ui.resultTitles().count();
    expect.soft(count).toBeGreaterThan(0);
    if (count === 0) return;

    for (let i = 0; i < count; i++) {
      await expect(this.ui.resultTitles().nth(i)).toContainText(term);
    }
  }

  async getResultsCount(): Promise<number> {
    return await this.ui.results().count();
  }

  async expectNoResultsMessage() {
    await expect(this.ui.noResultsText()).toContainText(
      'There is no product that matches the search criteria',
      { timeout: TimeoutMs.S20 },
    );
  }
}
