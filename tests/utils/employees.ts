import { expect } from "@playwright/test";

type Employee = {
    firstName: string;
    middleName?: string;
    lastName: string;
};

export async function createEmployee(page, employee: Employee): Promise<string> {
    await page.getByRole('textbox', { name: 'First Name' }).fill(employee.firstName);
    await page.getByRole('textbox', { name: 'Middle Name' }).fill(employee.middleName || '');
    await page.getByRole('textbox', { name: 'Last Name' }).fill(employee.lastName);

    const employeeId = await page.locator('div:has-text("Employee Id") + div input').inputValue();

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible({ timeout: 10_000 });
    await page.getByRole('link', { name: 'Add Employee' }).click();

    return employeeId;
}

export async function deleteEmployee(page, employeeId: string) {
    await page.getByRole('link', { name: 'Employee List' }).click();
    await page.locator('div:has-text("Employee Id") + div input').fill(employeeId);
    await page.getByRole('button', { name: 'Search' }).click();
    const deleteButton = page.getByRole('row').filter({ hasText: employeeId }).locator('button:has(.bi-trash)');
    await deleteButton.click();
    await page.locator('button:has-text("Yes, Delete")').click();
}