import { test, expect, Locator } from '@playwright/test';
import { GroupPage } from '../pages/GroupPage';
import { GroupActions } from '../actions/GroupActions';
import manualData from '../../manual-test-data.json';



//RUN: npx playwright test tests/ui-functional/create-work-group-without-roles.spec.ts --headed   
//Test data without roles

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

// Adds a member with the given role only if their remove button isn't already present, otherwise skips them.
// Pass `role` for every member after the first one (it triggers the role-selection step); omit it for the first member.
async function addRoleIfNotVisible(
  groupPage: GroupPage,
  groupActions: GroupActions,
  removeButton: Locator,
  searchWord: string,
  optionName: string,
  role?: string
) {
  if (await removeButton.isVisible()) return;

  const addButton = role ? groupPage.addMemberSecondbtn : groupPage.addMemberButton;
  await expect(addButton).toBeVisible({ timeout: 10000 });
  await addButton.click();
  await expect(groupPage.addMemberHeading).toBeVisible();
  await groupActions.selectPerson(groupPage.comboboxAddMember, searchWord, optionName);

  if (role) {
    await groupActions.selectRoleInAddMemberForm(role);
  } else {
    await groupPage.addMemberSaveButton.click();
    await expect(groupActions.verifySuccessMessage()).toBeVisible({ timeout: 60000 });
  }
}

