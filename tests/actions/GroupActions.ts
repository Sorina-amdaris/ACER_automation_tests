import { Page, Locator } from '@playwright/test';
import { GroupPage } from '../pages/GroupPage';
import { test, expect } from '@playwright/test';
import { generateWorkGroupData, generateCode, generateSiteName, generateName, generateRandomDescription } from '../utils/testDataGenerator';

export class GroupActions {
  readonly page: Page;
  readonly groupPage: GroupPage;

  constructor(page: Page) {
    this.page = page;
    this.groupPage = new GroupPage(page);
  }

  // Navigation methods
  async goto() {
    await this.page.goto('https://euacerdev.sharepoint.com/sites/ExtranetHub/sitepages/Administration.aspx');
    await this.page.waitForLoadState('load');
  }

  async clickCreateGroup() {
    await this.groupPage.createGroupButton.click();
    await expect(this.groupPage.saveButton).toBeVisible();

  }

  // Random data generation methods
  generateRandomWorkGroupData() {
    return generateWorkGroupData();
  }

  generateRandomFormData() {
    return {
      name: "Test Auto " + generateName(5, 15),
      description: generateRandomDescription(20, 50),//without special characters
      code: generateCode(8),
      siteName: generateSiteName(10)
    };
  }

  // Form filling methods
  async fillGroupForm(data: {
    name: string;
    description: string;
    code: string;
    siteName: string;
  }) {
    await this.groupPage.nameField.fill(data.name);
    await this.groupPage.descriptionField.fill(data.description);
    await this.groupPage.codeField.fill(data.code);
    await this.groupPage.siteNameField.fill(data.siteName);
  }

  async fillGroupFormWithRandomData() {
    const randomData = this.generateRandomFormData();
    await this.fillGroupForm(randomData);
    return randomData; // Return for verification in tests
  }


  async saveGroup() {
    await this.groupPage.saveButton.click();
  }

  async confirmCreation() {
    await this.groupPage.confirmButton.click();
  }

  // Verification methods
  verifySuccessMessage(name: string): Locator {
    return this.page.getByText(`${name}`);
  }

  verifyGroupInList(name: string): Locator {
    return this.page.getByText(name);
  }

  // Validation methods
  async verifyRequiredFieldErrors() {
    await this.groupPage.saveButton.click();
    return {
      name: this.groupPage.nameRequiredError,
      description: this.groupPage.descriptionRequiredError,
      code: this.groupPage.codeRequiredError,
      siteName: this.groupPage.siteNameRequiredError
    };
  }

//validation for invalid data
  async verifyInvalidFieldErrors() {
    await this.groupPage.saveButton.click();
    return {
      name: this.groupPage.nameInvalidError,
      description: this.groupPage.descriptionInvalidError,
      code: this.groupPage.codeInvalidError,
      siteName: this.groupPage.siteNameInvalidError
    };
  }

  async createWorkGroupWithoutRoles(data: {
    name: string;
    description: string;
    code: string;
    siteName: string;
  }) {
    await this.clickCreateGroup();
    await this.fillGroupForm(data);
    await this.saveGroup();
    await this.confirmCreation();
  }

  async scrollDown() {
    await this.page.mouse.wheel(0, 1000);
  }
 
  async insertInvalidDataInCreateGroupForm() {
    await this.groupPage.nameField.fill('$% string');
    await this.groupPage.descriptionField.fill('_?^^');
    await this.groupPage.codeField.fill('$# &');
    await this.groupPage.siteNameField.fill('test string');
  }
 
  async cancelForm() {
    await this.groupPage.cancelButton.click();
  }

}
