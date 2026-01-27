import { expect, type Page } from '@playwright/test';
import { AuthComponent } from '@components/auth/auth.component';
import { routes } from '@config/routes';
import { TimeoutMs } from '@config/timeouts';
import { type RegisteredUser } from '@utils/data';

export type RegistrationOutcome = 'success' | 'validation';

export class AuthPage {
  readonly page: Page;
  private readonly ui: AuthComponent;

  constructor(page: Page) {
    this.page = page;
    this.ui = new AuthComponent(page);
  }

  private async selectRegionReliably(desiredOptionIndex: number) {
    const regionSelect = this.ui.region();
    await regionSelect.waitFor({ state: 'visible' });

    const regionSelectHandle = await regionSelect.elementHandle();
    if (!regionSelectHandle) {
      throw new Error('Region/State select element not found');
    }

    await this.page.waitForFunction(
      ({ selectElement, desiredOptionIndex }) => {
        const regionSelect = selectElement as HTMLSelectElement;
        if (!regionSelect) return false;
        if (regionSelect.disabled) return false;
        if (regionSelect.options.length <= desiredOptionIndex) return false;

        const desiredOptionText = (regionSelect.options[desiredOptionIndex]?.textContent ?? '').trim();
        if (/please select/i.test(desiredOptionText)) return false;

        const stableSinceKey = 'pwStableSince';
        const lastIndexKey = 'pwLastSelectedIndex';

        if (regionSelect.selectedIndex !== desiredOptionIndex) {
          regionSelect.selectedIndex = desiredOptionIndex;
          regionSelect.dispatchEvent(new Event('input', { bubbles: true }));
          regionSelect.dispatchEvent(new Event('change', { bubbles: true }));
          regionSelect.dataset[stableSinceKey] = '0';
          regionSelect.dataset[lastIndexKey] = String(regionSelect.selectedIndex);
          return false;
        }

        const now = Date.now();
        const lastSeenIndex = Number(regionSelect.dataset[lastIndexKey] ?? 'NaN');
        const stableSince = Number(regionSelect.dataset[stableSinceKey] ?? '0');

        if (lastSeenIndex !== regionSelect.selectedIndex) {
          regionSelect.dataset[lastIndexKey] = String(regionSelect.selectedIndex);
          regionSelect.dataset[stableSinceKey] = String(now);
          return false;
        }

        if (!stableSince) {
          regionSelect.dataset[stableSinceKey] = String(now);
          return false;
        }

        return now - stableSince > 350;
      },
      { selectElement: regionSelectHandle, desiredOptionIndex },
      { timeout: TimeoutMs.S20, polling: 100 },
    );
  }

  async goToRegister() {
    await this.page.goto(routes.account.create, { waitUntil: 'commit' });
    await this.page.waitForURL(routes.account.matchers.create, { waitUntil: 'commit' });
    await this.ui.firstName().waitFor({ state: 'visible', timeout: TimeoutMs.S20 });
  }

  async goToLogin() {
    await this.page.goto(routes.account.login, { waitUntil: 'commit' });
    await this.page.waitForURL(routes.account.matchers.login, { waitUntil: 'commit' });
    await this.ui.loginEmailOrUsername().waitFor({ state: 'visible', timeout: TimeoutMs.S20 });
  }

  async fillPersonalDetails(user: RegisteredUser) {
    await this.ui.firstName().fill('Playwright');
    await this.ui.lastName().fill('Tester');
    await this.ui.email().fill(user.email);
  }

  async fillAddressDetails() {
    await this.ui.address1().fill('1 Test Street');
    await this.ui.city().fill('Testville');
    await this.ui.postcode().fill('12345');
  }

  async selectCountry(opts?: { preferUnitedStates?: boolean }) {
    await this.ui.country().waitFor({ state: 'visible' });
    const preferUnitedStates = opts?.preferUnitedStates ?? true;

    if (preferUnitedStates) {
      const countryOptions = await this.ui.country().locator('option').allTextContents();
      const usIndex = countryOptions.findIndex((t) => /united states/i.test(t));
      await this.ui.country().selectOption({ index: usIndex >= 0 ? usIndex : 1 });
      return;
    }

    await this.ui.country().selectOption({ index: 1 });
  }

  async fillCredentials(user: RegisteredUser) {
    await this.ui.loginName().fill(user.username);
    await this.ui.password().fill(user.password);
    await this.ui.passwordConfirm().fill(user.password);
  }

  async selectRegionState(index: number = 1) {
    await this.ui.region().waitFor({ state: 'visible' });
    await this.selectRegionReliably(index);
  }

  async setPrivacyAccepted(accepted: boolean) {
    if (accepted) {
      await this.ui.agreePrivacy().check();
      return;
    }

    await this.ui.agreePrivacy().uncheck();
  }

  async submitRegistration() {
    await this.ui.continueButton().first().click();
  }

  async waitForRegistrationOutcome(): Promise<RegistrationOutcome> {
    const outcome = await Promise.race([
      this.page
        .waitForURL(routes.account.matchers.success, { timeout: TimeoutMs.S20, waitUntil: 'domcontentloaded' })
        .then(() => 'success' as const),
      this.ui.accountCreatedHeading().waitFor({ state: 'visible', timeout: TimeoutMs.S20 }).then(() => 'success' as const),
      this.ui.registrationAlerts().first().waitFor({ state: 'visible', timeout: TimeoutMs.S20 }).then(() => 'validation' as const),
    ]);

    return outcome;
  }

  async isRegionStateValidationPresent(): Promise<boolean> {
    if (!routes.account.matchers.create.test(this.page.url())) return false;

    const bodyText = (await this.ui.body().textContent()) ?? '';
    return /region|state/i.test(bodyText);
  }

  async recoverFromRegionStateValidation(user: RegisteredUser, index: number = 1) {
    await this.selectRegionReliably(index);
    // Some validation paths clear password fields.
    await this.ui.password().fill(user.password);
    await this.ui.passwordConfirm().fill(user.password);
    await this.submitRegistration();
  }

  async login(login: string, password: string) {
    await this.ui.loginEmailOrUsername().fill(login);
    await this.ui.loginPassword().fill(password);
    await this.ui.loginButton().first().click();
  }

  async expectLoggedIn() {
    await expect(this.ui.logoffLink()).toBeVisible();
  }

  async logout() {
    await Promise.all([
      this.page.waitForURL(routes.account.matchers.logout, { waitUntil: 'commit' }),
      this.ui.logoffLink().click({ noWaitAfter: true }),
    ]);
  }

  async expectAccountCreated() {
    await expect(this.page).toHaveURL(routes.account.matchers.success, { timeout: TimeoutMs.S20 });
    await expect(this.ui.accountCreatedHeading()).toBeVisible();
  }

  async expectRegistrationValidationError() {
    await expect(this.ui.registrationAlerts().first()).toBeVisible();
    await expect(this.ui.body()).toContainText(/privacy policy|agree/i);
  }

  async expectReturningCustomerLoginFormVisible() {
    await expect(this.ui.returningCustomerHeading()).toBeVisible();
  }

  async expectLoggedOutMessage() {
    await expect(this.ui.body()).toContainText(/account logout|you have been logged off/i);
  }
}
