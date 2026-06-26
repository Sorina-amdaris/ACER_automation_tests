import { Page, Locator } from '@playwright/test';

export class GroupPage {
  readonly page: Page;
  
  // Navigation
  readonly groupsButton: Locator;
  readonly createGroupButton: Locator;
  
  // Form heading
  readonly createWorkingGroupHeading: Locator;
  readonly createTaskForceHeading: Locator;
  
  // Form fields
  readonly nameField: Locator;
  readonly descriptionField: Locator;
  readonly codeField: Locator;
  readonly siteNameField: Locator;
  readonly comboboxChair: Locator;
  readonly comboboxViceChair: Locator;
  readonly comboboxSecretariat: Locator;

  // Required Error messages
  readonly nameRequiredError: Locator;
  readonly descriptionRequiredError: Locator;
  readonly codeRequiredError: Locator;
  readonly siteNameRequiredError: Locator;
  
  // Buttons
  readonly saveButton: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  
  // Confirmation dialog
  readonly confirmationHeading: Locator;
  readonly confirmationMessage: Locator;

  // Error messages for invalid data
  readonly nameInvalidError: Locator;
  readonly descriptionInvalidError: Locator;
  readonly codeInvalidError: Locator  ;
  readonly siteNameInvalidError: Locator; 
  

  constructor(page: Page) {
    this.page = page;
    
    // Navigation
    this.groupsButton = page.getByRole('button', { name: 'Groups', exact: true });
    this.createGroupButton = page.getByRole('button', { name: 'Create Group', exact: true });
    
    // Form heading
    this.createWorkingGroupHeading = page.getByRole('heading', { name: 'Create Working Group' });
    this.createTaskForceHeading = page.getByRole('heading', { name: 'Create Task Force' });
    
    // Form fields
    this.nameField = page.getByRole('textbox', { name: 'Name *', exact: true });
    this.descriptionField = page.getByRole('textbox', { name: 'Description *' });
    this.codeField = page.getByRole('textbox', { name: 'Code *' });
    this.siteNameField = page.getByRole('textbox', { name: 'Site Name *' });

    
    this.comboboxChair = page.locator(`//label[normalize-space()="Chair(s)"]/following::input[@role="combobox"][1]`);
    this.comboboxViceChair = page.locator(`//label[normalize-space()="Vice-Chair(s)"]/following::input[@role="combobox"][1]`);
    this.comboboxSecretariat = page.locator(`//label[normalize-space()="Secretariat"]/following::input[@role="combobox"][1]`);

    
    // Required Error messages
    this.nameRequiredError = page.getByText('Name is required.', { exact: true });
    this.descriptionRequiredError = page.getByText('Description is required.');
    this.codeRequiredError = page.getByText('Code is required.');
    this.siteNameRequiredError = page.getByText('Site Name is required.');
    
    // Buttons
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    
    // Confirmation dialog
    this.confirmationHeading = page.getByRole('heading', { name: 'Confirmation' });
    this.confirmationMessage = page.getByText('Are you sure you want to');

    // Error messages for invalid data
    this.nameInvalidError = page.getByText('Name must contain alphanumeric characters, spaces, or hyphens only.');
    this.descriptionInvalidError = page.getByText('Description must contain valid characters (alphanumeric, spaces, and common punctuation).');
    this.codeInvalidError = page.getByText('Code must contain alphanumeric characters or hyphens only.');
    this.siteNameInvalidError = page.getByText('Site Name must contain alphanumeric characters or hyphens only.');

  }
}
