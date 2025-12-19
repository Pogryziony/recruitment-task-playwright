import { type Locator, type Page } from '@playwright/test';

export class HomeComponent {
  constructor(private readonly page: Page) {}

  brandLink(): Locator {
    return this.page.getByRole('link', { name: /automation test store/i });
  }

  searchForm(): Locator {
    return this.page.locator('#search_form').first();
  }

  searchInput(): Locator {
    const form = this.searchForm();
    return form
      .locator('#filter_keyword, #keyword, input[name="filter_keyword"]')
      .or(this.page.getByRole('textbox', { name: /search keywords/i }));
  }

  searchSubmit(): Locator {
    return this.searchForm().locator('#search_button, button[type="submit"], input[type="submit"]');
  }

  specialsLink(): Locator {
    return this.page
      .getByRole('link', { name: /specials/i })
      .or(this.page.locator('a[href*="rt=product/special" i]'))
      .first();
  }

  categoryLinks(): Locator {
    // Categories usually link to: rt=product/category&path=...
    return this.page.locator('a[href*="rt=product/category&path=" i]');
  }
}
