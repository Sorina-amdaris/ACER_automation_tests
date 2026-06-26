import { test, expect } from '@playwright/test';
import { WorkGroupsPage } from '../pages/WorkGroupsPage';
import { WorkGroupsActions } from '../actions/WorkGroupsActions';
import { saveWorkGroupName } from '../utils/testData';

//RUN: npx playwright tests/

// Use the authenticated state
test.use({ storageState: '.auth/user.json' });

test.describe('Work Group Management creation', () => {
  let workGroupsPage: WorkGroupsPage;
  let workGroupsActions: WorkGroupsActions;
  
  test.beforeEach(async ({ page }) => {
    workGroupsPage = new WorkGroupsPage(page);
    workGroupsActions = new WorkGroupsActions(page);
    await workGroupsActions.goto();
  });

  test('Create Work Group with roles', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Open groups section and create group
    await expect(workGroupsPage.groupsButton).toBeVisible();
    await workGroupsActions.clickCreateGroup();
    
    // Verify form heading
    await expect(workGroupsPage.createWorkingGroupHeading).toBeVisible();

    // Fill the form with random data
    const randomData = await workGroupsActions.fillWorkGroupFormWithRandomData();
    console.log('Created work group with random data:', randomData);
   ////////////////////// make it cleaner
    await workGroupsPage.comboboxChair.click();
    await workGroupsPage.comboboxChair.fill('testChair');
    await page.getByRole('option', { name: 'TestChairJulio TestChairNienow testchairjulio.testchairnienow@' }).click();

    await workGroupsPage.comboboxViceChair.click();
    await workGroupsPage.comboboxViceChair.fill('testViceChair');
    await page.getByRole('option', { name: 'TestViceChairFredrick TestViceChairMohr testvicechairfredrick.testvicechairmohr@' }).click();

    await workGroupsPage.comboboxSecretariat.click();
    await workGroupsPage.comboboxSecretariat.fill('testSecretariat');
    await page.getByRole('option', { name: ' TestSecretariatBradford TestSecretariatLedner testsecretariatbradford.testsecretariatledner@' }).click();

   
    // Save and verify success
    await workGroupsActions.saveWorkGroup();
    await expect(workGroupsActions.verifySuccessMessage(randomData.name)).toBeVisible();
    
    // Navigate back and verify in list
    //await page.waitForTimeout(480000); // Wait for 8 minutes (480,000 ms) as it takes a while to appear in the list
    await page.reload({ timeout: 480000 });  // Reload the page after waiting for 8 minutes (480,000 ms) as it takes a while to appear in the list
    saveWorkGroupName(randomData.name); //saved WG name for future tests in testData file
    
    // Retry mechanism to check for the work group in the list
    await expect(async () => {
    await page.reload();
    await workGroupsActions.scrollDown();
    await expect(
    workGroupsActions.verifyWorkGroupInList(randomData.name)
    ).toBeVisible();
    }).toPass({
    timeout: 300000,   // total retry time as 5 minutes
    intervals: [10000] // retry every 10s
  });

  
  });

  test('Check Work Group - required fields', async ({ page }) => {
    // Open groups section and create group
    await expect(workGroupsPage.groupsButton).toBeVisible();
    await workGroupsActions.clickCreateGroup();
    
    // Verify form heading
    await expect(workGroupsPage.createWorkingGroupHeading).toBeVisible();
    
    // Test validation - try to save without filling required fields
    const errors = await workGroupsActions.verifyRequiredFieldErrors();
    await expect(errors.name).toBeVisible();
    await expect(errors.description).toBeVisible();
    await expect(errors.code).toBeVisible();
    await expect(errors.siteName).toBeVisible();
  });
  test('Check Work Group - invalid data', async ({ page }) => {
   //HERE remaining code for invalid data test can be added

  }); 

  test('Create Work Group without roles', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Open groups section and create group
    await expect(workGroupsPage.groupsButton).toBeVisible();
    await workGroupsActions.clickCreateGroup();
    
    // Fill with random data (no roles)
    const randomData = await workGroupsActions.fillWorkGroupFormWithRandomData();
    console.log('Created work group without roles:', randomData);
    
    // Save and handle confirmation
    await workGroupsActions.saveWorkGroup();
    await expect(workGroupsPage.confirmationHeading).toBeVisible();
    await expect(workGroupsPage.confirmationMessage).toBeVisible();
    await workGroupsActions.confirmCreation();
    
    // Verify success using the random data
    await expect(workGroupsActions.verifySuccessMessage(randomData.name)).toBeVisible();
    
    // Navigate back and verify
    await workGroupsActions.goto();
    //await page.waitForTimeout(480000); // Wait for 8 minutes (480,000 ms) as it takes a while to appear in the list
    await page.reload({ timeout: 480000 });  // Reload the page after waiting for 8 minutes (480,000 ms) as it takes a while to appear in the list
    await workGroupsActions.scrollDown();
    await expect(workGroupsActions.verifyWorkGroupInList(randomData.name)).toBeVisible();
  });
});
