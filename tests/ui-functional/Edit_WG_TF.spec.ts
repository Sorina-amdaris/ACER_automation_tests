import { test, expect } from '@playwright/test';
import { GroupPage } from '../pages/GroupPage';
import { GroupActions } from '../actions/GroupActions';
import manualData from '../../manual-test-data.json';
import { time } from 'node:console';

//RUN: npx playwright test tests/ui-functional/create-work-group-without-roles.spec.ts --headed   
//Test data without roles

// Use the authenticated state
test.use({ storageState: '.auth/user.json' });

test.describe('Edit Work Group and Task Force', () => {
  let groupPage: GroupPage;
  let groupActions: GroupActions;
  
  test.beforeEach(async ({ page }) => {
    groupPage = new GroupPage(page);
    groupActions = new GroupActions(page);
    await groupActions.goto();
  });

  // test.afterEach(async ({ context }) => {
  //   await context.close();
  // });

  test('Edit WG form', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Open groups section and create group
    await expect(groupPage.groupsButton).toBeVisible();
     
    await groupActions.goToCertainGroup(manualData.workGroup);

    //click on pensil icon to edit WG
    await groupPage.editWorkingGroupButton.click();

     // Verify form heading
    await expect(groupPage.editWorkingGroupHeading).toBeVisible();
    await groupActions.fillEditGroupForm({
      name: manualData.editName,
      description: manualData.editDescription
    }
  );
    //fill out roles
    await groupPage.comboboxChair.click();
    await groupPage.comboboxChair.fill(manualData.searchWord.chairRole);
    await page.getByRole('option', { name: manualData.selectRoleOption.chairRole }).click();
   
    await groupPage.comboboxViceChair.click();
    await groupPage.comboboxViceChair.fill(manualData.searchWord.viceChairRole);
    await page.getByRole('option', { name: manualData.selectRoleOption.viceChairRole }).click();

    await groupPage.comboboxSecretariat.click();
    await groupPage.comboboxSecretariat.fill(manualData.searchWord.secretariatRole);
    await page.getByRole('option', { name: manualData.selectRoleOption.secretariatRole }).click();


    //save the form and verify success message
    await groupActions.saveGroup();
    await expect(groupActions.verifySuccessMessage(manualData.workGroup)).toBeVisible({ timeout: 5000 }); 

   // Retry mechanism to check for the work group in the list
    await expect(async () => {
    await page.reload();
    
    await groupPage.searchBoxAdministrationPage.fill(manualData.editName);
    await groupPage.searchBoxAdministrationPage.press('Enter');

    await expect(
    groupActions.verifyGroupInList(manualData.editName)
    ).toBeVisible();
    }).toPass({
    timeout: 60000,   // total retry time as 1 minute
    intervals: [10000] // retry every 10s
  }); 

 //then click on it and remove the roles and save back the previous data for WG and check confirmation pop-up
    //click on pensil icon to edit WG
    await groupPage.editWorkingGroupButton.click();

     // Verify form heading
    await expect(groupPage.editWorkingGroupHeading).toBeVisible();

    await groupActions.fillEditGroupForm({
      name: manualData.workGroup,
      description: manualData.description
    });
   
    await groupActions.removeRolesinEditForm();
     // Save and handle confirmation
    await groupActions.saveGroup();
    await expect(groupPage.confirmationHeading).toBeVisible();
    await expect(groupPage.confirmationMessage).toBeVisible();
    await groupActions.confirmCreation();

    await expect(groupActions.verifySuccessMessage(manualData.editName)).toBeVisible(); //shows the previous name
    
    
   // Retry mechanism to check for the work group in the list
    await expect(async () => {
    await page.reload();
    
    await groupPage.searchBoxAdministrationPage.fill(manualData.editName);
    await groupPage.searchBoxAdministrationPage.press('Enter');

    await expect(
    groupActions.verifyGroupInList(manualData.editName)
    ).toBeVisible();
    }).toPass({
    timeout: 60000,   // total retry time as 1 minute
    intervals: [10000] // retry every 10s
  }); 
    
 //**********   steps to check the fields edited?
    

   });  

test('Edit TF form', async ({ page }) => {
    test.setTimeout(10 * 60 * 1000); // 10 minutes
    // Open groups section
    await expect(groupPage.groupsButton).toBeVisible();
     
    await groupActions.goToCertainGroup(manualData.taskForce);

    //click on pensil icon to edit TF
    await groupPage.editTaskForceButton.click();

     // Verify form heading
    await expect(groupPage.editTaskForceHeading).toBeVisible();
    await groupActions.fillEditGroupForm({
      name: manualData.editName,
      description: manualData.editDescription
    }
  );
    //fill out roles
    await groupPage.comboboxChair.click();
    await groupPage.comboboxChair.fill(manualData.searchWord.chairRole);
    await page.getByRole('option', { name: manualData.selectRoleOption.chairRole }).click();
   
    await groupPage.comboboxViceChair.click();
    await groupPage.comboboxViceChair.fill(manualData.searchWord.viceChairRole);
    await page.getByRole('option', { name: manualData.selectRoleOption.viceChairRole }).click();

    await groupPage.comboboxSecretariat.click();
    await groupPage.comboboxSecretariat.fill(manualData.searchWord.secretariatRole);
    await page.getByRole('option', { name: manualData.selectRoleOption.secretariatRole }).click();


    //save the form and verify success message
    await groupActions.saveGroup();
    await expect(groupActions.verifySuccessMessage(manualData.taskForce)).toBeVisible({ timeout: 5000 }); //previous name of TF

   // Retry mechanism to check for the work group in the list
    await expect(async () => {
    await page.reload();
    
    await groupPage.searchBoxAdministrationPage.fill(manualData.editName);
    await groupPage.searchBoxAdministrationPage.press('Enter');

    await expect(
    groupActions.verifyGroupInList(manualData.editName)
    ).toBeVisible();
    }).toPass({
    timeout: 60000,   // total retry time as 1 minute
    intervals: [10000] // retry every 10s
  }); 

 //then click on it and remove the roles and save back the previous data for WG and check confirmation pop-up
    //click on pensil icon to edit WG
    await groupPage.editTaskForceButton.click();

     // Verify form heading
    await expect(groupPage.editTaskForceHeading).toBeVisible();

    await groupActions.fillEditGroupForm({
      name: manualData.taskForce,
      description: manualData.description
    });
   
    await groupActions.removeRolesinEditForm();
     // Save and handle confirmation
    await groupActions.saveGroup();
    await expect(groupPage.confirmationHeading).toBeVisible();
    await expect(groupPage.confirmationMessage).toBeVisible();
    await groupActions.confirmCreation();

    await expect(groupActions.verifySuccessMessage(manualData.editName)).toBeVisible(); //shows the previous name
    
    
   // Retry mechanism to check for the work group in the list
    await expect(async () => {
    await page.reload();
    
    await groupPage.searchBoxAdministrationPage.fill(manualData.taskForce);
    await groupPage.searchBoxAdministrationPage.press('Enter');

    await expect(
    groupActions.verifyGroupInList(manualData.taskForce)
    ).toBeVisible();
    }).toPass({
    timeout: 60000,   // total retry time as 1 minute
    intervals: [10000] // retry every 10s
  }); 
    
 //**********   steps to check the fields edited?
    

   });  

   });
