import { type Page } from '@playwright/test';

export class PimPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.getByRole('link', { name: 'PIM' }).click();
  }
}
