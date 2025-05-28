import { type Page, type Locator } from '@playwright/test';

export class EmployeeListPage {
  readonly page: Page;
  readonly employeeListNavButton: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.employeeListNavButton = page.getByRole('link', { name: 'Employee List' });
    this.searchInput = page.locator('div:has-text("Employee Id") + div input');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.deleteButton = page.locator('button:has(.bi-trash)');
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
  
  async deleteEmployee(employeeId: string) {
    const employeeRow = this.page.getByRole('row').filter({ hasText: employeeId });
    //await expect(employeeRow).toBeVisible();

    const deleteButton = employeeRow.locator('button:has(.bi-trash)');
    await deleteButton.click();
    await this.page.locator('button:has-text("Yes, Delete")').click();
  }

}