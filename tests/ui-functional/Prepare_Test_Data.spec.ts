import { test, expect, Locator } from '@playwright/test';
import { GroupPage } from '../pages/GroupPage';
import { GroupActions } from '../actions/GroupActions';
import manualData from '../../manual-test-data.json';
import { FileSaver } from '../utils/fileSaver';

//RUN: npx playwright test tests/ui-functional/create-work-group-without-roles.spec.ts --headed  
//npx playwright show-report 

// Use the authenticated state
test.use({ storageState: '.auth/user.json' });

// Removes a role only if its remove button is currently visible, otherwise skips it
async function removeRoleIfVisible(groupPage: GroupPage, removeButton: Locator, isLastRole: boolean) {
  if (!(await removeButton.isVisible())) return;

  await removeButton.click();
  await expect(groupPage.confirmationRemoveHeading).toBeVisible();
  await expect(isLastRole ? groupPage.confirmationMessageLastRole : groupPage.confirmationMessage).toBeVisible();
  await groupPage.removeButton.click();
  await expect(groupPage.notificationMemberHasBeenRemovedMessage).toBeVisible({ timeout: 30000 });
}

test.describe('Remove all members from test data groups', () => {
  let groupPage: GroupPage;
  let groupActions: GroupActions;
  
  test.beforeEach(async ({ page }) => {
    groupPage = new GroupPage(page);
    groupActions = new GroupActions(page);
  });

  // test.afterEach(async ({ context }) => {
  //   await context.close();
  // });
test('Remove roles from addMembersInWG_URL', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Go to test data groups
    await groupActions.goto(manualData.addMembersInWG_URL);
    await expect(groupPage.membersSection).toBeVisible();
 
    await groupPage.tableView.click();

    //remove each role only if it is present, otherwise skip it
    await removeRoleIfVisible(groupPage, groupPage.removeChairButtonFromTableViewGrouPage, true);
    await removeRoleIfVisible(groupPage, groupPage.removeViceChairButtonFromTableViewGrouPage, true);
    await removeRoleIfVisible(groupPage, groupPage.removeSecretariatButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeContractorButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeObserverButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeMemberButtonFromTableViewGrouPage, false);

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

test('Remove roles from editAndRemoveMembersInWG_URL', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Go to test data groups
    await groupActions.goto(manualData.editAndRemoveMembersInWG_URL);
    await expect(groupPage.membersSection).toBeVisible();
 
    await groupPage.tableView.click();

    //remove each role only if it is present, otherwise skip it
    await removeRoleIfVisible(groupPage, groupPage.removeChairButtonFromTableViewGrouPage, true);
    await removeRoleIfVisible(groupPage, groupPage.removeViceChairButtonFromTableViewGrouPage, true);
    await removeRoleIfVisible(groupPage, groupPage.removeSecretariatButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeContractorButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeObserverButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeMemberButtonFromTableViewGrouPage, false);

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
test('Remove roles from addMembersInTF_URL', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Go to test data groups
    await groupActions.goto(manualData.addMembersInTF_URL);
    await expect(groupPage.membersSection).toBeVisible();
 
    await groupPage.tableView.click();

    //remove each role only if it is present, otherwise skip it
    await removeRoleIfVisible(groupPage, groupPage.removeChairButtonFromTableViewGrouPage, true);
    await removeRoleIfVisible(groupPage, groupPage.removeViceChairButtonFromTableViewGrouPage, true);
    await removeRoleIfVisible(groupPage, groupPage.removeSecretariatButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeContractorButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeObserverButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeMemberButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeConvenorButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeExpertButtonFromTableViewGrouPage, false);

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

test('Remove roles from editAndRemoveMembersInTF_URL', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Go to test data groups
    await groupActions.goto(manualData.editAndRemoveMembersInTF_URL);
    await expect(groupPage.membersSection).toBeVisible();
 
    await groupPage.tableView.click();

    //remove each role only if it is present, otherwise skip it
    await removeRoleIfVisible(groupPage, groupPage.removeChairButtonFromTableViewGrouPage, true);
    await removeRoleIfVisible(groupPage, groupPage.removeViceChairButtonFromTableViewGrouPage, true);
    await removeRoleIfVisible(groupPage, groupPage.removeSecretariatButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeContractorButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeObserverButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeMemberButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeConvenorButtonFromTableViewGrouPage, false);
    await removeRoleIfVisible(groupPage, groupPage.removeExpertButtonFromTableViewGrouPage, false);

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
