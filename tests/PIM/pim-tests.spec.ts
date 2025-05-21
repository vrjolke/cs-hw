import { test, expect } from '@playwright/test';
import employees from './data/employees.json';
import { createEmployee, deleteEmployee } from '../utils/employees';

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
            const employeeId = await createEmployee(page, employee);
            createdEmployeeIds.push(employeeId);
        }

        //cleanup
        for (let employeeId of createdEmployeeIds) {
            await deleteEmployee(page, employeeId);
        }
    });
});
