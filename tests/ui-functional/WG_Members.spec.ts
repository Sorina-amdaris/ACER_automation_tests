import { test, expect } from '@playwright/test';
import { GroupPage } from '../pages/GroupPage';
import { GroupActions } from '../actions/GroupActions';
import manualData from '../../manual-test-data.json';



//RUN: npx playwright test tests/ui-functional/create-work-group-without-roles.spec.ts --headed   
//Test data without roles

// Use the authenticated state
test.use({ storageState: '.auth/user.json' });

test.describe('Edit Work Group members scenarios in WG details page', () => {
  let groupPage: GroupPage;
  let groupActions: GroupActions;
  
  test.beforeEach(async ({ page }) => {
    groupPage = new GroupPage(page);
    groupActions = new GroupActions(page);
    //await groupActions.goto(manualData.workGroupUrl);

  });

  // test.afterEach(async ({ context }) => {
  //   await context.close();
  // });

  test('Add Members in Work Group', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    await groupActions.goto(manualData.workGroupUrl);
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
     

    // //fill out the user in the combobox - convenor
    // await expect(groupPage.addMemberSecondbtn).toBeVisible({ timeout: 10000 });
    // await groupPage.addMemberSecondbtn.click();
    // await expect(groupPage.addMemberHeading).toBeVisible();
    // await groupActions.selectPerson(
    //   groupPage.comboboxAddMember,  
    //   manualData.searchWord.convenorRole,
    //   manualData.selectRoleOption.convenorRole
    // );
    // await groupActions.selectRoleInAddMemberForm('Convenor');

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

    // //fill out the user in the combobox - expert
    // await expect(groupPage.addMemberSecondbtn).toBeVisible({ timeout: 10000 });
    // await groupPage.addMemberSecondbtn.click();
    // await expect(groupPage.addMemberHeading).toBeVisible();
    // await groupActions.selectPerson(
    //   groupPage.comboboxAddMember,  
    // manualData.searchWord.expertRole,
    // manualData.selectRoleOption.expertRole
    // );
    // await groupActions.selectRoleInAddMemberForm('Expert');

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

    //check Key People section
    await expect(groupPage.keyPeopleSection).toBeVisible();
    await expect(groupPage.viceChairMemberinGroupPage).toHaveCount(1); //for vice-chair and contractor roles
    await expect(groupPage.chairMemberinGroupPage).toHaveCount(1);
    await page.mouse.wheel(0, 1000); //scroll down to see the members section
    
    // Check if acerContactMemberinGroupPage count is 2, if not refresh and retry
    let acerContactCount = await groupPage.acerContactMemberinGroupPage.count();
    if (acerContactCount !== 2) {
      await page.reload({ timeout: 6000 });
      await page.mouse.wheel(0, 1000); //scroll down to see the members section
    }
    await expect(groupPage.acerContactMemberinGroupPage).toHaveCount(2); //for secretariat and contractor roles
    
    await expect(groupPage.membersSection).toBeVisible();
    
    await expect(async () => {
    await page.reload({ timeout: 6000 });
    await page.mouse.wheel(0, 1000);
    await expect(groupPage.membersCheckboxes).toHaveCount(6);
  }).toPass({
    timeout: 60000,
    intervals: [5000],}); //for vice-chair, chair, secretariat, contractor, observer and member roles
   });  

   test('Edit and Remove Members in Work Group', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    await groupActions.goto(manualData.workGroupUrlRemoveMembers);
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
  }).toPass({
    timeout: 60000,
    intervals: [5000],}); 

    await page.reload({ timeout: 6000 });
    await expect(async () => {
    await page.reload({ timeout: 6000 });
    await expect(groupPage.keyPeopleSection).toBeVisible();
    await expect(groupPage.viceChairMemberinGroupPage).toHaveCount(1);
  }).toPass({
    timeout: 60000,
    intervals: [5000],});

    await page.reload({ timeout: 6000 });
    await expect(async () => {
    await page.reload({ timeout: 6000 });
    await expect(groupPage.keyPeopleSection).toBeVisible();
    await expect(groupPage.acerContactMemberinGroupPage).toHaveCount(1);
  }).toPass({
    timeout: 60000,
    intervals: [5000],});

    await expect(groupPage.membersSection).toBeVisible();
    await groupPage.cardView.click();
    await expect(groupPage.secretariatCard).toBeVisible();
    await groupPage.secretariatCard.click();
    await expect(groupPage.editFormMember).toBeVisible();
    await groupPage.editFormMember.click();
    //these make as locators *****
    // await page.getByLabel('Overview').getByText('Secretariat', { exact: true }).click();
    // await page.getByRole('option', { name: 'Member' }).click();
    // await groupPage.saveButton.click();
    //********* */
    //need to put successfull message whenit will be fixed in the application
    //and to open again the form to check the change after fix


    await page.getByRole('button', { name: 'Remove' }).click();
    await page.getByText('Are you sure you want to').click();
    await page.getByRole('button', { name: 'Remove' }).click();
    await page.getByRole('button', { name: 'Close popup modal' }).click();
   //other to remove and check the confirmation message
    
   });  

});