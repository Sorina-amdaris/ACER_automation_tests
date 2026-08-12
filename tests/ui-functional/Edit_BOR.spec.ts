import { test, expect } from '@playwright/test';
import { GroupPage } from '../pages/GroupPage';
import { GroupActions } from '../actions/GroupActions';
import manualData from '../../manual-test-data.json';


//RUN: npx playwright test tests/ui-functional/create-work-group-without-roles.spec.ts --headed   
//Test data without roles

// Use the authenticated state
test.use({ storageState: '.auth/user.json' });

test.describe('Edit BOR positive and negative scenarios', () => {
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

  test('Edit BOR form', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
     // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();
    await groupPage.boardButton.click();
    await expect(groupPage.createBoardButton).toBeVisible();

    await groupActions.goToCertainGroup(manualData.editBORname);

    //click on pensil icon to edit BOR
    await groupPage.editBoardPencilIcon.click();

     // Verify form heading
    await expect(groupPage.editBoardHeading).toBeVisible();
    await groupActions.fillEditGroupForm({
      name: manualData.BORNameEdited,
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
    await expect(groupActions.verifySuccessMessage()).toBeVisible({ timeout: 10000 });
    await page.reload({ timeout: 6000 });

    // Retry mechanism to check for the work group in the list
    await expect(async () => {
    await page.reload();
    await expect(groupPage.groupsButton).toBeVisible();
    await groupPage.boardButton.click();
    await expect(groupPage.createBoardButton).toBeVisible();
    await groupPage.searchBoxAdministrationPage.fill(manualData.BORNameEdited);
    await groupPage.searchBoxAdministrationPage.press('Enter');
    await expect(groupActions.verifyGroupInList(manualData.BORNameEdited)).toBeVisible();
    //click on pensil icon to edit BOR
    await groupPage.editBoardPencilIcon.click();
     // Verify form heading
    await expect(groupPage.editBoardHeading).toBeVisible();

    await expect(groupPage.nameField).toHaveValue(manualData.BORNameEdited);
   //verify roles being present in the edit form
    await expect(groupPage.personTag.filter({hasText: 'TestChairJulio',}).first()).toBeVisible();
    await expect(groupPage.personTag.filter({ hasText: 'TestViceChairFredrick',}).first()).toBeVisible();
    await expect(groupPage.personTag.filter({hasText: 'TestSecretariatBradford',}).first()).toBeVisible();
    }).toPass({
    timeout: 60000,   // total retry time as 5 minutes
    intervals: [10000] // retry every 10s
  });

    //remove roles and edit to original name and description
    await groupActions.removeRolesinEditForm();
    await groupActions.fillEditGroupForm({
      name: manualData.editBORname,
      description: manualData.description
    });
    
     // Save and handle confirmation
    await groupActions.saveGroup();
    await expect(groupPage.confirmationHeading).toBeVisible();
    await groupActions.confirmCreation();

    await expect(groupActions.verifySuccessMessage()).toBeVisible({ timeout: 10000 }); 
    
   // Retry mechanism to check for the work group in the list
  await page.reload({ timeout: 6000 });
  await expect(async () => {
    await page.reload();
    await expect(groupPage.groupsButton).toBeVisible();
    await groupPage.boardButton.click();
    await expect(groupPage.createBoardButton).toBeVisible();
    await groupPage.searchBoxAdministrationPage.fill(manualData.editWG);
    await groupPage.searchBoxAdministrationPage.press('Enter');
    await expect(groupActions.verifyGroupInList(manualData.editWG)).toBeVisible();
    //click on pensil icon to edit WG
    await groupPage.editBoardPencilIcon.click();
     // Verify form heading
    await expect(groupPage.editBoardHeading).toBeVisible();
    await expect(groupPage.nameField).toHaveValue(manualData.editBORname);
    //verify roles being present in the edit form
    await expect(groupPage.personTag.filter({hasText: 'TestChairJulio',})).not.toBeVisible();
    await expect(groupPage.personTag.filter({hasText: 'TestViceChairFredrick',})).not.toBeVisible();
    await expect(groupPage.personTag.filter({hasText: 'TestSecretariatBradford',})).not.toBeVisible();

  }).toPass({
    timeout: 60000,
    intervals: [10000],
  });

   });  

    test('Check BOR Edit - required fields', async ({ page }) => {
    // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();
    await expect(groupPage.groupsButton).toBeVisible();
    await groupPage.boardButton.click();
    await expect(groupPage.createBoardButton).toBeVisible();

    await groupActions.goToCertainGroup(manualData.editBORname);
    //click on pensil icon to edit BoR
    await groupPage.editBoardPencilIcon.click();

    // Verify form heading
    await expect(groupPage.editBoardHeading).toBeVisible();
    
    // Test validation - try to save without filling required fields
    const errors = await groupActions.verifyEditRequiredFieldErrors();
    await expect(errors.name).toBeVisible();
    await expect(errors.description).toBeVisible();

    //click cancel button to close the form
    await groupActions.cancelForm();

  });

  test('Check BOR Edit - invalid data', async ({ page }) => {
  // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();
    await expect(groupPage.groupsButton).toBeVisible();
    await groupPage.boardButton.click();
    await expect(groupPage.createBoardButton).toBeVisible();
    
    await groupActions.goToCertainGroup(manualData.editBORname);

    //click on pensil icon to edit BOR
    await groupPage.editBoardPencilIcon.click();

    // Verify form heading
    await expect(groupPage.editBoardHeading).toBeVisible();

    await groupActions.insertInvalidDataInEditGroupForm();
    const invalidErrors = await groupActions.verifyEditInvalidFieldErrors();
    await expect(invalidErrors.name).toBeVisible();
    await expect(invalidErrors.description).toBeVisible();

    //click cancel button to close the form
    await groupActions.cancelForm();

  });

   });
