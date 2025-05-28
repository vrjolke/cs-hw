import { test, expect } from '@src/utils/custom-fixtures';


test.describe('login tests', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goto();
    });

    test('valid login', async ({ loginPage, page, username, password }) => {
        await loginPage.login(username!, password!);

        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });

    test('invalid password', async ({ loginPage, username}) => {
        await loginPage.login(username!, 'wrongpassword1234');

        await expect(loginPage.invalidCredentialsError).toBeVisible();
    });

    test('invalid username', async ({ loginPage, password }) => {
        await loginPage.login('wrongusername1234', password!);

        await expect(loginPage.invalidCredentialsError).toBeVisible();
    });

    test('empty credentials', async ({ page }) => {
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page
            .getByText('Required')
            .first())
            .toBeVisible();
        await expect(page
            .getByText('Required')
            .last())
            .toBeVisible();
    });

    test('password case sensitivity', async ({ loginPage, username, password }) => {
        await loginPage.login(username!, password!.toUpperCase());

        await expect(loginPage.invalidCredentialsError).toBeVisible();
    });
});