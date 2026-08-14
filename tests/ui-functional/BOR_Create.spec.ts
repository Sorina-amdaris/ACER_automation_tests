import { test, expect } from '@playwright/test';
import { GroupPage } from '../pages/GroupPage';
import { GroupActions } from '../actions/GroupActions';
import manualData from '../../manual-test-data.json';
import { FileSaver } from '../utils/fileSaver';

//RUN: npx playwright test tests/ui-functional/create-work-group-without-roles.spec.ts --headed  
//npx playwright show-report 

// Use the authenticated state
test.use({ storageState: '.auth/user.json' });

test.describe('BOR Management creation', () => {
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

  test('Create BOR with roles', { tag: '@smoke' }, async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();
    await groupPage.boardButton.click();
    await expect(groupPage.createBoardButton).toBeVisible();
    await groupPage.createBoardButton.click();

    //verify form heading
    await expect(groupPage.boardTypeDropdown).toBeVisible();
    await groupPage.boardTypeDropdown.click();
    await groupPage.optionBorToSelectInBoardTypeDropdown.click();

     // Fill the form with random data
    const BORrandomName = await groupActions.fillGroupNameFormWithRandomData('BOR');
    const randomData = await groupActions.fillGroupFormWithRandomData();
    console.log('Created BOR with roles:', BORrandomName,randomData);

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
   
    // Save and verify success
    await groupActions.saveGroup();
    await expect(groupActions.verifySuccessMessage()).toBeVisible({ timeout: 10000 });
    
    //save the site for later verification
    await FileSaver.saveSiteData(randomData.siteName, 'created-BOR_withRoles.json');
    const siteUrl = FileSaver.getLastUrl('created-BOR_withRoles.json');
    
    
    // Retry mechanism to check for the work group in the list
    await expect(async () => {
    await groupActions.goto(siteUrl);
    await expect(groupPage.extranetHubLink).toBeVisible()
    }).toPass({
    timeout: 300000,   // total retry time as 5 minutes
    intervals: [10000] // retry every 10s
  });

  });

  test('Check BOR - required fields', { tag: '@smoke' }, async ({ page }) => {
      // Open Board section and create group
    await expect(groupPage.groupsButton).toBeVisible();
    await groupPage.boardButton.click();
    await expect(groupPage.createBoardButton).toBeVisible();
    await groupPage.createBoardButton.click();

    //verify form heading
    await expect(groupPage.boardTypeDropdown).toBeVisible();
    await groupPage.boardTypeDropdown.click();
    await groupPage.optionBorToSelectInBoardTypeDropdown.click();
    
    // Test validation - try to save without filling required fields
    const errors = await groupActions.verifyRequiredFieldErrors();
    await expect(errors.name).toBeVisible();
    await expect(errors.description).toBeVisible();
    await expect(errors.code).toBeVisible();
    await expect(errors.siteName).toBeVisible();

    //click cancel button to close the form
    await groupActions.cancelForm();

  });

  test('Check BOR - invalid data', { tag: '@smoke' }, async ({ page }) => {

       // Open Board section and create group
    await expect(groupPage.groupsButton).toBeVisible();
    await groupPage.boardButton.click();
    await expect(groupPage.createBoardButton).toBeVisible();
    await groupPage.createBoardButton.click();

    //verify form heading
    await expect(groupPage.boardTypeDropdown).toBeVisible();
    await groupPage.boardTypeDropdown.click();
    await groupPage.optionBorToSelectInBoardTypeDropdown.click();

    await groupActions.insertInvalidDataInCreateGroupForm();
    const invalidErrors = await groupActions.verifyInvalidFieldErrors();
    await expect(invalidErrors.name).toBeVisible();
    await expect(invalidErrors.description).toBeVisible();
    await expect(invalidErrors.code).toBeVisible();
    await expect(invalidErrors.siteName).toBeVisible();

    //click cancel button to close the form
    await groupActions.cancelForm();

  }); 

  test('Create BOR without roles', { tag: '@smoke' }, async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
       // Open Board section and create group
    await expect(groupPage.groupsButton).toBeVisible();
    await groupPage.boardButton.click();
    await expect(groupPage.createBoardButton).toBeVisible();
    await groupPage.createBoardButton.click();

    //verify form heading
    await expect(groupPage.boardTypeDropdown).toBeVisible();
    await groupPage.boardTypeDropdown.click();
    await groupPage.optionBorToSelectInBoardTypeDropdown.click();
    
     // Fill the form with random data
    const BORrandomName = await groupActions.fillGroupNameFormWithRandomData('BOR');
    const randomData = await groupActions.fillGroupFormWithRandomData();
    console.log('Created BOR without roles:', BORrandomName,randomData);

    // Save and handle confirmation
    await groupActions.saveGroup();
    await expect(groupPage.confirmationHeading).toBeVisible();
    await expect(groupPage.confirmationMessage).toBeVisible();
    await groupActions.confirmCreation();
    
    await expect(groupActions.verifySuccessMessage()).toBeVisible({ timeout: 10000 });
    //save the site for later verification
    await FileSaver.saveSiteData(randomData.siteName, 'created-BOR_withoutRoles.json');
    const siteUrl = FileSaver.getLastUrl('created-BOR_withoutRoles.json');

   // Retry mechanism to check for the work group in the list
    await expect(async () => {
    await groupActions.goto(siteUrl);
    await expect(groupPage.extranetHubLink).toBeVisible()
    }).toPass({
    timeout: 300000,   // total retry time as 5 minutes
    intervals: [10000] // retry every 10s
  });

  });
});
