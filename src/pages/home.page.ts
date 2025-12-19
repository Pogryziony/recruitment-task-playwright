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
    // Scope to the site search form so we don't accidentally interact with other forms
    // (e.g. newsletter signup) that also contain submit buttons.
    const form = this.page.locator('#search_form').first();

    // Prefer IDs first; fall back to label/name based selectors.
    const input = form
      .locator('#filter_keyword, #keyword, input[name="filter_keyword"]')
      .or(this.page.getByRole('textbox', { name: /search keywords/i }));

    await input.first().fill(query);

    const submit = form.locator('#search_button, button[type="submit"], input[type="submit"]');
    if (await submit.first().isVisible()) {
      await submit.first().click();
    } else {
      await input.first().press('Enter');
    }
  }
}
