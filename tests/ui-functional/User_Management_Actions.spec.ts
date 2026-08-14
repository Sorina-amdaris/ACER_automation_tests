import { test, expect } from '@playwright/test';
import { GroupPage } from '../pages/GroupPage';
import { GroupActions } from '../actions/GroupActions';
import manualData from '../../manual-test-data.json';

// for a test only
//RUN: npx playwright test tests/ui-functional/create-work-group-without-roles.spec.ts --headed  
//npx playwright show-report 

// Use the authenticated state
test.use({ storageState: '.auth/user.json' });

test.describe('Actions for User Management', () => {
  let groupPage: GroupPage;
  let groupActions: GroupActions;
  
  test.beforeEach(async ({ page }) => {
    groupPage = new GroupPage(page);
    groupActions = new GroupActions(page);
    await groupActions.goto(manualData.url.administration);
  });

  // test.afterEach(async ({ context }) => {
  //   await context.close();
  // });

  test('Create, Edit, Remove User', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Open groups section and create group
    await expect(groupPage.userButton).toBeVisible();
    await groupPage.userButton.click();
    await expect(groupPage.createUserButton).toBeVisible();
    await groupActions.clickCreateUser();
    
    // Verify form heading
    await expect(groupPage.createUserHeading).toBeVisible();

    //fill the form
    const userRandomData = await groupActions.fillUserFormWithRandomData();
    console.log('Created work group with roles:', userRandomData);
    await groupPage.organisationField.fill('org-EU');
    await groupPage.saveButton.click();
    await expect(groupPage.successMessage).toBeVisible({ timeout: 5000 });
    // check the user is created and visible in the list
    await expect(async () => {
    await page.reload();
    
    await groupPage.userButton.click();
    await groupPage.searchBoxAdministrationPage.fill(userRandomData.userFirstName.name);
    await groupPage.searchBoxAdministrationPage.press('Enter');
    
    await expect(groupPage.userCreated).toBeVisible();
    }).toPass({
    // timeout: 300000,   // total retry time as 5 minutes
    // intervals: [10000] // retry every 10s
     timeout: 60000,   
     intervals: [100] 
  });
  //Edit user created
    await groupPage.editUserbutton.click();
    await expect(groupPage.editUserHeading).toBeVisible();
     //fill the form edited data
    const userRandomDataEdited = await groupActions.fillUserFormWithRandomData();
    console.log('Created work group with roles:', userRandomDataEdited);
    await groupPage.organisationField.fill('org-EU');
    await groupPage.saveButton.click();
    await expect(groupPage.successMessage).toBeVisible({ timeout: 5000 });
    // check the user is created and visible in the list
    await expect(async () => {
    await page.reload();
    
    await groupPage.userButton.click();
    await groupPage.searchBoxAdministrationPage.fill(userRandomDataEdited.userFirstName.name);
    await groupPage.searchBoxAdministrationPage.press('Enter');
    
    await expect(groupPage.userCreated).toBeVisible();
    }).toPass({
    // timeout: 300000,   // total retry time as 5 minutes
    // intervals: [10000] // retry every 10s
     timeout: 60000,   
     intervals: [100] 
  });
  //remove user created
    await groupPage.removeUser.click();
    await groupPage.confirmationDeleteUser.click();
    await groupPage.deleteButtonUserConfirmation.click();
    await expect(groupPage.successMessage).toBeVisible({ timeout: 5000 });

    // check the user is removed and not visible in the list
    await expect(async () => {
    await page.reload();
    
    await groupPage.userButton.click();
    await groupPage.searchBoxAdministrationPage.fill(userRandomDataEdited.userFirstName.name);
    await groupPage.searchBoxAdministrationPage.press('Enter');
    
    await expect(groupPage.userCreated).not.toBeVisible();
    }).toPass({
    // timeout: 300000,   // total retry time as 5 minutes
    // intervals: [10000] // retry every 10s
     timeout: 60000,   
     intervals: [100] 
  });


  });

 test('Create User - required fields validation', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Open groups section and create group
    await expect(groupPage.userButton).toBeVisible();
    await groupPage.userButton.click();
    await expect(groupPage.createUserButton).toBeVisible();
    await groupActions.clickCreateUser();
    
    // Verify form heading
    await expect(groupPage.createUserHeading).toBeVisible();
    
    // Test validation - try to save without filling required fields
    const errors = await groupActions.verifyUserCreationRequiredFieldErrors();
    await expect(errors.firstName).toBeVisible();
    await expect(errors.lastName).toBeVisible();
    await expect(errors.password).toBeVisible();
    //click cancel button to close the form
    await groupActions.cancelForm();
    
    });

    test('Create User - invalid data validation', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Open groups section and create group
    await expect(groupPage.userButton).toBeVisible();
    await groupPage.userButton.click();
    await expect(groupPage.createUserButton).toBeVisible();
    await groupActions.clickCreateUser();
    
    // Verify form heading
    await expect(groupPage.createUserHeading).toBeVisible();
    
    await groupActions.insertInvalidDataInUserCreateForm();

    const invalidErrors = await groupActions.verifyUserCreateInvalidFieldErrors();
    await expect(invalidErrors.firstName).toBeVisible();
    await expect(invalidErrors.lastName).toBeVisible();
    await expect(invalidErrors.password).toBeVisible();
    //click cancel button to close the form
    await groupActions.cancelForm();
    
    });
