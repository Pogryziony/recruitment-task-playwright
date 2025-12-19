import { test, expect } from '../../src/fixtures/test';
import { AuthPage } from '../../src/pages/auth.page';

test.describe('Login / Session', () => {
  test('logs in, persists session on refresh, logs out', async ({ page, user }) => {
    const auth = new AuthPage(page);

    // Create a user first (keeps test independent from pre-existing creds)
    await auth.gotoRegister();
    await auth.register(user);
    await expect(page).toHaveURL(/rt=account\/success/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: /your account has been created/i })).toBeVisible();

    // Registration signs the user in; log out so we can explicitly cover the login flow.
    await auth.logout();

    // Go to login page and sign in
    await auth.gotoLogin();
    await auth.login(user.username, user.password);
    await auth.expectLoggedIn();

    // Session persistence
    await page.reload();
    await auth.expectLoggedIn();

    // Logout
    await auth.logout();
    await expect(page.locator('body')).toContainText(/account logout|you have been logged off/i);

    // Logged-out state: login link visible again
    await auth.gotoLogin();
    await expect(page.getByRole('heading', { name: 'Returning Customer', exact: true })).toBeVisible();
  });
});
