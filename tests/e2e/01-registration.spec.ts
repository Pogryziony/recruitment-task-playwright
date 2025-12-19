import { test, expect } from '../../src/fixtures/test';
import { AuthPage } from '../../src/pages/auth.page';

test.describe('User Registration', () => {
  test('registers a new user (happy path)', async ({ page, user }) => {
    const auth = new AuthPage(page);

    await auth.gotoRegister();
    await auth.register(user);

    await expect(page.getByRole('heading', { name: /your account has been created/i })).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(/rt=account\/success/);
  });

  test('shows validation when privacy policy is not accepted', async ({ page, user }) => {
    const auth = new AuthPage(page);

    await auth.gotoRegister();
    await auth.register(user, { skipPrivacy: true });

    // Validation error summary appears near top.
    await expect(page.locator('.alert, .alert-error, .error, .help-block').first()).toBeVisible();
    await expect(page.locator('body')).toContainText(/privacy policy|agree/i);
  });
});
