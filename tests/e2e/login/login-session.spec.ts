import { test, expect } from '@playwright/test';
import { AuthPage } from '@pages/auth/auth.page';
import { uniqueUser, validateUser } from '@utils/data';
import { routes } from '@config/routes';

test.describe('Login / Session', () => {
  let auth: AuthPage;

  test.beforeEach(async ({ page }) => {
    auth = new AuthPage(page);
  });

  test('logs in, persists session on refresh, logs out', async ({ page }) => {
    const user = uniqueUser('pw');
    validateUser(user);

    await test.step('Register a new user', async () => {
      await auth.goToRegister();
      await expect(page).toHaveURL(routes.account.matchers.create);

      await auth.fillPersonalDetails(user);
      await auth.fillAddressDetails();
      await auth.selectCountry({ preferUnitedStates: true });
      await auth.fillCredentials(user);
      await auth.selectRegionState(1);
      await auth.setPrivacyAccepted(true);
      await auth.submitRegistration();

      const outcome = await auth.waitForRegistrationOutcome();
      if (outcome === 'validation' && (await auth.isRegionStateValidationPresent())) {
        await auth.recoverFromRegionStateValidation(user, 1);
        await auth.waitForRegistrationOutcome();
      }

      await auth.expectAccountCreated();
    });

    await test.step('Logout after registration', async () => {
      await auth.logout();
      await expect(page).toHaveURL(routes.account.matchers.logout);
    });

    await test.step('Login with created credentials', async () => {
      await auth.goToLogin();
      await expect(page).toHaveURL(routes.account.matchers.login);
      await auth.login(user.username, user.password);
      await auth.expectLoggedIn();
    });

    await test.step('Verify session persists on reload', async () => {
      await page.reload();
      await auth.expectLoggedIn();
    });

    await test.step('Logout and verify logged-out state', async () => {
      await auth.logout();
      await expect(page).toHaveURL(routes.account.matchers.logout);
      await auth.expectLoggedOutMessage();

      await auth.goToLogin();
      await expect(page).toHaveURL(routes.account.matchers.login);
      await auth.expectReturningCustomerLoginFormVisible();
    });
  });
});
