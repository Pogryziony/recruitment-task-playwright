import { type Locator, type Page } from '@playwright/test';

export class CartComponent {
  constructor(private readonly page: Page) {}

  heading(): Locator {
    return this.page.getByRole('heading', { name: /shopping cart/i });
  }

  mainContainer(): Locator {
    return this.page.locator('#maincontainer').first();
  }

  headerRow(): Locator {
    return this.page.getByRole('row', { name: /image name model unit price quantity total remove/i });
  }

  cartTable(): Locator {
    return this.page.getByRole('table').filter({ has: this.headerRow() }).first();
  }

  updateButton(): Locator {
    return this.page.getByRole('button', { name: /update/i });
  }

  lineItemRows(): Locator {
    // nth(0) is usually header, but we keep this generic for reuse.
    return this.cartTable().getByRole('row');
  }

  rowForProductName(name: string): Locator {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.cartTable().getByRole('row', { name: new RegExp(escaped, 'i') });
  }

  quantityInputForRow(row: Locator): Locator {
    return row.getByRole('textbox').first();
  }

  removeControlForRow(row: Locator): Locator {
    return row.locator('a[title*="Remove" i], button[title*="Remove" i], a[href*="remove" i]').first();
  }

  totalsTotalRow(): Locator {
    return this.page.getByRole('row').filter({ hasText: /^Total:/i }).first();
  }

  couponInput(): Locator {
    return this.page.locator(
      '#coupon_coupon, #coupon_code, form#coupon input[type="text"], form#coupon input[id*="coupon" i], form#coupon input[name*="coupon" i], input[id*="coupon" i], input[name*="coupon" i]',
    );
  }

  applyCouponButton(): Locator {
    return this.page.locator(
      'form#coupon #apply_coupon, form#coupon #coupon_apply, #apply_coupon, #coupon_apply, form#coupon button:has-text("Apply"), form#coupon input[value*="Apply" i], button:has-text("Apply"), input[value*="Apply" i], button[title*="Apply" i], input[title*="Apply" i]',
    );
  }

  couponMessage(): Locator {
    return this.page
      .locator('#maincontainer .alert, #maincontainer .alert-error, #maincontainer .error, #maincontainer .help-block')
      .first();
  }
}
