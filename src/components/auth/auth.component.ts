import { type Locator, type Page } from '@playwright/test';

export class AuthComponent {
  constructor(private readonly page: Page) {}

  // Registration form
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
    return this.page.locator(
      'button[title="Continue"], input[title="Continue"], button:has-text("Continue"), input[value="Continue"]',
    );
  }

  registrationAlerts(): Locator {
    return this.page.locator('.alert, .alert-error, .error, .help-block');
  }

  accountCreatedHeading(): Locator {
    return this.page.getByRole('heading', { name: /your account has been created/i });
  }

  // Login form
  loginEmailOrUsername(): Locator {
    return this.page.locator('#loginFrm_loginname');
  }

  loginPassword(): Locator {
    return this.page.locator('#loginFrm_password');
  }

  loginButton(): Locator {
    return this.page.locator(
      'button[title="Login"], input[title="Login"], button:has-text("Login"), input[value="Login"]',
    );
  }

  // Global auth state
  logoffLink(): Locator {
    return this.page.getByRole('link', { name: /logoff|logout/i }).first();
  }

  returningCustomerHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Returning Customer', exact: true });
  }

  body(): Locator {
    return this.page.locator('body');
  }
}
