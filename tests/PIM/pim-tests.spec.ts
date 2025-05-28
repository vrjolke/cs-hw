import { test, expect } from '@src/utils/custom-fixtures';
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

    test.afterEach(async ({ employeeListPage, page }) => {
        if (!createdEmployeeIds.length) return;

        // copy to avoid mutation-during-iteration issue
        for (const id of [...createdEmployeeIds]) {
            await employeeListPage.goto();
            await employeeListPage.searchEmployee(id);
            await employeeListPage.deleteEmployee(id, createdEmployeeIds);
            await expect(page.getByText('Successfully Deleted')).toBeVisible();
        }
    });

    test('add employee', async ({ addEmployeePage, page }) => {
        for (let employee of employeesMultiple) {
            const employeeId = await addEmployeePage.addEmployee(employee);
            createdEmployeeIds.push(employeeId);

            await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
        }
    });

    test('upload profile picture', async ({ addEmployeePage, personalDetailsPage, page }) => {
        const profilePictureFileName = 'profile-picture.png';
        const employeeId = await addEmployeePage.addEmployee(employeeSingle);
        createdEmployeeIds.push(employeeId);

        await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();
        await personalDetailsPage.uploadProfilePicture(__dirname, testAssetsPath + profilePictureFileName);

        await expect(page.getByText('Successfully Updated')).toBeVisible();
    });

    test('fill personal details', async ({ addEmployeePage, personalDetailsPage, page }) => {
        const employeeId = await addEmployeePage.addEmployee(employeeSingle);
        createdEmployeeIds.push(employeeId);
        await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();

        await personalDetailsPage.fillPersonalDetails(personalDetails);

        await expect(page.getByText('Successfully Updated')).toBeVisible();
    });

    test('add attachment', async ({ addEmployeePage, personalDetailsPage, page }) => {
        const attachmentFileName = 'attachment.pdf';
        const employeeId = await addEmployeePage.addEmployee(employeeSingle);
        createdEmployeeIds.push(employeeId);
        await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();

        await personalDetailsPage.addAttachmentWithComment(__dirname, testAssetsPath + attachmentFileName, 'Test Attachment Comment');

        await expect(page.getByText('Successfully Saved')).toBeVisible();
        await expect(page.getByRole('row').filter({ hasText: attachmentFileName })).toBeVisible();
    });

    test('delete employee', async ({ addEmployeePage, employeeListPage, page }) => {
        const employeeId = await addEmployeePage.addEmployee(employeeSingle);
        createdEmployeeIds.push(employeeId);
        await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();

        await employeeListPage.goto();
        await employeeListPage.searchEmployee(employeeId);
        await expect(page.getByRole('row').filter({ hasText: employeeId })).toBeVisible();

        await employeeListPage.deleteEmployee(employeeId, createdEmployeeIds);

        await expect(page.getByText('Successfully Deleted')).toBeVisible();
        await expect(page.getByRole('row').filter({ hasText: employeeId })).not.toBeVisible();
    });
});
