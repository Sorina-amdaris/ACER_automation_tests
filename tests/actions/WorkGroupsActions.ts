import { Page, Locator } from '@playwright/test';
import { WorkGroupsPage } from '../pages/WorkGroupsPage';
import { test, expect } from '@playwright/test';
import { generateWorkGroupData, generateCode, generateSiteName, generateName, generateRandomDescription } from '../utils/testDataGenerator';

export class WorkGroupsActions {
  readonly page: Page;
  readonly workGroupsPage: WorkGroupsPage;

  constructor(page: Page) {
    this.page = page;
    this.workGroupsPage = new WorkGroupsPage(page);
  }

  // Navigation methods
  async goto() {
    await this.page.goto('https://euacerdev.sharepoint.com/sites/ExtranetHub/sitepages/Administration.aspx');
    await this.page.waitForLoadState('load');
  }

  async clickCreateGroup() {
    await this.workGroupsPage.createGroupButton.click();
    await expect(this.workGroupsPage.saveButton).toBeVisible();

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
  async fillWorkGroupForm(data: {
    name: string;
    description: string;
    code: string;
    siteName: string;
  }) {
    await this.workGroupsPage.nameField.fill(data.name);
    await this.workGroupsPage.descriptionField.fill(data.description);
    await this.workGroupsPage.codeField.fill(data.code);
    await this.workGroupsPage.siteNameField.fill(data.siteName);
  }

  async fillWorkGroupFormWithRandomData() {
    const randomData = this.generateRandomFormData();
    await this.fillWorkGroupForm(randomData);
    return randomData; // Return for verification in tests
  }

  async selectFirstRoleUser(roleType: 'chair' | 'viceChair' | 'secretariat', searchText: string) {
    const combobox = roleType === 'chair' ? this.workGroupsPage.comboboxChair : 
                     roleType === 'viceChair' ? this.workGroupsPage.comboboxViceChair : 
                     this.workGroupsPage.comboboxSecretariat;
    
    // Determine which option to select based on role type
    const optionIndex = roleType === 'chair' ? 0 : 
                        roleType === 'viceChair' ? 1 : 
                        2; // secretariat gets 3rd option (index 2)
    
    await combobox.click();
    await combobox.fill(searchText);
    
    // Wait for options to appear
    await this.page.waitForSelector('[role="option"]', { state: 'visible' });
    await this.page.waitForTimeout(300);
    
    // Get all visible options and select the one at the desired index
    const options = await this.page.getByRole('option').all();
    if (options.length > optionIndex) {
      await options[optionIndex].click();
    } else {
      // Fallback to first option if not enough options
      await options[0].click();
    }
  }

  async saveWorkGroup() {
    await this.workGroupsPage.saveButton.click();
  }

  async confirmCreation() {
    await this.workGroupsPage.confirmButton.click();
  }

  // Verification methods
  verifySuccessMessage(name: string): Locator {
    return this.page.getByText(`${name}`);
  }

  verifyWorkGroupInList(name: string): Locator {
    return this.page.getByText(name);
  }

  // Validation methods
  async verifyRequiredFieldErrors() {
    await this.workGroupsPage.saveButton.click();
    return {
      name: this.workGroupsPage.nameRequiredError,
      description: this.workGroupsPage.descriptionRequiredError,
      code: this.workGroupsPage.codeRequiredError,
      siteName: this.workGroupsPage.siteNameRequiredError
    };
  }
  
  async createWorkGroupWithoutRoles(data: {
    name: string;
    description: string;
    code: string;
    siteName: string;
  }) {
    await this.clickCreateGroup();
    await this.fillWorkGroupForm(data);
    await this.saveWorkGroup();
    await this.confirmCreation();
  }

  async scrollDown() {
    await this.page.mouse.wheel(0, 1000);
  }
}
