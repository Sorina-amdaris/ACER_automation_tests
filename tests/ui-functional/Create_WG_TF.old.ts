import { test, expect } from '@playwright/test';

// Use the authenticated state
test.use({ storageState: '.auth/user.json' });

test.describe('Work Group Management - Create without roles', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the Work Groups page
    await page.goto('https://euacerdev.sharepoint.com/sites/ExtranetHub/sitepages/Administration.aspx');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
  });

  test('Create Work Group with roles ', async ({ page }) => {
    await page.getByRole('button', { name: 'Groups', exact: true }).click();
    await page.getByRole('button', { name: 'Create Group', exact: true }).click();
    await page.getByRole('heading', { name: 'Create Working Group' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Name is required.', { exact: true }).click();
    await page.getByText('Description is required.').click();
    await page.getByText('Code is required.').click();
    await page.getByText('Site Name is required.').click();
    await page.getByRole('textbox', { name: 'Name *', exact: true }).click();
    await page.getByRole('textbox', { name: 'Name *', exact: true }).fill('Test ');
    await page.getByRole('textbox', { name: 'Description *' }).click();
    await page.getByRole('textbox', { name: 'Description *' }).fill('test description');
    await page.getByRole('textbox', { name: 'Code *' }).click();
    await page.getByRole('textbox', { name: 'Code *' }).fill('fghjjk7654');
    await page.getByRole('textbox', { name: 'Site Name *' }).click();
    await page.getByRole('textbox', { name: 'Site Name *' }).fill('gfgfgj433');
    await page.locator('#combobox-id__2653').click();
    await page.locator('#combobox-id__2653').fill('sor');
    await page.getByRole('option', { name: 'SorAnnie SorFrami Eli.Upton@' }).click();
    await page.locator('#combobox-id__2656').click();
    await page.locator('#combobox-id__2656').fill('sor');
    await page.getByRole('option', { name: 'SorIsobel SorKautzer Talon47@' }).click();
    await page.locator('#combobox-id__2659').click();
    await page.locator('#combobox-id__2659').fill('sor');
    await page.getByRole('option', { name: 'SorCasandra SorLeffler Nash61' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByText('Working group request \'Test').click();
    await page.goto('https://euacerdev.sharepoint.com/sites/ExtranetHub/sitepages/Administration.aspx');
    await page.getByRole('columnheader').filter({ hasText: '' }).click();

    // test without roles

    await page.getByRole('button', { name: 'Create Group', exact: true }).click();
    await page.getByRole('textbox', { name: 'Name *', exact: true }).click();
    await page.getByRole('textbox', { name: 'Name *', exact: true }).fill('test withotu roles');
    await page.getByRole('textbox', { name: 'Description *' }).click();
    await page.getByRole('textbox', { name: 'Description *' }).fill('kjhgfd');
    await page.getByRole('textbox', { name: 'Code *' }).click();
    await page.getByRole('textbox', { name: 'Code *' }).fill('jhgfd734');
    await page.getByRole('textbox', { name: 'Site Name *' }).click();
    await page.getByRole('textbox', { name: 'Site Name *' }).fill('bvcxz');
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('heading', { name: 'Confirmation' }).click();
    await page.getByText('Are you sure you want to').click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.getByText('Working group request \'test').click();
    await page.goto('https://euacerdev.sharepoint.com/sites/ExtranetHub/sitepages/Administration.aspx');
    await page.getByRole('columnheader').filter({ hasText: '' }).click();
    await page.getByText('WG test in autom').click();
    await page.getByText('WG test in autom').click();

  });

 
});
