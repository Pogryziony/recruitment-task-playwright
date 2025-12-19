import { type Locator, type Page } from '@playwright/test';

export class SearchComponent {
  constructor(private readonly page: Page) {}

  root(): Locator {
    return this.page.locator('#maincontainer').first();
  }

  results(): Locator {
    return this.resultTitles();
  }

  resultTitles(): Locator {
    return this.root().locator('a.prdocutname');
  }

  noResultsText(): Locator {
    return this.root()
      .locator(':text("There is no product that matches the search criteria")')
      .first();
  }

  searchCriteriaHeading(): Locator {
    return this.root().locator(':text("Search Criteria")').first();
  }

  contentPanel(): Locator {
    return this.root().locator('.contentpanel').first();
  }

  priceBucketFilter(): Locator {
    return this.root()
      .locator('a, label')
      .filter({ hasText: /\$\s*\d+\.?\d*\s*[-–]\s*\$\s*\d/i })
      .first();
  }

  nativeRangeInput(): Locator {
    return this.root().locator('input[type="range"]').first();
  }

  body(): Locator {
    return this.page.locator('body');
  }
}
