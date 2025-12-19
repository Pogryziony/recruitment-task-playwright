import { expect, type Locator, type Page } from '@playwright/test';

export class SearchResultsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  results(): Locator {
    return this.page.locator('.productgrid .thumbnail, .productlist .thumbnail, .fixed_wrapper .thumbnail');
  }

  resultTitles(): Locator {
    return this.page.locator('.productgrid .thumbnail .prdocutname, .productlist .thumbnail .prdocutname, .fixed_wrapper .prdocutname');
  }

  async waitForResultsOrEmpty() {
    // Either results appear, or a "no results" block shows.
    await Promise.race([
      this.results().first().waitFor({ state: 'visible' }),
      this.page.locator(':text("There is no product")').first().waitFor({ state: 'visible' }),
      this.page.locator('.contentpanel').first().waitFor({ state: 'visible' }),
    ]);
  }

  async expectAllTitlesContain(term: RegExp) {
    const count = await this.resultTitles().count();
    if (count === 0) return;

    for (let i = 0; i < count; i++) {
      await expect(this.resultTitles().nth(i)).toContainText(term);
    }
  }
}
