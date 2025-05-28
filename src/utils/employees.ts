import { expect, Page } from "@playwright/test";

type Employee = {
    firstName: string;
    middleName?: string;
    lastName: string;
};

export async function createEmployee(page: Page, employee: Employee): Promise<string> {
    await page.getByRole('link', { name: 'Add Employee' }).click();
    await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
    await page.getByRole('textbox', { name: 'First Name' }).fill(employee.firstName);
    await page.getByRole('textbox', { name: 'Middle Name' }).fill(employee.middleName || '');
    await page.getByRole('textbox', { name: 'Last Name' }).fill(employee.lastName);

    const employeeId = await page.locator('div:has-text("Employee Id") + div input').inputValue();

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();

    return employeeId;
}

export async function deleteEmployee(page: Page, employeeId: string, employeeIdsArray?: string[]) {
    await page.getByRole('link', { name: 'Employee List' }).click();
    await page.locator('div:has-text("Employee Id") + div input').fill(employeeId);
    await page.getByRole('button', { name: 'Search' }).click();
    const employeeRow = page.getByRole('row').filter({ hasText: employeeId });

    await expect(employeeRow).toBeVisible();

    const deleteButton = page.getByRole('row').filter({ hasText: employeeId }).locator('button:has(.bi-trash)');
    await deleteButton.click();
    await page.locator('button:has-text("Yes, Delete")').click();

    if (employeeIdsArray) {
        const idx = employeeIdsArray.indexOf(employeeId);
        if (idx !== -1) employeeIdsArray.splice(idx, 1);
    }
}