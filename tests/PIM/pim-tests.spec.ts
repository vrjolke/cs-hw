import { test, expect } from '@playwright/test';
import employees from './data/employees.json';
import personalDetails from './data/personal-details.json';
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
        await fileChooser.setFiles(require('path').resolve(__dirname, './fixtures/profile-picture.png'));
        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByText('Successfully Updated')).toBeVisible();
    });

    test('fill personal details', async ({ page }) => {
        const employeeId = await createEmployee(page, employees[0]);
        createdEmployeeIds.push(employeeId);

        const driversLicenseInputField = page
            .locator('div.oxd-input-group')
            .filter({ hasText: "Driver's License Number" })
            .getByRole('textbox');

        const licenseExpirityDate = page
            .locator('div.oxd-input-group')
            .filter({ hasText: "License Expiry Date" })
            .getByPlaceholder('yyyy-dd-mm')

        const nationalitySelect = page
            .locator('div.oxd-input-group')
            .filter({ hasText: "Nationality" })
            .locator('.oxd-select-text');

        const maritalStatusSelect = page
            .locator('div.oxd-input-group')
            .filter({ hasText: "Marital Status" })
            .locator('.oxd-select-text');

        const dateOfBirthInputField = page
            .locator('div.oxd-input-group')
            .filter({ hasText: 'Date of Birth' })
            .getByPlaceholder('yyyy-dd-mm');

        await driversLicenseInputField.fill(personalDetails.driversLicense);
        await licenseExpirityDate.fill(personalDetails.licenseExpiryDate);

        await nationalitySelect.click();
        await page.getByRole('option', { name: personalDetails.nationality }).click();

        await maritalStatusSelect.click();
        await page.getByRole('option', { name: personalDetails.maritalStatus }).click();

        await dateOfBirthInputField.fill(personalDetails.dateOfBirth);

        await page
            .locator('label')
            .filter({ hasText: personalDetails.gender})
            .locator('span')
            .click();
        await page
            .locator('button')
            .filter({ hasText: 'Save' })
            .first()
            .click();

        await expect(page.getByText('Successfully Updated')).toBeVisible();
    });
});
