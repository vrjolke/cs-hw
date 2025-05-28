import { test as baseTest } from '@playwright/test';
import { LoginPage } from './pages/login-page';
import dotenv from 'dotenv';

dotenv.config();

type Fixtures = {
  loginPage: LoginPage;
  username: string;
  password: string;
};

export const test = baseTest.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  username: async ({}, use) => {
    await use(process.env.ADMIN_USERNAME!);
  },
  password: async ({}, use) => {
    await use(process.env.ADMIN_PASSWORD!);
  },
});

export { expect } from '@playwright/test';
