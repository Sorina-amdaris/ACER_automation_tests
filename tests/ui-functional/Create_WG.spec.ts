import { test, expect } from '@playwright/test';
import { GroupPage } from '../pages/GroupPage';
import { GroupActions } from '../actions/GroupActions';
import { saveWorkGroupName } from '../utils/testData';

//RUN: npx playwright test tests/ui-functional/create-work-group-without-roles.spec.ts --headed   

// Use the authenticated state
test.use({ storageState: '.auth/user.json' });

test.describe('Work Group Management creation', () => {
  let groupPage: GroupPage;
  let groupActions: GroupActions;
  
  test.beforeEach(async ({ page }) => {
    groupPage = new GroupPage(page);
    groupActions = new GroupActions(page);
    await groupActions.goto();
  });

  test('Create Work Group with roles', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();
    await groupActions.clickCreateGroup();
    
    // Verify form heading
    await expect(groupPage.createWorkingGroupHeading).toBeVisible();

    // Fill the form with random data
    const randomData = await groupActions.fillGroupFormWithRandomData();
    console.log('Created work group with random data:', randomData);
   ////////////////////// make it cleaner
    await groupPage.comboboxChair.click();
    await groupPage.comboboxChair.fill('testChair');
    await page.getByRole('option', { name: 'TestChairJulio TestChairNienow testchairjulio.testchairnienow@' }).click();

    await groupPage.comboboxViceChair.click();
    await groupPage.comboboxViceChair.fill('testViceChair');
    await page.getByRole('option', { name: 'TestViceChairFredrick TestViceChairMohr testvicechairfredrick.testvicechairmohr@' }).click();

    await groupPage.comboboxSecretariat.click();
    await groupPage.comboboxSecretariat.fill('testSecretariat');
    await page.getByRole('option', { name: ' TestSecretariatBradford TestSecretariatLedner testsecretariatbradford.testsecretariatledner@' }).click();

   
    // Save and verify success
    await groupActions.saveGroup();
    await expect(groupActions.verifySuccessMessage(randomData.name)).toBeVisible();
    
    // Navigate back and verify in list
    //await page.waitForTimeout(480000); // Wait for 8 minutes (480,000 ms) as it takes a while to appear in the list
    await page.reload({ timeout: 480000 });  // Reload the page after waiting for 8 minutes (480,000 ms) as it takes a while to appear in the list
    saveWorkGroupName(randomData.name); //saved WG name for future tests in testData file
    
    // Retry mechanism to check for the work group in the list
    await expect(async () => {
    await page.reload();
    await groupActions.scrollDown();
    await expect(
    groupActions.verifyGroupInList(randomData.name)
    ).toBeVisible();
    }).toPass({
    timeout: 300000,   // total retry time as 5 minutes
    intervals: [10000] // retry every 10s
  });

  
  });

  test('Check Work Group - required fields', async ({ page }) => {
    // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();
    await groupActions.clickCreateGroup();
    
    // Verify form heading
    await expect(groupPage.createWorkingGroupHeading).toBeVisible();
    
    // Test validation - try to save without filling required fields
    const errors = await groupActions.verifyRequiredFieldErrors();
    await expect(errors.name).toBeVisible();
    await expect(errors.description).toBeVisible();
    await expect(errors.code).toBeVisible();
    await expect(errors.siteName).toBeVisible();

    //click cancel button to close the form
    await groupActions.cancelForm();

  });

  test('Check Work Group - invalid data', async ({ page }) => {

    // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();
    await groupActions.clickCreateGroup();
    
    // Verify form heading
    await expect(groupPage.createWorkingGroupHeading).toBeVisible();

    await groupActions.insertInvalidDataInCreateGroupForm();
    const invalidErrors = await groupActions.verifyInvalidFieldErrors();
    await expect(invalidErrors.name).toBeVisible();
    await expect(invalidErrors.description).toBeVisible();
    await expect(invalidErrors.code).toBeVisible();
    await expect(invalidErrors.siteName).toBeVisible();

    //click cancel button to close the form
    await groupActions.cancelForm();

  }); 

  test('Create Work Group without roles', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();
    await groupActions.clickCreateGroup();
    
    // Fill with random data (no roles)
    const randomData = await groupActions.fillGroupFormWithRandomData();
    console.log('Created work group without roles:', randomData);
    
    // Save and handle confirmation
    await groupActions.saveGroup();
    await expect(groupPage.confirmationHeading).toBeVisible();
    await expect(groupPage.confirmationMessage).toBeVisible();
    await groupActions.confirmCreation();
    
   await expect(groupActions.verifySuccessMessage(randomData.name)).toBeVisible();
    
    // Navigate back and verify in list
    //await page.waitForTimeout(480000); // Wait for 8 minutes (480,000 ms) as it takes a while to appear in the list
    await page.reload({ timeout: 480000 });  // Reload the page after waiting for 8 minutes (480,000 ms) as it takes a while to appear in the list
    saveWorkGroupName(randomData.name); //saved WG name for future tests in testData file
    
    // Retry mechanism to check for the work group in the list
    await expect(async () => {
    await page.reload();
    await groupActions.scrollDown();
    await expect(
    groupActions.verifyGroupInList(randomData.name)
    ).toBeVisible();
    }).toPass({
    timeout: 300000,   // total retry time as 5 minutes
    intervals: [10000] // retry every 10s
  });

  });
});
