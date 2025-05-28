import { type Page, type Locator } from '@playwright/test';

type PersonalDetails = {
    driversLicenseNumber: string;
    licenseExpiryDate: string;
    nationality: string;
    maritalStatus: string;
    dateOfBirth: string;
    gender: string;
};

export class PersonalDetailsPage {
    // profile picture upload functionality
    readonly page: Page;
    readonly employeeProfilePicture: Locator;
    readonly addPictureButton: Locator;
    readonly personalDetailSaveButton: Locator;

    // personal details form functionality
    readonly driverLicenseNumberInput: Locator;
    readonly licenseExpiryDateInput: Locator;
    readonly nationalitySelect: Locator;
    readonly maritalStatusSelect: Locator;
    readonly dateOfBirthInput: Locator;

    // attachments functionality
    readonly addAttachmentButton: Locator;
    readonly browseAttachmentButton: Locator;
    readonly commentInput: Locator;
    readonly attachmentSaveButton: Locator;
    
    constructor(page: Page) {
        /// profile picture upload functionality
        this.page = page;
        this.employeeProfilePicture = page.locator('.employee-image');
        this.addPictureButton = page.locator('.bi-plus');
        this.personalDetailSaveButton = page
            .locator('button')
            .filter({ hasText: 'Save' })
            .first()

        // personal details form functionality
        this.driverLicenseNumberInput = page
            .locator('div.oxd-input-group')
            .filter({ hasText: "Driver's License Number" })
            .getByRole('textbox');
        this.licenseExpiryDateInput = page
            .locator('div.oxd-input-group')
            .filter({ hasText: "License Expiry Date" })
            .getByPlaceholder('yyyy-dd-mm');
        this.nationalitySelect = page
            .locator('div.oxd-input-group')
            .filter({ hasText: "Nationality" })
            .locator('.oxd-select-text');
        this.maritalStatusSelect = page
            .locator('div.oxd-input-group')
            .filter({ hasText: "Marital Status" })
            .locator('.oxd-select-text');
        this.dateOfBirthInput = page
            .locator('div.oxd-input-group')
            .filter({ hasText: 'Date of Birth' })
            .getByPlaceholder('yyyy-dd-mm');

        // attachments functionality
        this.addAttachmentButton = page.locator('button:has-text("Add")');
        this.browseAttachmentButton = page.getByText('Browse');
        this.commentInput = page.getByRole('textbox', { name: 'Type comment here' });
        this.attachmentSaveButton = page.getByRole('button', { name: 'Save' }).last();
    }

    async uploadProfilePicture(__dirname: string, filePath: string) {
        await this.employeeProfilePicture.click();
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.addPictureButton.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(require('path').resolve(__dirname, filePath));
        await this.personalDetailSaveButton.click();
    }

    async selectNationalityOption(nationality: string) {
        await this.nationalitySelect.click();
        await this.page.getByRole('option', { name: nationality }).click();
    }

    async selectMaritalStatusOption(maritalStatus: string) {
        await this.maritalStatusSelect.click();
        await this.page.getByRole('option', { name: maritalStatus }).click();
    }

    async selectGenderRadioButton(gender: string) {
        await this.page
            .locator('label')
            .filter({ hasText: gender })
            .locator('span')
            .click();
    }

    async fillPersonalDetails(personalDetails: PersonalDetails) {
        await this.driverLicenseNumberInput.fill(personalDetails.driversLicenseNumber);
        await this.licenseExpiryDateInput.fill(personalDetails.licenseExpiryDate);
        await this.selectNationalityOption(personalDetails.nationality);
        await this.selectMaritalStatusOption(personalDetails.maritalStatus);
        await this.dateOfBirthInput.fill(personalDetails.dateOfBirth);
        await this.selectGenderRadioButton(personalDetails.gender);
        await this.personalDetailSaveButton.click();
    }

    async addAttachmentWithComment(__dirname: string, filePath: string, comment: string) {
        await this.addAttachmentButton.click();
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.browseAttachmentButton.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(require('path').resolve(__dirname, filePath));
        await this.commentInput.fill(comment);
        await this.attachmentSaveButton.click();
    }
}