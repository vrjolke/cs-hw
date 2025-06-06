import { type Page, type Locator } from '@playwright/test';
import { get } from 'http';

export class EmployeeListPage {
  readonly page: Page;
  readonly employeeListNavButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.employeeListNavButton = page.getByRole('link', { name: 'Employee List' });
    this.searchInput = page.locator('div:has-text("Employee Id") + div input');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.confirmDeleteButton = page.locator('button:has-text("Yes, Delete")');
  }

  async goto() {
    await this.employeeListNavButton.click();
    await this.page.waitForURL('**/viewEmployeeList');
  }

  async searchEmployee(employeeId: string) {
    await this.searchInput.fill(employeeId);
    await this.searchButton.click();
  }

  async getEmployeeRow(employeeId: string): Promise<Locator> {
    return this.page.getByRole('row').filter({ hasText: employeeId });
  }

  async selectEmployeeRow(employeeId: string) {
    const employeeRow = await this.getEmployeeRow(employeeId);
    await employeeRow.click();
  }

  async getEmployeeRowDeleteButton(employeeId: string): Promise<Locator> {
    return this.page
      .getByRole('row')
      .filter({ hasText: employeeId })
      .locator('button:has(.bi-trash)');
  }

  async deleteEmployee(employeeId: string, employeeIdsArray?: string[]) {
    const employeeRowDeleteButton = await this.getEmployeeRowDeleteButton(employeeId);
    await employeeRowDeleteButton.click();
    await this.confirmDeleteButton.click();
    
    if (employeeIdsArray) {
        const idx = employeeIdsArray.indexOf(employeeId);
        if (idx !== -1) employeeIdsArray.splice(idx, 1);
    }
  }
}
