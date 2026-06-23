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
      name: generateName(5, 15),
      description: generateRandomDescription(20, 50),
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

  async selectRoleUser(roleType: 'owner' | 'member' | 'visitor', searchText: string, optionName: string) {
    const comboboxId = roleType === 'owner' ? '#combobox-id__2653' : 
                       roleType === 'member' ? '#combobox-id__2656' : 
                       '#combobox-id__2659';
    
    await this.page.locator(comboboxId).click();
    await this.page.locator(comboboxId).fill(searchText);
    await this.page.getByRole('option', { name: optionName }).click();
  }

  async selectFirstRoleUser(roleType: 'owner' | 'member' | 'visitor', searchText: string) {
    const comboboxId = roleType === 'owner' ? '#combobox-id__2653' : 
                       roleType === 'member' ? '#combobox-id__2656' : 
                       '#combobox-id__2659';
    
    await this.page.locator(comboboxId).click();
    await this.page.locator(comboboxId).fill(searchText);
    // Wait for options to load and select the first one
    await this.page.waitForTimeout(500); // Small wait for options to populate
    await this.page.getByRole('option').first().click();
  }

  async saveWorkGroup() {
    await this.workGroupsPage.saveButton.click();
  }

  async confirmCreation() {
    await this.workGroupsPage.confirmButton.click();
  }

  // Verification methods
  verifySuccessMessage(name: string): Locator {
    return this.page.getByText(`Working group request '${name}`);
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

  // Combined workflow methods
  async createWorkGroupWithRoles(data: {
    name: string;
    description: string;
    code: string;
    siteName: string;
    owner?: { search: string; option: string };
    member?: { search: string; option: string };
    visitor?: { search: string; option: string };
  }) {
    await this.clickCreateGroup();
    await this.fillWorkGroupForm(data);
    
    if (data.owner) {
      await this.selectRoleUser('owner', data.owner.search, data.owner.option);
    }
    if (data.member) {
      await this.selectRoleUser('member', data.member.search, data.member.option);
    }
    if (data.visitor) {
      await this.selectRoleUser('visitor', data.visitor.search, data.visitor.option);
    }
    
    await this.saveWorkGroup();
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
