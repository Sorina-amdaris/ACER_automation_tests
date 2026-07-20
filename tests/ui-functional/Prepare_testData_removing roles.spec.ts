 import { test, expect } from '@playwright/test';
 import { GroupPage } from '../pages/GroupPage';
 import { GroupActions } from '../actions/GroupActions';
 import manualData from '../../manual-test-data.json';
 
 
 
 //RUN: npx playwright test tests/ui-functional/create-work-group-without-roles.spec.ts --headed   
 //Test data without roles
 
 // Use the authenticated state
 test.use({ storageState: '.auth/user.json' });
 
 test.describe('Prepare Test data by removing roles', () => {
   let groupPage: GroupPage;
   let groupActions: GroupActions;
   
   test.beforeEach(async ({ page }) => {
     groupPage = new GroupPage(page);
     groupActions = new GroupActions(page);
   });
 
   // test.afterEach(async ({ context }) => {
   //   await context.close();
   // });
 test.skip('Edit and Remove Members in Work Group - addMembersInWG_URL', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    await groupActions.goto(manualData.addMembersInWG_URL);
    await expect(groupPage.addMemberButton).toBeVisible();

    //await groupPage.tableView.click();
    //remove Last Chair role
    await expect(groupPage.removeChairButtonFromTableViewGrouPage).toBeVisible();
    await groupPage.removeChairButtonFromTableViewGrouPage.click();
    await expect(groupPage.confirmationRemoveHeading).toBeVisible(); 
    await groupPage.removeButton.click();
    await expect(groupPage.notificationMemberHasBeenRemovedMessage).toBeVisible({ timeout: 30000 });

    //remove Last vice-chair role
    await expect(groupPage.removeViceChairButtonFromTableViewGrouPage).toBeVisible();
    await groupPage.removeViceChairButtonFromTableViewGrouPage.click();
    await expect(groupPage.confirmationRemoveHeading).toBeVisible(); 
    await groupPage.removeButton.click();
    await expect(groupPage.notificationMemberHasBeenRemovedMessage).toBeVisible({ timeout: 30000 });
    
    //remove Last Secretariat role    
    await expect(groupPage.removeSecretariatButtonFromTableViewGrouPage).toBeVisible();
    await groupPage.removeSecretariatButtonFromTableViewGrouPage.click();
    await expect(groupPage.confirmationRemoveHeading).toBeVisible(); 
    await groupPage.removeButton.click();
    await expect(groupPage.notificationMemberHasBeenRemovedMessage).toBeVisible({ timeout: 30000 });

     //Wait for the data to be persisted before reloading
    await page.waitForTimeout(2000);
    //Reload the page to verify the removed member to be not present in the list
    await page.reload({ timeout: 6000 });
   
    //check Key People section assertion after removing members
    await page.reload({ timeout: 6000 });
    await expect(async () => {
    await page.reload({ timeout: 6000 });
    await expect(groupPage.keyPeopleSection).not.toBeVisible();
    await expect(groupPage.chairMemberinGroupPage).not.toBeVisible();
    await expect(groupPage.viceChairMemberinGroupPage).not.toBeVisible();
    await expect(groupPage.acerContactMemberinGroupPage).not.toBeVisible();
  }).toPass({
    timeout: 60000,
    intervals: [5000],}); 

   });

   test.skip('Edit and Remove Members in Work Group - editAndRemoveMembersInWG_URL', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    await groupActions.goto(manualData.editAndRemoveMembersInWG_URL);
    await expect(groupPage.addMemberButton).toBeVisible();

    //await groupPage.tableView.click();
    //remove Last Chair role
    await expect(groupPage.removeChairButtonFromTableViewGrouPage).toBeVisible();
    await groupPage.removeChairButtonFromTableViewGrouPage.click();
    await expect(groupPage.confirmationRemoveHeading).toBeVisible(); 
    await groupPage.removeButton.click();
    await expect(groupPage.notificationMemberHasBeenRemovedMessage).toBeVisible({ timeout: 30000 });

    //remove Last vice-chair role
    await expect(groupPage.removeViceChairButtonFromTableViewGrouPage).toBeVisible();
    await groupPage.removeViceChairButtonFromTableViewGrouPage.click();
    await expect(groupPage.confirmationRemoveHeading).toBeVisible(); 
    await groupPage.removeButton.click();
    await expect(groupPage.notificationMemberHasBeenRemovedMessage).toBeVisible({ timeout: 30000 });
    
    //remove Last Secretariat role    
    await expect(groupPage.removeSecretariatButtonFromTableViewGrouPage).toBeVisible();
    await groupPage.removeSecretariatButtonFromTableViewGrouPage.click();
    await expect(groupPage.confirmationRemoveHeading).toBeVisible(); 
    await groupPage.removeButton.click();
    await expect(groupPage.notificationMemberHasBeenRemovedMessage).toBeVisible({ timeout: 30000 });

     //Wait for the data to be persisted before reloading
    await page.waitForTimeout(2000);
    //Reload the page to verify the removed member to be not present in the list
    await page.reload({ timeout: 6000 });
   
    //check Key People section assertion after removing members
    await page.reload({ timeout: 6000 });
    await expect(async () => {
    await page.reload({ timeout: 6000 });
    await expect(groupPage.keyPeopleSection).not.toBeVisible();
    await expect(groupPage.chairMemberinGroupPage).not.toBeVisible();
    await expect(groupPage.viceChairMemberinGroupPage).not.toBeVisible();
    await expect(groupPage.acerContactMemberinGroupPage).not.toBeVisible();
  }).toPass({
    timeout: 60000,
    intervals: [5000],}); 

    

   });
});