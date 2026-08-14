import { Page, Locator } from '@playwright/test';

export class GroupPage {
  readonly page: Page;
  
  // Navigation
  readonly groupsButton: Locator;
  readonly addMemberButton: Locator;
  readonly addMemberSecondbtn: Locator;
  readonly createGroupButton: Locator;
  readonly searchBoxAdministrationPage: Locator;
  readonly addTaskForceButton: Locator;
  readonly editWorkingGroupButton: Locator;
  readonly editTaskForceButton: Locator;
  readonly editGroupButton: Locator;
  // Form heading
  readonly createWorkingGroupHeading: Locator;
  readonly createTaskForceHeading: Locator;
  readonly editWorkingGroupHeading: Locator;
  readonly editTaskForceHeading: Locator;
  readonly addMemberHeading: Locator;
  readonly editBoardHeading: Locator;
  
  // Form fields
  readonly nameField: Locator;
  readonly descriptionField: Locator;
  readonly codeField: Locator;
  readonly siteNameField: Locator;
  readonly comboboxChair: Locator;
  readonly comboboxViceChair: Locator;
  readonly comboboxSecretariat: Locator;
  readonly removeChairButton: Locator;
  readonly removeViceChairButton: Locator;
  readonly removeButton: Locator;
  readonly personTag: Locator;
  readonly comboboxAddMember: Locator;
  readonly roleFieldAddMemberForm: Locator;
  readonly optionRoleToSelectInAddMembersForm: (option: string) => Locator;

  // Required Error messages
  readonly nameRequiredError: Locator;
  readonly descriptionRequiredError: Locator;
  readonly codeRequiredError: Locator;
  readonly siteNameRequiredError: Locator;
  readonly firstNameRequiredError: Locator;
  readonly lastNameRequiredError: Locator;
  readonly passwordRequiredError: Locator;
  
  
  // Buttons
  readonly saveButton: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  readonly addMemberSaveButton: Locator;
  
  // Confirmation dialog
  readonly confirmationHeading: Locator;
  readonly confirmationMessage: Locator;
  readonly confirmationRemoveHeading: Locator;
  readonly confirmationMessageLastRole: Locator;
 

  // Error messages for invalid data
  readonly nameInvalidError: Locator;
  readonly descriptionInvalidError: Locator;
  readonly codeInvalidError: Locator  ;
  readonly siteNameInvalidError: Locator; 
  readonly passwordInvalidError: Locator;
  readonly firstNameInvalidError: Locator;
  readonly lastNameInvalidError: Locator;

  //Error message for members same role
  readonly membersSameRoleError: Locator;

  //notification message
  readonly successMessage: Locator;
  readonly notificationMemberHasBeenRemovedMessage: Locator;
  readonly duplicateUserMessage: Locator;

  //Group page
  readonly keyPeopleSection: Locator;
  readonly viceChairMemberinGroupPage: Locator;
  readonly chairMemberinGroupPage: Locator;
  readonly acerContactMemberinGroupPage: Locator;
  readonly membersSection: Locator;
  readonly membersCheckboxes: Locator;
  readonly cardView: Locator;
  readonly tableView: Locator;
  readonly secretariatCard: Locator;
  readonly editFormMember: Locator;
  readonly extranetHubLink: Locator;

  //Member Edit form
  readonly dropdownRoleFieldForSecretariat: Locator;
  readonly memberOptionToSelectInEditMemberForm: Locator;
  readonly removeChairButtonFromTableViewGroupPage: Locator;
  readonly removeViceChairButtonFromTableViewGroupPage: Locator;
  readonly removeSecretariatButtonFromTableViewGroupPage: Locator;
  readonly removeContractorButtonFromTableViewGroupPage: Locator;
  readonly removeObserverButtonFromTableViewGroupPage: Locator;
  readonly removeMemberButtonFromTableViewGroupPage: Locator;
  readonly removeConvenorButtonFromTableViewGroupPage: Locator;
  readonly removeExpertButtonFromTableViewGroupPage: Locator;

  //user management
  readonly userButton: Locator;
  readonly createUserButton: Locator;
  readonly createUserHeading: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly passwordField: Locator;
  readonly organisationField: Locator;   
  readonly userCreated: Locator; 
  readonly editUserbutton: Locator;
  readonly editUserHeading: Locator;
  readonly removeUser: Locator;
  readonly confirmationDeleteUser: Locator;
  readonly deleteButtonUserConfirmation: Locator;

  //Boards
  readonly boardButton: Locator;
  readonly createBoardButton: Locator;
  readonly boardTypeDropdown: Locator;
  readonly optionBorToSelectInBoardTypeDropdown: Locator;
  readonly optionBoaToSelectInBoardTypeDropdown: Locator;
  readonly optionAbToSelectInBoardTypeDropdown: Locator;
  readonly editBoardPencilIcon: Locator;


