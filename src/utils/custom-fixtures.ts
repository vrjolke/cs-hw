import { test as baseTest } from '@playwright/test';
import { LoginPage } from '@src/pages/login-page';
import { PimPage } from '@src/pages/pim-page';
import { AddEmployeePage } from '@src/pages/add-employee-page';
import { PersonalDetailsPage } from '@src/pages/personal-details-page';
import { EmployeeListPage } from '@src/pages/employee-list-page';
import dotenv from 'dotenv';

dotenv.config();

type Fixtures = {
  loginPage: LoginPage;
  pimPage: PimPage;
  addEmployeePage: AddEmployeePage;
  personalDetailsPage: PersonalDetailsPage;
  employeeListPage: EmployeeListPage;
  username: string;
  password: string;
};

export const test = baseTest.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  pimPage: async ({ page }, use) => {
    await use(new PimPage(page));
  },
  addEmployeePage: async ({ page }, use) => {
    await use(new AddEmployeePage(page));
  },
  personalDetailsPage: async ({ page }, use) => {
    await use(new PersonalDetailsPage(page));
  },
  employeeListPage: async ({ page }, use) => {
    await use(new EmployeeListPage(page));
  },
  username: async ({}, use) => {
    await use(process.env.ADMIN_USERNAME!);
  },
  password: async ({}, use) => {
    await use(process.env.ADMIN_PASSWORD!);
  },
});

export { expect } from '@playwright/test';
