import { type Page, type Locator } from '@playwright/test';

type Employee = {
    firstName: string;
    middleName?: string;
    lastName: string;
};

export class AddEmployeePage {
    readonly page: Page;
    readonly addEmployeeNavButton: Locator;
    readonly firstNameInput: Locator;
    readonly middleNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly employeeIdInput: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addEmployeeNavButton = page.getByRole('link', { name: 'Add Employee' });
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.middleNameInput = page.getByRole('textbox', { name: 'Middle Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
        this.employeeIdInput = page.locator('div:has-text("Employee Id") + div input');
        this.saveButton = page.getByRole('button', { name: 'Save' });
    }

    async goto() {
        await this.addEmployeeNavButton.click();
        await this.page.waitForURL('**/addEmployee');
    }

    async addEmployee(employee: Employee): Promise<string> {
        await this.goto();
        await this.firstNameInput.fill(employee.firstName);
        await this.middleNameInput.fill(employee.middleName || '');
        await this.lastNameInput.fill(employee.lastName);

        const employeeId = await this.employeeIdInput.inputValue();

        await this.saveButton.click();

        return employeeId;
    }
}
