import { test, expect } from '@playwright/test';

test.describe('login tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('valid login', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
        await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });

    test('invalid password', async ({ page }) => {
        await page.getByRole('textbox', { name: 'username' }).fill('Admin');
        await page.getByRole('textbox', { name: 'password' }).fill('1234');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByRole('alert').locator('div').filter({ hasText: 'Invalid credentials' })).toBeVisible();
    });

    test('invalid username', async ({ page }) => {
        await page.getByRole('textbox', { name: 'username' }).fill('1234');
        await page.getByRole('textbox', { name: 'password' }).fill('admin123');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByRole('alert').locator('div').filter({ hasText: 'Invalid credentials' })).toBeVisible();
    });

    test('empty credentials', async ({ page }) => {
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByText('Required').first()).toBeVisible();
        await expect(page.getByText('Required').last()).toBeVisible();
    });

    test('password case sensitivity', async ({ page }) => {
        await page.getByRole('textbox', { name: 'username' }).fill('Admin');
        await page.getByRole('textbox', { name: 'password' }).fill('AdMiN123');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByRole('alert').locator('div').filter({ hasText: 'Invalid credentials' })).toBeVisible();
    });
});