  constructor(page: Page) {
    this.page = page;
    
    // Navigation
    this.groupsButton = page.getByRole('button', { name: 'Groups', exact: true });
    this.addMemberButton =page.getByRole('button', { name: 'Add', exact: true });
    this.addMemberSecondbtn = page.getByRole('button', { name: 'Add', exact: true }).and(page.locator(':not([disabled])'));
    this.createGroupButton = page.getByRole('button', { name: 'Create Group', exact: true });
    this.searchBoxAdministrationPage = page.getByRole('searchbox', { name: 'Search' });
    this.addTaskForceButton = page.getByRole('button', { name: 'Add Task Force' });
    this.editWorkingGroupButton = page.getByRole('button', { name: 'Edit Working Group' });
    this.editGroupButton = page.getByRole('button', { name: 'Edit', exact: true })
    this.editTaskForceButton = page.getByRole('button', { name: 'Edit Task Force' });
    
    // Form heading
    this.createWorkingGroupHeading = page.getByRole('heading', { name: 'Create Working Group' });
    this.createTaskForceHeading = page.getByRole('heading', { name: 'Create Task Force' });
    this.editWorkingGroupHeading = page.getByRole('heading', { name: 'Edit Working Group' });
    this.editTaskForceHeading = page.getByRole('heading', { name: 'Edit Task Force' });
    this.addMemberHeading = page.getByRole('heading', { name: 'Add Member' });
    this.editBoardHeading = page.getByRole('heading', { name: 'Edit Board' });
    
    // Form fields
    this.nameField = page.getByRole('textbox', { name: 'Name *',exact:true});
    this.descriptionField = page.getByRole('textbox', { name: 'Description *',exact:true});
    this.codeField = page.getByRole('textbox', { name: 'Code *',exact:true });
    this.siteNameField = page.getByRole('textbox', { name: 'Site Name *',exact:true });

    
    this.comboboxChair = page.locator(`//label[normalize-space()="Chair(s)"]/following::input[@role="combobox"][1]`);
    this.comboboxViceChair = page.locator(`//label[normalize-space()="Vice-Chair(s)"]/following::input[@role="combobox"][1]`);
    this.comboboxSecretariat = page.locator(`//label[normalize-space()="Secretariat"]/following::input[@role="combobox"][1]`);
    this.personTag = page.locator('.ms-Persona-primaryText');
    this.comboboxAddMember = page.getByRole('combobox', { name: 'People Picker' });
    this.roleFieldAddMemberForm = page.getByRole('combobox').filter({has: page.locator('span', { hasText: 'Chair' })});
    this.optionRoleToSelectInAddMembersForm = (option: string) => page.getByRole('option', { name: option });

    this.removeChairButton = page.getByRole('button', { name: 'Remove TestChairJulio' });
    this.removeViceChairButton = page.getByRole('button', { name: 'Remove TestViceChairFredrick' });
    this.removeButton = page.getByRole('button', { name: 'Remove' });
    
    // Required Error messages
    this.nameRequiredError = page.getByText('Name is required.', { exact: true });
    this.descriptionRequiredError = page.getByText('Description is required.');
    this.codeRequiredError = page.getByText('Code is required.');
    this.siteNameRequiredError = page.getByText('Site Name is required.');
    this.firstNameRequiredError = page.getByText('First Name is required.');      
    this.lastNameRequiredError = page.getByText('Last Name is required.');
    this.passwordRequiredError = page.getByText('Password is required.');
    
    // Buttons
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.addMemberSaveButton = page.getByLabel('Add Member').getByRole('button', { name: 'Add' });
    
    // Confirmation dialog
    this.confirmationHeading = page.getByRole('heading', { name: 'Confirmation' });
    this.confirmationMessage = page.getByText('Are you sure you want to');
    this.confirmationMessageLastRole = page.getByText(/Attention/i);
    this.confirmationRemoveHeading = page.getByText(/Remove member/i);
    this.confirmationDeleteUser = page.getByRole('heading', { name: 'Delete User' });

    // Error messages for invalid data
    this.nameInvalidError = page.getByText('Name must contain alphanumeric characters, spaces, or hyphens only.');
    this.descriptionInvalidError = page.getByText('Description must contain valid characters (alphanumeric, spaces, and common punctuation).');
    this.codeInvalidError = page.getByText('Code must contain alphanumeric characters or hyphens only.');
    this.siteNameInvalidError = page.getByText('Site Name must contain alphanumeric characters or hyphens only.');
    this.passwordInvalidError = page.getByText('Password must be at least 8 characters');
    this.firstNameInvalidError = page.getByText('First Name must contain');
    this.lastNameInvalidError = page.getByText('Last Name must contain');
   
    //Error message for members same role
    this.membersSameRoleError = page.getByText('A user can\'t be assigned to');

    //notification message
    this.successMessage = page.getByText(/successfully/i);
    this.notificationMemberHasBeenRemovedMessage = page.getByText(/has been removed/i);
    this.duplicateUserMessage = page.getByText(/A user with email/i);
    //this.duplicateUserMessage = page.getByText(/A conflicting object with one/i);

    //Group page
    this.keyPeopleSection = page.getByText('Key People', { exact: true })
    this.viceChairMemberinGroupPage =page.getByText('Vice-ChairVice-Chair');
    this.chairMemberinGroupPage =page.getByText('ChairChair');
    this.acerContactMemberinGroupPage = page.getByText('ACER ContactACER Contact');
    this.membersSection = page.getByText('Members', { exact: true })
    this.membersCheckboxes =  page.getByRole('checkbox');
    this.cardView = page.getByRole('button', { name: 'Cards' });
    this.tableView = page.getByRole('button', { name: 'Table' });
    this.secretariatCard = page.getByRole('button', { name: 'TestSecretariatBradford' });
    this.editFormMember =page.getByRole('button', { name: 'Edit role' });
    this.extranetHubLink = page.getByRole('link', { name: 'ExtranetHub hub site' });

    //Member Edit form
    this.dropdownRoleFieldForSecretariat = page.getByLabel('Overview').getByText('Secretariat', { exact: true });
    this.memberOptionToSelectInEditMemberForm = page.getByRole('option', { name: 'Member' });
    this.removeChairButtonFromTableViewGroupPage = page.getByRole('row', { name: 'TestChairJulio' }).getByLabel('Remove member');
    this.removeViceChairButtonFromTableViewGroupPage = page.getByRole('row', { name: 'TestViceChairFredrick' }).getByLabel('Remove member');
    this.removeSecretariatButtonFromTableViewGroupPage = page.getByRole('row', { name: 'TestSecretariatBradford' }).getByLabel('Remove member');
    this.removeContractorButtonFromTableViewGroupPage = page.getByRole('row', { name: 'TestContractorMario' }).getByLabel('Remove member');
    this.removeObserverButtonFromTableViewGroupPage = page.getByRole('row', { name: 'TestObserverAlly' }).getByLabel('Remove member');
    this.removeMemberButtonFromTableViewGroupPage = page.getByRole('row', { name: 'TestMemberRamon' }).getByLabel('Remove member');
    this.removeConvenorButtonFromTableViewGroupPage = page.getByRole('row', { name: 'TestConvenorLolita' }).getByLabel('Remove member');
    this.removeExpertButtonFromTableViewGroupPage = page.getByRole('row', { name: 'TestExpertJacynthe' }).getByLabel('Remove member');
    
    
    //user management
    this.userButton = page.getByRole('button', { name: 'Users' });
    this.createUserButton = page.getByRole('button', { name: 'Create User' });
    this.createUserHeading = page.getByRole('heading', { name: 'Create User' })
    this.firstNameField = page.getByRole('textbox', { name: 'First Name *' });
    this.lastNameField = page.getByRole('textbox', { name: 'Last Name *' });
    this.passwordField = page.getByRole('textbox', { name: 'Password *' });
    this.organisationField = page.getByRole('textbox', { name: 'Organisation' });
    this.userCreated = page.getByRole('button', { name: 'Opens Profile Card' });
    this.editUserbutton =page.getByRole('button', { name: 'Edit User' });
    this.editUserHeading = page.getByRole('heading', { name: 'Edit User' });
    this.removeUser = page.getByRole('button', { name: 'Delete User' });
    this.deleteButtonUserConfirmation = page.getByRole('button', { name: 'Delete' })

    //Boards
    this.boardButton = page.getByRole('button', { name: 'Boards' });
    this.createBoardButton = page.getByRole('button', { name: 'Create Board' });
    this.boardTypeDropdown = page.getByRole('combobox', { name: 'Board Type' });
    this.optionBorToSelectInBoardTypeDropdown = page.getByRole('option', { name: 'Board of Regulators' });
    this.optionBoaToSelectInBoardTypeDropdown = page.getByRole('option', { name: 'Board of Appeal' });
    this.optionAbToSelectInBoardTypeDropdown = page.getByRole('option', { name: 'Administrative Board' });
    this.editBoardPencilIcon = page.getByRole('button', { name: 'Edit Board' });
  }
}
