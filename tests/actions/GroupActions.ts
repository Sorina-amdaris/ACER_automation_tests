import { Page, Locator } from '@playwright/test';
import { GroupPage } from '../pages/GroupPage';
import { test, expect } from '@playwright/test';
import { generateWorkGroupData, generateCode, generateSiteName, generateName, generateRandomDescription } from '../utils/testDataGenerator';
import manualData from '../../manual-test-data.json';

export class GroupActions {
  readonly page: Page;
  readonly groupPage: GroupPage;

  constructor(page: Page) {
    this.page = page;
    this.groupPage = new GroupPage(page);
  }

  // Navigation methods
  async goto() {
    await this.page.goto(manualData.url.administration);
    await this.page.waitForLoadState('load');
  }

  async clickCreateGroup() {
    await this.groupPage.createGroupButton.click();
    await expect(this.groupPage.saveButton).toBeVisible();

  }

   async goToClickCreateTaskForce() {

    await this.groupPage.searchBoxAdministrationPage.fill(manualData.workGroup);
    await this.groupPage.searchBoxAdministrationPage.press('Enter');
    await expect(this.page.getByText(manualData.workGroup)).toBeVisible();
    await this.groupPage.addTaskForceButton.click();
   }

   async goToCertainGroup(name: string) {
    await this.groupPage.searchBoxAdministrationPage.fill(name);
    await this.groupPage.searchBoxAdministrationPage.press('Enter');
    await expect(this.page.getByText(name)).toBeVisible();
   }

  generateGroupRandomFormData() {
    return {
      description: generateRandomDescription(20, 50),//without special characters
      code: generateCode(8),
      siteName: generateSiteName(10)
    };
  }
  generateWGRandomName() {
    return {
      name: "WG Auto " + generateName(5, 15)
    };  
  }

  generateTFRandomName() {
    return {
      name: "TF Auto " + generateName(5, 15)
    };  
  }

  async fillWGNameForm(data: {
    name: string;
 
  }) {
    await this.groupPage.nameField.fill(data.name);
  }

    async fillTFNameForm(data: {
    name: string;
  }) {
    await this.groupPage.nameField.fill(data.name);
  }

  // Form filling methods
  async fillGroupForm(data: {
    
    description: string;
    code: string;
    siteName: string;
  }) {
    await this.groupPage.descriptionField.fill(data.description);
    await this.groupPage.codeField.fill(data.code);
    await this.groupPage.siteNameField.fill(data.siteName);
  }

  async fillGroupFormWithRandomData() {
    const randomData = this.generateGroupRandomFormData();
    await this.fillGroupForm(randomData);
    return randomData; // Return for verification in tests
  } 

  async fillWGFormWithRandomData() {
    const WGrandomName = this.generateWGRandomName();
    await this.fillWGNameForm(WGrandomName);
    return WGrandomName; 
  }
  async fillTFFormWithRandomData() {
    const TFrandomName = this.generateTFRandomName();
    await this.fillTFNameForm(TFrandomName);
    return TFrandomName; 
  }

   // Form filling methods
  async fillEditGroupForm(data: {
    name: string;
    description: string;
  }) {
    await this.groupPage.nameField.fill(data.name);
    await this.groupPage.descriptionField.fill(data.description);
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

  // Validation methods create form
  async verifyRequiredFieldErrors() {
    await this.groupPage.saveButton.click();
    return {
      name: this.groupPage.nameRequiredError,
      description: this.groupPage.descriptionRequiredError,
      code: this.groupPage.codeRequiredError,
      siteName: this.groupPage.siteNameRequiredError
    };
  }

  // Validation methods edit form
  async verifyEditRequiredFieldErrors() {
     await this.groupPage.nameField.clear();
     await this.groupPage.descriptionField.clear();
     await this.groupPage.saveButton.click();
    return {
      name: this.groupPage.nameRequiredError,
      description: this.groupPage.descriptionRequiredError,
    };
  }

//validation for invalid data create form
  async verifyInvalidFieldErrors() {
    await this.groupPage.saveButton.click();
    return {
      name: this.groupPage.nameInvalidError,
      description: this.groupPage.descriptionInvalidError,
      code: this.groupPage.codeInvalidError,
      siteName: this.groupPage.siteNameInvalidError
    };
  }

  //validation for invalid data edit form
  async verifyEditInvalidFieldErrors() {
    await this.groupPage.saveButton.click();
    return {
      name: this.groupPage.nameInvalidError,
      description: this.groupPage.descriptionInvalidError,
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

    async insertInvalidDataInEditGroupForm() {
    await this.groupPage.nameField.fill('$% string');
    await this.groupPage.descriptionField.fill('_?^^');
  }
 
  async cancelForm() {
    await this.groupPage.cancelButton.click();
  }


  async removeRolesinEditForm(){
    await this.groupPage.removeChairButton.click();
    await this.groupPage.removeViceChairButton.click();
    await this.groupPage.removeButton.click();
  }

}