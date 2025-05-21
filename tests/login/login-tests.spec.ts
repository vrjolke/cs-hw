import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();
const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

test.describe('login tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('valid login', async ({ page }) => {
        await page.getByRole('textbox', { name: 'Username' }).fill(username!);
        await page.getByRole('textbox', { name: 'Password' }).fill(password!);
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });

    test('invalid password', async ({ page }) => {
        await page.getByRole('textbox', { name: 'username' }).fill(username!);
        await page.getByRole('textbox', { name: 'password' }).fill('wrongpassword1234');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page
            .getByRole('alert')
            .filter({ hasText: 'Invalid credentials' }))
            .toBeVisible();
    });

    test('invalid username', async ({ page }) => {
        await page.getByRole('textbox', { name: 'username' }).fill('wrongusername1234');
        await page.getByRole('textbox', { name: 'password' }).fill(password!);
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page
            .getByRole('alert')
            .filter({ hasText: 'Invalid credentials' }))
            .toBeVisible();
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

    test('password case sensitivity', async ({ page }) => {
        await page.getByRole('textbox', { name: 'username' }).fill(username!);
        await page.getByRole('textbox', { name: 'password' }).fill('AdMiN123');
        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page
            .getByRole('alert')
            .filter({ hasText: 'Invalid credentials' }))
            .toBeVisible();
    });
});