test.describe('Edit BOR members scenarios in BOR details page', () => {
  let groupPage: GroupPage;
  let groupActions: GroupActions;
  
  test.beforeEach(async ({ page }) => {
    groupPage = new GroupPage(page);
    groupActions = new GroupActions(page);
  });

  // test.afterEach(async ({ context }) => {
  //   await context.close();
  // });

  test('Add Members in BOR', { tag: '@smoke' }, async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    await groupActions.goto(manualData.addmembersInBOR_URL);
    await expect(groupPage.membersSection).toBeVisible();
    //switch to Table view so the remove-button presence checks below actually resolve
    await groupPage.tableView.click();

    //fill out the user in the combobox - chair (skipped automatically if their remove button is already present)
    await addRoleIfNotVisible(
      groupPage,
      groupActions,
      groupPage.removeChairButtonFromTableViewGroupPage,
      manualData.searchWord.chairRole,
      manualData.selectRoleOption.chairRole
    );

    //fill out the user in the combobox - vice-chair
    await addRoleIfNotVisible(
      groupPage,
      groupActions,
      groupPage.removeViceChairButtonFromTableViewGroupPage,
      manualData.searchWord.viceChairRole,
      manualData.selectRoleOption.viceChairRole,
      'Vice-Chair'
    );

    //fill out the user in the combobox - secretariat
    await addRoleIfNotVisible(
      groupPage,
      groupActions,
      groupPage.removeSecretariatButtonFromTableViewGroupPage,
      manualData.searchWord.secretariatRole,
      manualData.selectRoleOption.secretariatRole,
      'Secretariat'
    );

    //fill out the user in the combobox - contractor
    await addRoleIfNotVisible(
      groupPage,
      groupActions,
      groupPage.removeContractorButtonFromTableViewGroupPage,
      manualData.searchWord.contractorRole,
      manualData.selectRoleOption.contractorRole,
      'Contractor'
    );

    // //fill out the user in the combobox - convenor
    // await addRoleIfNotVisible(
    //   groupPage,
    //   groupActions,
    //   groupPage.removeConvenorButtonFromTableViewGroupPage,
    //   manualData.searchWord.convenorRole,
    //   manualData.selectRoleOption.convenorRole,
    //   'Convenor'
    // );

    //fill out the user in the combobox - observer
    await addRoleIfNotVisible(
      groupPage,
      groupActions,
      groupPage.removeObserverButtonFromTableViewGroupPage,
      manualData.searchWord.observerRole,
      manualData.selectRoleOption.observerRole,
      'Observer'
    );

    // //fill out the user in the combobox - expert
    // await addRoleIfNotVisible(
    //   groupPage,
    //   groupActions,
    //   groupPage.removeExpertButtonFromTableViewGroupPage,
    //   manualData.searchWord.expertRole,
    //   manualData.selectRoleOption.expertRole,
    //   'Expert'
    // );

    //fill out the user in the combobox - member
    await addRoleIfNotVisible(
      groupPage,
      groupActions,
      groupPage.removeMemberButtonFromTableViewGroupPage,
      manualData.searchWord.memberRole,
      manualData.selectRoleOption.memberRole,
      'Member'
    );

    //Wait for the data to be persisted before reloading
    await page.waitForTimeout(2000);
    //Reload the page to verify the added members are present in the list
    await page.reload({ timeout: 6000 });
    
    await expect(async () => {
    await page.reload({ timeout: 6000 });
    await page.mouse.wheel(0, 1000);
    await expect(groupPage.keyPeopleSection).toBeVisible();
    await expect(groupPage.viceChairMemberinGroupPage).toHaveCount(1); //for vice-chair and contractor roles
    await expect(groupPage.chairMemberinGroupPage).toHaveCount(1);
    await expect(groupPage.acerContactMemberinGroupPage).toHaveCount(2); //for secretariat and contractor roles
    await expect(groupPage.membersSection).toBeVisible();
    await expect(groupPage.membersCheckboxes).toHaveCount(7);//6 actually
  }).toPass({
    timeout: 60000,
    intervals: [5000],}); //for vice-chair, chair, secretariat, contractor, observer and member roles
   });  

   test('Edit and Remove Members in BOR', { tag: '@smoke' }, async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    await groupActions.goto(manualData.addmembersInBOR_URL);
    await expect(groupPage.membersSection).toBeVisible();
    //switch to Table view so the remove-button presence checks below actually resolve
    await groupPage.tableView.click();

    //fill out the user in the combobox - chair (skipped automatically if their remove button is already present)
    await addRoleIfNotVisible(
      groupPage,
      groupActions,
      groupPage.removeChairButtonFromTableViewGroupPage,
      manualData.searchWord.chairRole,
      manualData.selectRoleOption.chairRole
    );

    //fill out the user in the combobox - vice-chair
    await addRoleIfNotVisible(
      groupPage,
      groupActions,
      groupPage.removeViceChairButtonFromTableViewGroupPage,
      manualData.searchWord.viceChairRole,
      manualData.selectRoleOption.viceChairRole,
      'Vice-Chair'
    );

    //fill out the user in the combobox - secretariat
    await addRoleIfNotVisible(
      groupPage,
      groupActions,
      groupPage.removeSecretariatButtonFromTableViewGroupPage,
      manualData.searchWord.secretariatRole,
      manualData.selectRoleOption.secretariatRole,
      'Secretariat'
    );
    await page.reload({ timeout: 6000 });
    await expect(groupPage.membersSection).toBeVisible();
 
    await groupPage.tableView.click();
    await removeRoleIfVisible(groupPage, groupPage.removeContractorButtonFromTableViewGroupPage, false);
    //Wait for the data to be persisted before reloading
    await page.waitForTimeout(2000);
    //Reload the page to verify the added members are present in the list
    await page.reload({ timeout: 6000 });
   
    //check Key People section
    await page.reload({ timeout: 6000 });
    await expect(async () => {
    await page.reload({ timeout: 6000 });
    await expect(groupPage.keyPeopleSection).toBeVisible();
    await expect(groupPage.chairMemberinGroupPage).toHaveCount(1);
    await expect(groupPage.viceChairMemberinGroupPage).toHaveCount(1);
    await expect(groupPage.acerContactMemberinGroupPage).toHaveCount(1);
  }).toPass({
    timeout: 60000,
    intervals: [5000],}); 

    await expect(groupPage.membersSection).toBeVisible();


    await groupPage.tableView.click();
    //remove Last Chair role
    await expect(groupPage.removeChairButtonFromTableViewGroupPage).toBeVisible();
    await groupPage.removeChairButtonFromTableViewGroupPage.click();
    await expect(groupPage.confirmationRemoveHeading).toBeVisible(); 
    await expect(groupPage.confirmationMessageLastRole).toBeVisible();
    await groupPage.removeButton.click();
    await expect(groupPage.notificationMemberHasBeenRemovedMessage).toBeVisible({ timeout: 30000 });

    //remove Last vice-chair role
    await expect(groupPage.removeViceChairButtonFromTableViewGroupPage).toBeVisible();
    await groupPage.removeViceChairButtonFromTableViewGroupPage.click();
    await expect(groupPage.confirmationRemoveHeading).toBeVisible(); 
    await expect(groupPage.confirmationMessageLastRole).toBeVisible();
    await groupPage.removeButton.click();
    await expect(groupPage.notificationMemberHasBeenRemovedMessage).toBeVisible({ timeout: 30000 });
    
    //remove Last Secretariat role    
    await expect(groupPage.removeSecretariatButtonFromTableViewGroupPage).toBeVisible();
    await groupPage.removeSecretariatButtonFromTableViewGroupPage.click();
    await expect(groupPage.confirmationRemoveHeading).toBeVisible(); 
    await expect(groupPage.confirmationMessage).toBeVisible();
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
   
   test('Add same member different roles in BOR', { tag: '@smoke' }, async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    await groupActions.goto(manualData.url.administration);
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
    const WGrandomName = await groupActions.fillGroupNameFormWithRandomData('BOR');
    const randomData = await groupActions.fillGroupFormWithRandomData();

     //fill out roles
    await groupActions.selectPerson(
      groupPage.comboboxChair,
      manualData.searchWord.chairRole,
      manualData.selectRoleOption.chairRole
    );

    await groupActions.selectPerson(
      groupPage.comboboxViceChair,
      manualData.searchWord.chairRole,
      manualData.selectRoleOption.chairRole
    );

    await groupActions.saveGroup();
    await expect(groupPage.membersSameRoleError).toBeVisible();
    
   });

});