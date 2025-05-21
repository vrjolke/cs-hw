import { test, expect } from '@playwright/test';
import employees from './data/employees.json';
import { createEmployee, deleteEmployee } from '../utils/employees';

test.describe('PIM tests', () => {

    let createdEmployeeIds: string[] = [];

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
        await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
        await page.getByRole('button', { name: 'Login' }).click();
        await page.getByRole('link', { name: 'PIM' }).click();
    });

    test.afterEach(async ({ page }) => {
        if (!createdEmployeeIds.length) return;

        for (const id of createdEmployeeIds) {
            await deleteEmployee(page, id);
        }

        createdEmployeeIds = [];
    });

    test('create users', async ({ page }) => {
        const createdEmployeeIds: string[] = [];

        for (let employee of employees) {
            const employeeId = await createEmployee(page, employee);
            createdEmployeeIds.push(employeeId);
        }
    });

    test('upload profile picture', async ({ page }) => {
        const employeeId = await createEmployee(page, employees[0]);
        createdEmployeeIds.push(employeeId);

        await page.locator('.employee-image').click();
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.locator('.bi-plus').click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(require('path').resolve(__dirname, './fixtures/profile_picture.png'));
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('Successfully Updated')).toBeVisible();
    });
});
