import { test as setup, expect } from '@playwright/test';

//RUN: npx playwright test tests/auth.setup.ts --headed

const authFile = '.auth/user.json';

setup('authenticate with 2FA', async ({ page }) => {
  // Navigate to SharePoint login
  await page.goto('https://euacerdev.sharepoint.com/sites/ExtranetHub');
  
  // Fill in username
  await page.getByPlaceholder('Email, phone, or Skype').fill('sorina.cristian@euacerdev.onmicrosoft.com');
  await page.getByRole('button', { name: 'Next' }).click();
  
  // Fill in password
  await page.getByPlaceholder('Password').fill('Esiencey20@');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Handle 2FA - Wait for manual 2FA verification
  // Note: You may need to manually approve the 2FA request during test setup
  console.log('Please complete 2FA authentication...');
  
  // Wait for navigation to complete after 2FA (5 minutes)
  await page.waitForURL('**/ExtranetHub*', { timeout: 300000 });
  
  // Wait for page to be loaded (SharePoint has continuous background activity, so don't wait for networkidle)
  await page.waitForLoadState('load');
  
  // Save authentication state
  await page.context().storageState({ path: authFile });
});
