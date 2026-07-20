import { test, expect } from '@playwright/test';
import { GroupPage } from '../pages/GroupPage';
import { GroupActions } from '../actions/GroupActions';
import manualData from '../../manual-test-data.json';


//RUN: npx playwright test tests/ui-functional/create-work-group-without-roles.spec.ts --headed   
//Test data without roles

// Use the authenticated state
test.use({ storageState: '.auth/user.json' });

test.describe('Edit Task Force positive and negative scenarios', () => {
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

 test('Edit TF form', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();
     
    await groupActions.goToCertainGroup(manualData.editTFpositive);

    //click on pensil icon to edit TF
    await groupPage.editTaskForceButton.click();

     // Verify form heading
    await expect(groupPage.editTaskForceHeading).toBeVisible();
    await groupActions.fillEditGroupForm({
      name: manualData.editName,
      description: manualData.editDescription
    }
  );
    //fill out roles
    await groupActions.selectPerson(
      groupPage.comboboxChair,
      manualData.searchWord.chairRole,
      manualData.selectRoleOption.chairRole
    );

    await groupActions.selectPerson(
      groupPage.comboboxViceChair,
      manualData.searchWord.viceChairRole,
      manualData.selectRoleOption.viceChairRole
    );

    await groupActions.selectPerson(
      groupPage.comboboxSecretariat,  
      manualData.searchWord.secretariatRole,
      manualData.selectRoleOption.secretariatRole
    );

    //save the form and verify success message
    await groupActions.saveGroup();
    await expect(groupActions.verifySuccessMessage()).toBeVisible({ timeout: 6000 });
    await page.reload({ timeout: 6000 });

   //check the edit form has the previous data and roles and fail the test if not 
  try {
  await expect(async () => {
    await page.reload();
    await groupPage.searchBoxAdministrationPage.fill(manualData.editName);
    await groupPage.searchBoxAdministrationPage.press('Enter');
    await expect(groupActions.verifyGroupInList(manualData.editName)).toBeVisible();
    //click on pensil icon to edit TF
    await groupPage.editTaskForceButton.click();
     // Verify form heading
    await expect(groupPage.editTaskForceHeading).toBeVisible();

    await expect(groupPage.nameField).toHaveValue(manualData.editName);
   //verify roles being present in the edit form
    await expect(groupPage.personTag.filter({hasText: 'TestChairJulio',}).first()).toBeVisible();
    await expect(groupPage.personTag.filter({ hasText: 'TestViceChairFredrick',}).first()).toBeVisible();
    await expect(groupPage.personTag.filter({hasText: 'TestSecretariatBradford',}).first()).toBeVisible();

  }).toPass({
    timeout: 60000,
    intervals: [10000],
  });
} catch (error) {
  const actualText = await groupPage.nameField.textContent();

  console.error(
    `Name mismatch after 60s for TF edit and roles.` 
  );
  throw error; // fail test
};
    //remove roles and edit to original name and description
    await groupActions.removeRolesinEditForm();
    await groupActions.fillEditGroupForm({
      name: manualData. editTFpositive,
      description: manualData.description
    });
   
    
     // Save and handle confirmation
    await groupActions.saveGroup();
    await expect(groupPage.confirmationHeading).toBeVisible();
    await groupActions.confirmCreation();

    await expect(groupActions.verifySuccessMessage()).toBeVisible({ timeout: 6000 }); 
    
   // Retry mechanism to check for the task force in the list
  //check the edit form has the previous data and roles and fails the test if not 
  await page.reload({ timeout: 6000 });
  try {
  await expect(async () => {
    await page.reload();
    await groupPage.searchBoxAdministrationPage.fill(manualData.editTFpositive);
    await groupPage.searchBoxAdministrationPage.press('Enter');
    await expect(groupActions.verifyGroupInList(manualData.editTFpositive)).toBeVisible();
    //click on pensil icon to edit TF
    await groupPage.editTaskForceButton.click();
     // Verify form heading
    await expect(groupPage.editTaskForceHeading).toBeVisible();
    await expect(groupPage.nameField).toHaveValue(manualData.editTFpositive);
    //verify roles being present in the edit form
    await expect(groupPage.personTag.filter({hasText: 'TestChairJulio',})).not.toBeVisible();
    await expect(groupPage.personTag.filter({hasText: 'TestViceChairFredrick',})).not.toBeVisible();
    await expect(groupPage.personTag.filter({hasText: 'TestSecretariatBradford',})).not.toBeVisible();

  }).toPass({
    timeout: 60000,
    intervals: [10000],
  });
} catch (error) {
  const actualText = await groupPage.nameField.textContent();

  console.error(
    `Name mismatch after 60s for TF original and empty roles.` 
  );
  throw error; // fail test
};

   });  

    test('Check TF Edit - required fields', async ({ page }) => {
    // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();
    
    await groupActions.goToCertainGroup(manualData.editTFNegative);

    //click on pensil icon to edit TF
    await groupPage.editTaskForceButton.click();
  
    // Verify form heading
    await expect(groupPage.editTaskForceHeading).toBeVisible();
    
    // Test validation - try to save without filling required fields
    const errors = await groupActions.verifyEditRequiredFieldErrors();
    await expect(errors.name).toBeVisible();
    await expect(errors.description).toBeVisible();

    //click cancel button to close the form
    await groupActions.cancelForm();

  });

  test('Check TF Edit - invalid data', async ({ page }) => {
 // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();
    
    await groupActions.goToCertainGroup(manualData.editTFNegative);
    //click on pensil icon to edit TF
    await groupPage.editTaskForceButton.click();
  
    // Verify form heading
    await expect(groupPage.editTaskForceHeading).toBeVisible();

    await groupActions.insertInvalidDataInEditGroupForm();
    const invalidErrors = await groupActions.verifyEditInvalidFieldErrors();
    await expect(invalidErrors.name).toBeVisible();
    await expect(invalidErrors.description).toBeVisible();

    //click cancel button to close the form
    await groupActions.cancelForm();

  });

   });