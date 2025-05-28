import { test, expect } from '@src/utils/custom-fixtures';
import { createEmployee, deleteEmployee } from '@src/utils/employees';
import employeesMultiple from './data/employees-multiple.json';
import employeeSingle from './data/employee-single.json';
import personalDetails from './data/personal-details.json';

const testAssetsPath = './test-assets/';

test.describe('PIM tests', () => {

    let createdEmployeeIds: string[] = [];

    test.beforeEach(async ({ loginPage, pimPage, username, password }) => {
        await loginPage.goto();
        await loginPage.login(username!, password!);
        await pimPage.goto();
    });

    test.afterEach(async ({ page }) => {
        if (!createdEmployeeIds.length) return;

        for (const id of createdEmployeeIds) {
            await deleteEmployee(page, id);
        }

        createdEmployeeIds = [];
    });

    test('create employee', async ({ page }) => {
        for (let employee of employeesMultiple) {
            const employeeId = await createEmployee(page, employee);
            createdEmployeeIds.push(employeeId);
        }
    });

    test('upload profile picture', async ({ page }) => {
        const profilePictureFileName = 'profile-picture.png';
        const employeeId = await createEmployee(page, employeeSingle);
        createdEmployeeIds.push(employeeId);

        await page.locator('.employee-image').click();
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.locator('.bi-plus').click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(require('path').resolve(__dirname, testAssetsPath + profilePictureFileName));
        await page.getByRole('button', { name: 'Save' }).click();

        await expect(page.getByText('Successfully Updated')).toBeVisible();
    });

    test('fill personal details', async ({ page }) => {
        const employeeId = await createEmployee(page, employeeSingle);
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
            .filter({ hasText: personalDetails.gender })
            .locator('span')
            .click();
        await page
            .locator('button')
            .filter({ hasText: 'Save' })
            .first()
            .click();

        await expect(page.getByText('Successfully Updated')).toBeVisible();
    });

    test('add attachment', async ({ page }) => {
        const attachmentFileName = 'attachment.pdf';
        const employeeId = await createEmployee(page, employeeSingle);
        createdEmployeeIds.push(employeeId);

        await page.locator('button:has-text("Add")').click();
        const fileChooserPromise = page.waitForEvent('filechooser');

        await page.getByText('Browse').click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(require('path').resolve(__dirname, testAssetsPath + attachmentFileName));

        await page.getByRole('textbox', { name: 'Type comment here' }).fill('test1234');

        await page.getByRole('button', { name: 'Save' }).last().click();

        await expect(page.getByText('Successfully Saved')).toBeVisible();
        await expect(page.getByRole('row').filter({ hasText: attachmentFileName })).toBeVisible();
    });

    test('delete employee', async ({ page }) => {
        const employeeId = await createEmployee(page, employeeSingle);
        createdEmployeeIds.push(employeeId);
        await deleteEmployee(page, employeeId, createdEmployeeIds);

        await expect(page.getByText('Successfully Deleted')).toBeVisible();
        await expect(page.getByRole('row').filter({ hasText: employeeId })).not.toBeVisible();
    });
});
