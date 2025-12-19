import { expect, type Locator, type Page } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async gotoRegister() {
    await this.page.goto('/index.php?rt=account/create');
    await expect(this.page).toHaveURL(/rt=account\/create/);
  }

  async gotoLogin() {
    await this.page.goto('/index.php?rt=account/login');
    await expect(this.page).toHaveURL(/rt=account\/login/);
  }

  firstName(): Locator {
    return this.page.locator('#AccountFrm_firstname');
  }

  lastName(): Locator {
    return this.page.locator('#AccountFrm_lastname');
  }

  email(): Locator {
    return this.page.locator('#AccountFrm_email');
  }

  address1(): Locator {
    return this.page.locator('#AccountFrm_address_1');
  }

  city(): Locator {
    return this.page.locator('#AccountFrm_city');
  }

  region(): Locator {
    return this.page.locator('#AccountFrm_zone_id');
  }

  postcode(): Locator {
    return this.page.locator('#AccountFrm_postcode');
  }

  country(): Locator {
    return this.page.locator('#AccountFrm_country_id');
  }

  loginName(): Locator {
    return this.page.locator('#AccountFrm_loginname');
  }

  password(): Locator {
    return this.page.locator('#AccountFrm_password');
  }

  passwordConfirm(): Locator {
    return this.page.locator('#AccountFrm_confirm');
  }

  agreePrivacy(): Locator {
    return this.page.locator('#AccountFrm_agree');
  }

  continueButton(): Locator {
    return this.page.locator('button[title="Continue"], input[title="Continue"], button:has-text("Continue"), input[value="Continue"]');
  }

  async register(user: { username: string; email: string; password: string }, opts?: { skipPrivacy?: boolean }) {
    await this.firstName().fill('Playwright');
    await this.lastName().fill('Tester');
    await this.email().fill(user.email);
    await this.address1().fill('1 Test Street');
    await this.city().fill('Testville');

    // Ensure dropdowns have values; use simple robust selection.
    await this.country().waitFor({ state: 'visible' });
    const countryOptions = await this.country().locator('option').allTextContents();
    const usIndex = countryOptions.findIndex((t) => /united states/i.test(t));
    await this.country().selectOption({ index: usIndex >= 0 ? usIndex : 1 });

    await this.postcode().fill('12345');
    await this.loginName().fill(user.username);
    await this.password().fill(user.password);
    await this.passwordConfirm().fill(user.password);

    // Select region as late as possible (some dynamic forms repopulate/reset it).
    await this.region().waitFor({ state: 'visible' });
    await expect(this.region()).toBeEnabled();
    await expect.poll(async () => await this.region().locator('option').count()).toBeGreaterThan(1);
    await expect.poll(async () => (await this.region().locator('option').nth(1).textContent()) ?? '').not.toMatch(/please select/i);

    // Prefer a deterministic DOM-based selection here. The site sometimes resets the value back to placeholder
    // after a normal selectOption; forcing the selectedIndex + change event proved more stable.
    await this.page.evaluate(() => {
      const select = document.querySelector('#AccountFrm_zone_id') as HTMLSelectElement | null;
      if (!select) return;
      if (select.options.length > 1) {
        select.selectedIndex = 1;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await expect.poll(async () => (await this.region().locator('option:checked').textContent()) ?? '').not.toMatch(/please select/i);

    if (!opts?.skipPrivacy) {
      await this.agreePrivacy().check();
    }

    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      this.continueButton().first().click(),
    ]);
  }

  loginEmailOrUsername(): Locator {
    return this.page.locator('#loginFrm_loginname');
  }

  loginPassword(): Locator {
    return this.page.locator('#loginFrm_password');
  }

  loginButton(): Locator {
    return this.page.locator('button[title="Login"], input[title="Login"], button:has-text("Login"), input[value="Login"]');
  }

  async login(login: string, password: string) {
    await this.loginEmailOrUsername().fill(login);
    await this.loginPassword().fill(password);
    await this.loginButton().first().click();
  }

  async expectLoggedIn() {
    // "Logoff" link exists when signed in.
    await expect(this.page.getByRole('link', { name: /logoff|logout/i }).first()).toBeVisible();
  }

  async logout() {
    const link = this.page.getByRole('link', { name: /logoff|logout/i }).first();
    await link.click();
    await expect(this.page).toHaveURL(/rt=account\/logout/);
  }
}
