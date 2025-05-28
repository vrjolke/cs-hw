import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { PimPage } from '../pages/pim-page';
import dotenv from 'dotenv';

dotenv.config();

type Fixtures = {
  loginPage: LoginPage;
  pimPage: PimPage;
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
  username: async ({}, use) => {
    await use(process.env.ADMIN_USERNAME!);
  },
  password: async ({}, use) => {
    await use(process.env.ADMIN_PASSWORD!);
  },
});

export { expect } from '@playwright/test';
