import { expect, type Locator, type Page } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  root(): Locator {
    // Prefer stable container ID if present.
    return this.page.locator('#maincontainer').first();
  }

  results(): Locator {
    return this.root().locator('.productgrid .thumbnail, .productlist .thumbnail, .fixed_wrapper .thumbnail');
  }

  resultTitles(): Locator {
    return this.root().locator('.productgrid .thumbnail .prdocutname, .productlist .thumbnail .prdocutname, .fixed_wrapper .prdocutname');
  }

  async waitForResultsOrEmpty() {
    // Either results appear, or a "no results" block shows.
    await Promise.race([
      this.results().first().waitFor({ state: 'visible' }),
      this.root().locator(':text("There is no product")').first().waitFor({ state: 'visible' }),
      this.root().locator('.contentpanel').first().waitFor({ state: 'visible' }),
    ]);
  }

  async tryApplyRangeFilterFromUI(): Promise<boolean> {
    // The demo site often does not expose range filters (price slider, price buckets, etc.).
    // Best-effort: if a price-bucket style filter exists, click it.
    const priceBucket = this.root()
      .locator('a, label')
      .filter({ hasText: /\$\s*\d+\.?\d*\s*[-–]\s*\$\s*\d/i })
      .first();

    if (await priceBucket.isVisible()) {
      await priceBucket.click();
      return true;
    }

    const rangeInputs = this.root().locator('input[type="range"]').first();
    if (await rangeInputs.isVisible()) {
      // If a native range exists, moving it counts as a range-based filter.
      await rangeInputs.focus();
      await rangeInputs.press('ArrowRight');
      return true;
    }

    return false;
  }

  async expectAllTitlesContain(term: RegExp) {
    const count = await this.resultTitles().count();
    if (count === 0) return;

    for (let i = 0; i < count; i++) {
      await expect(this.resultTitles().nth(i)).toContainText(term);
    }
  }
}
