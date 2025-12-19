import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  accountMenu(): Locator {
    // Site uses "Account" in the header; keep this flexible.
    return this.page.getByRole('link', { name: /account/i });
  }

  async goto() {
    await this.page.goto('/');
    // Title changes occasionally; use a stable visible marker instead.
    await expect(this.page.getByRole('link', { name: /automation test store/i })).toBeVisible();
  }

  async search(query: string) {
    const input = this.page
      .getByRole('textbox', { name: /search keywords/i })
      .or(this.page.locator('input[name="filter_keyword"], #filter_keyword'));

    await input.first().fill(query);
    await input.first().press('Enter');
  }
}
