import { Page, Locator } from '@playwright/test';

export class WorkGroupsPage {
  readonly page: Page;
  
  // Navigation
  readonly groupsButton: Locator;
  readonly createGroupButton: Locator;
  
  // Form heading
  readonly createWorkingGroupHeading: Locator;
  
  // Form fields
  readonly nameField: Locator;
  readonly descriptionField: Locator;
  readonly codeField: Locator;
  readonly siteNameField: Locator;
  readonly comboboxChair: Locator;
  readonly comboboxViceChair: Locator;
  readonly comboboxSecretariat: Locator;

  // Error messages
  readonly nameRequiredError: Locator;
  readonly descriptionRequiredError: Locator;
  readonly codeRequiredError: Locator;
  readonly siteNameRequiredError: Locator;
  
  // Buttons
  readonly saveButton: Locator;
  readonly confirmButton: Locator;
  
  // Confirmation dialog
  readonly confirmationHeading: Locator;
  readonly confirmationMessage: Locator;
  

  constructor(page: Page) {
    this.page = page;
    
    // Navigation
    this.groupsButton = page.getByRole('button', { name: 'Groups', exact: true });
    this.createGroupButton = page.getByRole('button', { name: 'Create Group', exact: true });
    
    // Form heading
    this.createWorkingGroupHeading = page.getByRole('heading', { name: 'Create Working Group' });
    
    // Form fields
    this.nameField = page.getByRole('textbox', { name: 'Name *', exact: true });
    this.descriptionField = page.getByRole('textbox', { name: 'Description *' });
    this.codeField = page.getByRole('textbox', { name: 'Code *' });
    this.siteNameField = page.getByRole('textbox', { name: 'Site Name *' });

    
    this.comboboxChair = page.locator(`//label[normalize-space()="Chair(s)"]/following::input[@role="combobox"][1]`);
    this.comboboxViceChair = page.locator(`//label[normalize-space()="Vice-Chair(s)"]/following::input[@role="combobox"][1]`);
    this.comboboxSecretariat = page.locator(`//label[normalize-space()="Secretariat"]/following::input[@role="combobox"][1]`);

    
    // Error messages
    this.nameRequiredError = page.getByText('Name is required.', { exact: true });
    this.descriptionRequiredError = page.getByText('Description is required.');
    this.codeRequiredError = page.getByText('Code is required.');
    this.siteNameRequiredError = page.getByText('Site Name is required.');
    
    // Buttons
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
    
    // Confirmation dialog
    this.confirmationHeading = page.getByRole('heading', { name: 'Confirmation' });
    this.confirmationMessage = page.getByText('Are you sure you want to');

  }
}
