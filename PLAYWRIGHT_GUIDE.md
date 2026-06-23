# Playwright Test Framework Guide

## 🎯 Overview
Playwright is a modern web automation framework that allows you to write reliable end-to-end tests for web applications. It supports multiple browsers (Chrome, Firefox, Safari) and provides powerful tools for UI testing.

---

## 📁 Project Structure

```
ACER_automation_tests/
├── tests/                    # All test files go here
│   ├── ui-functional/       # Your UI functional tests
│   └── example.spec.ts      # Example test file
├── playwright.config.ts     # Main configuration file
├── package.json            # Project dependencies
└── PLAYWRIGHT_GUIDE.md     # This guide
```

---

## 🧪 Test File Anatomy

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('test description', async ({ page }) => {
  // Your test code here
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
```

**Key Components:**
- `test()` - Defines a test case
- `async` - All Playwright operations are asynchronous
- `{ page }` - Fixture that provides a browser page
- `await` - Wait for operations to complete

---

## 🔑 Core Concepts

### 1. **Page Object**
The `page` object represents a browser tab/page.

```typescript
await page.goto('https://yoursite.com');  // Navigate to URL
await page.click('button');                // Click element
await page.fill('input', 'text');          // Fill input field
await page.screenshot();                   // Take screenshot
```

### 2. **Locators** - Finding Elements
Playwright uses modern, reliable locators:

```typescript
// By role (RECOMMENDED - most reliable)
await page.getByRole('button', { name: 'Login' })
await page.getByRole('textbox', { name: 'Username' })

// By text
await page.getByText('Welcome')

// By label
await page.getByLabel('Email address')

// By placeholder
await page.getByPlaceholder('Enter your email')

// By test ID (for custom data-testid attributes)
await page.getByTestId('submit-button')

// CSS selector (fallback)
await page.locator('.my-class')
```

### 3. **Assertions** - Verifying Results
Use `expect()` to verify outcomes:

```typescript
// Page assertions
await expect(page).toHaveTitle(/My App/);
await expect(page).toHaveURL(/dashboard/);

// Element assertions
await expect(page.getByRole('heading')).toBeVisible();
await expect(page.getByRole('button')).toBeEnabled();
await expect(page.getByText('Success')).toContainText('Success');
```

---

## 🛠️ Common Test Patterns

### Login Test Example
```typescript
test('user can login', async ({ page }) => {
  // Navigate to login page
  await page.goto('https://yourapp.com/login');
  
  // Fill login form
  await page.getByLabel('Username').fill('testuser');
  await page.getByLabel('Password').fill('password123');
  
  // Submit
  await page.getByRole('button', { name: 'Login' }).click();
  
  // Verify success
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

### Form Submission Test
```typescript
test('create new item', async ({ page }) => {
  await page.goto('https://yourapp.com/items/new');
  
  // Fill form fields
  await page.getByLabel('Title').fill('New Item');
  await page.getByLabel('Description').fill('Item description');
  await page.getByRole('combobox', { name: 'Category' }).selectOption('electronics');
  await page.getByRole('checkbox', { name: 'Featured' }).check();
  
  // Submit and verify
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Item created successfully')).toBeVisible();
});
```

### Navigation Test
```typescript
test('navigate through menu', async ({ page }) => {
  await page.goto('https://yourapp.com');
  
  // Click menu item
  await page.getByRole('link', { name: 'Products' }).click();
  await expect(page).toHaveURL(/products/);
  
  // Verify page content
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
});
```

---

## ⚙️ Configuration (playwright.config.ts)

### Key Settings

```typescript
export default defineConfig({
  testDir: './tests',           // Where tests are located
  fullyParallel: true,          // Run tests in parallel
  retries: 2,                   // Retry failed tests 2 times
  workers: 4,                   // Number of parallel workers
  reporter: 'html',             // Test report format
  
  use: {
    baseURL: 'https://yourapp.com',  // Default URL
    screenshot: 'only-on-failure',   // Take screenshots on failure
    video: 'retain-on-failure',      // Record video on failure
    trace: 'on-first-retry',         // Debugging trace
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

**Recommended Changes for Your Project:**
1. Set `baseURL` to your application URL
2. Enable screenshots: `screenshot: 'only-on-failure'`
3. Enable video: `video: 'retain-on-failure'`

---

## 🚀 Running Tests

### Commands

```powershell
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/ui-functional/login.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode (step through)
npx playwright test --debug

# Run tests in specific browser
npx playwright test --project=chromium

# Run tests matching a pattern
npx playwright test login

# View test report
npx playwright show-report

# Run the authetication test only then run other tests and will use the session
npx playwright test auth.setup.ts --headed
```

---

## 🎨 Best Practices

### 1. **Use Descriptive Test Names**
```typescript
// ❌ Bad
test('test1', async ({ page }) => { });

// ✅ Good
test('user can login with valid credentials', async ({ page }) => { });
```

### 2. **Use Proper Locators**
```typescript
// ❌ Avoid (brittle)
await page.click('#submit');

// ✅ Prefer (reliable)
await page.getByRole('button', { name: 'Submit' }).click();
```

### 3. **Group Related Tests**
```typescript
test.describe('Login functionality', () => {
  test('successful login', async ({ page }) => { });
  test('failed login with wrong password', async ({ page }) => { });
  test('failed login with empty fields', async ({ page }) => { });
});
```

### 4. **Use beforeEach for Setup**
```typescript
test.beforeEach(async ({ page }) => {
  // Run before each test
  await page.goto('https://yourapp.com');
});

test('test 1', async ({ page }) => {
  // page is already on yourapp.com
});
```

### 5. **Add Waits When Needed**
```typescript
// Wait for element to appear
await page.waitForSelector('.loading-spinner', { state: 'hidden' });

// Wait for navigation
await page.waitForURL('**/dashboard');

// Wait for API response
await page.waitForResponse('**/api/users');
```

---

## 🐛 Debugging

### 1. **Run in Headed Mode**
```powershell
npx playwright test --headed
```

### 2. **Use Debug Mode**
```powershell
npx playwright test --debug
```

### 3. **Add Pauses in Tests**
```typescript
await page.pause();  // Stops execution, opens inspector
```

### 4. **View Traces**
When a test fails, Playwright creates traces. View them:
```powershell
npx playwright show-report
```

### 5. **Screenshots**
```typescript
await page.screenshot({ path: 'screenshot.png' });
```

---

## 📋 Creating Tests from Azure Test Cases

### Workflow

1. **Export test case from Azure** (paste steps here)
2. **I'll convert to Playwright code**
3. **Clarify any unclear steps**
4. **Generate test file in ui-functional/**

### Example Conversion

**Azure Test Case:**
```
Step 1: Navigate to login page
Expected: Login form visible

Step 2: Enter username "admin" and password "pass123"
Expected: Fields populated

Step 3: Click Login button
Expected: Redirected to dashboard
```

**Playwright Test:**
```typescript
test('user login', async ({ page }) => {
  // Step 1
  await page.goto('/login');
  await expect(page.getByRole('form')).toBeVisible();
  
  // Step 2
  await page.getByLabel('Username').fill('admin');
  await page.getByLabel('Password').fill('pass123');
  
  // Step 3
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/dashboard/);
});
```

---

## 📚 Useful Resources

- **Official Docs:** https://playwright.dev/docs/intro
- **API Reference:** https://playwright.dev/docs/api/class-playwright
- **Locators Guide:** https://playwright.dev/docs/locators
- **Best Practices:** https://playwright.dev/docs/best-practices

---

## 🎯 Next Steps for Your Project

1. **Configure baseURL** in [playwright.config.ts](playwright.config.ts)
2. **Paste your Azure test cases** - I'll convert them to Playwright tests
3. **Add test data** configuration if needed
4. **Set up CI/CD integration** (Azure Pipelines, GitHub Actions)

---

**Ready to create your first automated test?** Just paste your test case details, and I'll generate the Playwright code! 🚀