test('Duplicate User validation', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Open groups section and create group
    await expect(groupPage.userButton).toBeVisible();
    await groupPage.userButton.click();
    await expect(groupPage.createUserButton).toBeVisible();
    //create first user
    await groupActions.clickCreateUser();
    
    // Verify form heading
    await expect(groupPage.createUserHeading).toBeVisible();

    //fill the form
    const userRandomData = await groupActions.fillUserFormWithRandomData();
    console.log('Created work group with roles:', userRandomData);
    await groupPage.organisationField.fill('org-EU');
    await groupPage.saveButton.click();
    await expect(groupPage.successMessage).toBeVisible({ timeout: 5000 });
    // check the user is created and visible in the list
    await expect(async () => {
    await page.reload();
    
    await groupPage.userButton.click();
    await groupPage.searchBoxAdministrationPage.fill(userRandomData.userFirstName.name);
    await groupPage.searchBoxAdministrationPage.press('Enter');
    
    await expect(groupPage.userCreated).toBeVisible();
    }).toPass({
    // timeout: 300000,   // total retry time as 5 minutes
    // intervals: [10000] // retry every 10s
     timeout: 60000,   
     intervals: [100] 
  });
    //create second user with same data to check duplicate validation
    await groupActions.clickCreateUser();
    
    // Verify form heading
    await expect(groupPage.createUserHeading).toBeVisible();

    //fill the form
    await groupPage.firstNameField.fill(userRandomData.userFirstName.name);
    await groupPage.lastNameField.fill(userRandomData.userLastName.name);
    await groupPage.passwordField.fill('gfhjfhjhjh5vg5h8W6');
    await groupPage.organisationField.fill('org-EU');
    await groupPage.saveButton.click();
    await expect(groupPage.duplicateUserMessage).toBeVisible({ timeout: 5000 });
    await page.getByText('A conflicting object with one').click();
    await groupPage.cancelButton.click();

   //remove user created
    await expect(async () => {
    await page.reload();
    
    await groupPage.userButton.click();
    await groupPage.searchBoxAdministrationPage.fill(userRandomData.userFirstName.name);
    await groupPage.searchBoxAdministrationPage.press('Enter');
    
    await expect(groupPage.userCreated).toBeVisible();
    }).toPass({
    // timeout: 300000,   // total retry time as 5 minutes
    // intervals: [10000] // retry every 10s
     timeout: 60000,   
     intervals: [100] 
  });
    await groupPage.removeUser.click();
    await groupPage.confirmationDeleteUser.click();
    await groupPage.deleteButtonUserConfirmation.click();
    await expect(groupPage.successMessage).toBeVisible({ timeout: 5000 });

    // check the user is removed and not visible in the list
    await expect(async () => {
    await page.reload();
    
    await groupPage.userButton.click();
    await groupPage.searchBoxAdministrationPage.fill(userRandomData.userFirstName.name);
    await groupPage.searchBoxAdministrationPage.press('Enter');
    
    await expect(groupPage.userCreated).not.toBeVisible();
    }).toPass({
    // timeout: 300000,   // total retry time as 5 minutes
    // intervals: [10000] // retry every 10s
     timeout: 60000,   
     intervals: [100] 
  });

    });
  });
