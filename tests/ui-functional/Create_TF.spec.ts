import { test, expect } from '@playwright/test';
import { GroupPage } from '../pages/GroupPage';
import { GroupActions } from '../actions/GroupActions';
import manualData from '../../manual-test-data.json';
import { FileSaver } from '../utils/fileSaver';

//RUN: npx playwright test tests/ui-functional/create-work-group-without-roles.spec.ts --headed   

// Use the authenticated state
test.use({ storageState: '.auth/user.json' });

test.describe('Task Force Management creation', () => {
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

  test('Create Task Force with roles', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();

    //click add TF button for certain WG from manual test data file
    await groupActions.goToClickCreateTaskForce();

    // Verify form heading
    await expect(groupPage.createTaskForceHeading).toBeVisible();

    // Fill the form with random data
    const TFrandomName = await groupActions.fillTFFormWithRandomData();
    const randomData = await groupActions.fillGroupFormWithRandomData();
    console.log('Created task force with roles:', TFrandomName,randomData);

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
    await expect(groupActions.verifySuccessMessage()).toBeVisible({ timeout: 5000 });

    //save the site for later verification
    await FileSaver.saveSiteData(randomData.siteName, 'created-task-forces_withRoles.json');
  
   // Retry mechanism to check for the work group in the list
    await expect(async () => {
    await page.reload();
    
    await groupPage.searchBoxAdministrationPage.fill(TFrandomName.name);
    await groupPage.searchBoxAdministrationPage.press('Enter');

    await expect(
    groupActions.verifyGroupInList(TFrandomName.name)
    ).toBeVisible();
    }).toPass({
    // timeout: 300000,   // total retry time as 5 minutes
    // intervals: [10000] // retry every 10s
     timeout: 3000,   
     intervals: [100] 
  });

  
  });

  test('Check Task Force - required fields', async ({ page }) => {
    // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();
    
    //click add TF button for certain WG from manual test data file
    await groupActions.goToClickCreateTaskForce();
  
    // Verify form heading
    await expect(groupPage.createTaskForceHeading).toBeVisible();
    
    // Test validation - try to save without filling required fields
    const errors = await groupActions.verifyRequiredFieldErrors();
    await expect(errors.name).toBeVisible();
    await expect(errors.description).toBeVisible();
    await expect(errors.code).toBeVisible();
    await expect(errors.siteName).toBeVisible();

    //click cancel button to close the form
    await groupActions.cancelForm();

  });

  test('Check Task Force - invalid data', async ({ page }) => {

    // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();
 
    //click add TF button for certain WG from manual test data file
    await groupActions.goToClickCreateTaskForce();

    // Verify form heading
    await expect(groupPage.createTaskForceHeading).toBeVisible();

    await groupActions.insertInvalidDataInCreateGroupForm();
    const invalidErrors = await groupActions.verifyInvalidFieldErrors();
    await expect(invalidErrors.name).toBeVisible();
    await expect(invalidErrors.description).toBeVisible();
    await expect(invalidErrors.code).toBeVisible();
    await expect(invalidErrors.siteName).toBeVisible();

    //click cancel button to close the form
    await groupActions.cancelForm();

  }); 

  test('Create Task Force without roles', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();
    
     
    //click add TF button for certain WG from manual test data file
    await groupActions.goToClickCreateTaskForce();
    
    // Fill the form with random data
    const TFrandomName = await groupActions.fillTFFormWithRandomData();
    const randomData = await groupActions.fillGroupFormWithRandomData();
    console.log('Created Task Force without roles:', TFrandomName,randomData);
    
    // Save and handle confirmation
    await groupActions.saveGroup();
    await expect(groupPage.confirmationHeading).toBeVisible();
    await expect(groupPage.confirmationMessage).toBeVisible();
    await groupActions.confirmCreation();
    
    await expect(groupActions.verifySuccessMessage()).toBeVisible({ timeout: 5000 });
    await FileSaver.saveSiteData(randomData.siteName, 'created-task-forces_withoutRoles.json');
   // Retry mechanism to check for the work group in the list
    await expect(async () => {
    await page.reload();
    
    await groupPage.searchBoxAdministrationPage.fill(TFrandomName.name);
    await groupPage.searchBoxAdministrationPage.press('Enter');

    await expect(
    groupActions.verifyGroupInList(TFrandomName.name)
    ).toBeVisible();
    }).toPass({
   // timeout: 300000,   // total retry time as 5 minutes
    // intervals: [10000] // retry every 10s
     timeout: 3000,   
     intervals: [100] 
    }); 
  });
});
