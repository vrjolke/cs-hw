import { test, expect } from '@playwright/test';
import employees from './data/employees.json';

test.describe('PIM tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
        await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
        await page.getByRole('button', { name: 'Login' }).click();
        await page.getByRole('link', { name: 'PIM' }).click();
    });

    test('create users', async ({ page }) => {
        await page.getByRole('link', { name: 'Add Employee' }).click();
        await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();

        const createdEmployeeIds: string[] = [];

        for (let employee of employees) {
            await page.getByRole('textbox', { name: 'First Name' }).fill(employee.firstName);
            await page.getByRole('textbox', { name: 'Middle Name' }).fill(employee.middleName || '');
            await page.getByRole('textbox', { name: 'Last Name' }).fill(employee.lastName);
            const employeeId = await page.locator('div:has-text("Employee Id") + div input').inputValue();
            createdEmployeeIds.push(employeeId);
            await page.getByRole('button', { name: 'Save' }).click();
            await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible({timeout: 10_000});
            await page.getByRole('link', { name: 'Add Employee' }).click();
        }

        //cleanup
        for (let employeeId of createdEmployeeIds) {
            await page.getByRole('link', { name: 'Employee List' }).click();
            await page.locator('div:has-text("Employee Id") + div input').fill(employeeId);
            await page.getByRole('button', { name: 'Search' }).click();
            const deleteButton = page.getByRole('row').filter({ hasText: employeeId }).locator('button:has(.bi-trash)');
            await deleteButton.click();
            await page.locator('button:has-text("Yes, Delete")').click();
        }
    });
});
