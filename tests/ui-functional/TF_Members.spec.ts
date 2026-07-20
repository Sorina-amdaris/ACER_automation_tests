import { test, expect } from '@playwright/test';
import { GroupPage } from '../pages/GroupPage';
import { GroupActions } from '../actions/GroupActions';
import manualData from '../../manual-test-data.json';



//RUN: npx playwright test tests/ui-functional/create-work-group-without-roles.spec.ts --headed   
//Test data without roles

// Use the authenticated state
test.use({ storageState: '.auth/user.json' });

test.describe('Edit Task Force members scenarios in TF details page', () => {
  let groupPage: GroupPage;
  let groupActions: GroupActions;
  
  test.beforeEach(async ({ page }) => {
    groupPage = new GroupPage(page);
    groupActions = new GroupActions(page);
  });

  // test.afterEach(async ({ context }) => {
  //   await context.close();
  // });

  test('Add Members in Task Force', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    await groupActions.goto(manualData.addMembersInTF_URL);
    await expect(groupPage.addMemberButton).toBeVisible();
    await groupPage.addMemberButton.click();
    await expect(groupPage.addMemberHeading).toBeVisible();
    //fill out the user in the combobox- chair
    await groupActions.selectPerson(
      groupPage.comboboxAddMember,
      manualData.searchWord.chairRole,
      manualData.selectRoleOption.chairRole
    );
    await groupPage.addMemberSaveButton.click();
    await expect(groupActions.verifySuccessMessage()).toBeVisible({ timeout: 5000 });
    
    //fill out the user in the combobox - vice-chair
    await expect(groupPage.addMemberButton).toBeVisible({ timeout: 10000 });
    await groupPage.addMemberButton.click();
    await expect(groupPage.addMemberHeading).toBeVisible();
    await groupActions.selectPerson(
      groupPage.comboboxAddMember,
      manualData.searchWord.viceChairRole,
      manualData.selectRoleOption.viceChairRole
    );
    await groupActions.selectRoleInAddMemberForm('Vice-Chair');


    //fill out the user in the combobox - secretariat
    await expect(groupPage.addMemberSecondbtn).toBeVisible({ timeout: 10000 });
    await groupPage.addMemberSecondbtn.click();
    await expect(groupPage.addMemberHeading).toBeVisible();
    await groupActions.selectPerson(
      groupPage.comboboxAddMember,
      manualData.searchWord.secretariatRole,
      manualData.selectRoleOption.secretariatRole
    );
    await groupActions.selectRoleInAddMemberForm('Secretariat');

    //fill out the user in the combobox - contractor
    await expect(groupPage.addMemberSecondbtn).toBeVisible({ timeout: 10000 });
    await groupPage.addMemberSecondbtn.click();
    await expect(groupPage.addMemberHeading).toBeVisible();
    await groupActions.selectPerson(
      groupPage.comboboxAddMember,
      manualData.searchWord.contractorRole,
      manualData.selectRoleOption.contractorRole
    );
    await groupActions.selectRoleInAddMemberForm('Contractor');
     

    //fill out the user in the combobox - convenor
    await expect(groupPage.addMemberSecondbtn).toBeVisible({ timeout: 10000 });
    await groupPage.addMemberSecondbtn.click();
    await expect(groupPage.addMemberHeading).toBeVisible();
    await groupActions.selectPerson(
      groupPage.comboboxAddMember,  
      manualData.searchWord.convenorRole,
      manualData.selectRoleOption.convenorRole
    );
    await groupActions.selectRoleInAddMemberForm('Convenor');

    //fill out the user in the combobox - observer
    await expect(groupPage.addMemberSecondbtn).toBeVisible({ timeout: 10000 });
    await groupPage.addMemberSecondbtn.click();
    await expect(groupPage.addMemberHeading).toBeVisible();
    await groupActions.selectPerson(
      groupPage.comboboxAddMember,
      manualData.searchWord.observerRole,
      manualData.selectRoleOption.observerRole
    );
    await groupActions.selectRoleInAddMemberForm('Observer');

    //fill out the user in the combobox - expert
    await expect(groupPage.addMemberSecondbtn).toBeVisible({ timeout: 10000 });
    await groupPage.addMemberSecondbtn.click();
    await expect(groupPage.addMemberHeading).toBeVisible();
    await groupActions.selectPerson(
      groupPage.comboboxAddMember,  
    manualData.searchWord.expertRole,
    manualData.selectRoleOption.expertRole
    );
    await groupActions.selectRoleInAddMemberForm('Expert');

    //fill out the user in the combobox - member
    await expect(groupPage.addMemberSecondbtn).toBeVisible({ timeout: 10000 });
    await groupPage.addMemberSecondbtn.click();
    await expect(groupPage.addMemberHeading).toBeVisible();
    await groupActions.selectPerson(    
    groupPage.comboboxAddMember,
    manualData.searchWord.memberRole,
    manualData.selectRoleOption.memberRole
    );
    await groupActions.selectRoleInAddMemberForm('Member');
    await expect(groupPage.addMemberSecondbtn).toBeVisible({ timeout: 10000 });
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
    await expect(groupPage.acerContactMemberinGroupPage).toHaveCount(3); //for secretariat and contractor  and convenor roles
    await expect(groupPage.membersSection).toBeVisible();
    await expect(groupPage.membersCheckboxes).toHaveCount(8);
  }).toPass({
    timeout: 60000,
    intervals: [5000],}); //for vice-chair, chair, secretariat, contractor, observer and member roles
   });  

   test('Edit and Remove Members in Task Force', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    await groupActions.goto(manualData.editAndRemoveMembersInTF_URL);
    await expect(groupPage.addMemberButton).toBeVisible();
    await groupPage.addMemberButton.click();
    await expect(groupPage.addMemberHeading).toBeVisible();
    //fill out the user in the combobox- chair
    await groupActions.selectPerson(
      groupPage.comboboxAddMember,
      manualData.searchWord.chairRole,
      manualData.selectRoleOption.chairRole
    );
    await groupPage.addMemberSaveButton.click();
    await expect(groupActions.verifySuccessMessage()).toBeVisible({ timeout: 5000 });
    
    //fill out the user in the combobox - vice-chair
    await expect(groupPage.addMemberButton).toBeVisible({ timeout: 10000 });
    await groupPage.addMemberButton.click();
    await expect(groupPage.addMemberHeading).toBeVisible();
    await groupActions.selectPerson(
      groupPage.comboboxAddMember,
      manualData.searchWord.viceChairRole,
      manualData.selectRoleOption.viceChairRole
    );
    await groupActions.selectRoleInAddMemberForm('Vice-Chair');

    //fill out the user in the combobox - secretariat
    await expect(groupPage.addMemberSecondbtn).toBeVisible({ timeout: 10000 });
    await groupPage.addMemberSecondbtn.click();
    await expect(groupPage.addMemberHeading).toBeVisible();
    await groupActions.selectPerson(
      groupPage.comboboxAddMember,
      manualData.searchWord.secretariatRole,
      manualData.selectRoleOption.secretariatRole
    );
    await groupActions.selectRoleInAddMemberForm('Secretariat');
    await expect(groupPage.addMemberSecondbtn).toBeVisible({ timeout: 10000 });
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
    //edit role is skipped as ther eis a bug
    // await groupPage.cardView.click();
    // await expect(groupPage.secretariatCard).toBeVisible();
    // await groupPage.secretariatCard.click();
    // await expect(groupPage.editFormMember).toBeVisible();
    //await groupPage.editFormMember.click();
  
    // await groupPage.dropdownRoleFieldForSecretariat.click();
    // await groupPage.memberOptionToSelectInEditMemberForm.click();
    // await groupPage.saveButton.click();
    
    //AFTER FIX -need to put successfull message n
    //AFTER FIX - to open again the form to check the change
    //await page.getByRole('button', { name: 'Close popup modal' }).click(); //AFter fix - will be closed automatically need to be removed

    await groupPage.tableView.click();
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
    await expect(groupPage.confirmationMessageLastRole).toBeVisible();
    await groupPage.removeButton.click();
    await expect(groupPage.notificationMemberHasBeenRemovedMessage).toBeVisible({ timeout: 30000 });
    
    //remove Last Secretariat role    
    await expect(groupPage.removeSecretariatButtonFromTableViewGrouPage).toBeVisible();
    await groupPage.removeSecretariatButtonFromTableViewGrouPage.click();
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
   
   test('Add same member different roles in Task Force', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    await groupActions.goto(manualData.url.administration);
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
      manualData.searchWord.chairRole,
      manualData.selectRoleOption.chairRole
    );

    await groupActions.saveGroup();
    await expect(groupPage.membersSameRoleError).toBeVisible();
    
   });

});