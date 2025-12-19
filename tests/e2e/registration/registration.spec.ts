import { test, expect } from '@playwright/test';
import { AuthPage } from '@pages/auth/auth.page';
import { uniqueUser, validateUser } from '@utils/data';
import { routes } from '@config/routes';

test.describe('User Registration', () => {
  let auth: AuthPage;

  test.beforeEach(async ({ page }) => {
    auth = new AuthPage(page);
  });

  test('registers a new user (happy path)', async ({ page }) => {
    const user = uniqueUser('pw');
    validateUser(user);

    await test.step('Open registration page', async () => {
      await auth.goToRegister();
      await expect(page).toHaveURL(routes.account.matchers.create);
    });

    await test.step('Fill registration form', async () => {
      await auth.fillPersonalDetails(user);
      await auth.fillAddressDetails();
      await auth.selectCountry({ preferUnitedStates: true });
      await auth.fillCredentials(user);
      await auth.selectRegionState(1);
      await auth.setPrivacyAccepted(true);
    });

    await test.step('Submit registration form', async () => {
      await auth.submitRegistration();
    });

    await test.step('Wait for success or validation', async () => {
      const outcome = await auth.waitForRegistrationOutcome();
      if (outcome === 'success') return;

      // Best-effort recovery for the demo site: region/state occasionally fails validation.
      if (await auth.isRegionStateValidationPresent()) {
        await auth.recoverFromRegionStateValidation(user, 1);
        await auth.waitForRegistrationOutcome();
      }
    });

    await test.step('Verify account created', async () => {
      await auth.expectAccountCreated();
    });
  });

  test('shows validation when privacy policy is not accepted', async ({ page }) => {
    const user = uniqueUser('pw');
    validateUser(user);

    await test.step('Open registration page', async () => {
      await auth.goToRegister();
      await expect(page).toHaveURL(routes.account.matchers.create);
    });

    await test.step('Fill registration form without privacy acceptance', async () => {
      await auth.fillPersonalDetails(user);
      await auth.fillAddressDetails();
      await auth.selectCountry({ preferUnitedStates: true });
      await auth.fillCredentials(user);
      await auth.selectRegionState(1);
      await auth.setPrivacyAccepted(false);
    });

    await test.step('Submit registration form', async () => {
      await auth.submitRegistration();
      await auth.waitForRegistrationOutcome();
    });

    await test.step('Verify validation error', async () => {
      await auth.expectRegistrationValidationError();
    });
  });
});
