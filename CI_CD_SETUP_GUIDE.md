# CI/CD Setup Guide for Playwright Tests

## 📁 Project Structure

```
ACER_automation_tests/
├── .github/
│   └── workflows/
│       └── playwright.yml            # Single CI pipeline (all features)
├── tests/
│   ├── auth.setup.ts                # Authentication setup
│   ├── ui-functional/               # Functional tests
│   │   ├── Create_TF.spec.ts
│   │   ├── Create_WG.spec.ts
│   │   └── Edit_WG_TF.spec.ts
│   ├── pages/                       # Page Object Models
│   │   └── GroupPage.ts
│   ├── actions/                     # Test actions/helpers
│   │   └── GroupActions.ts
│   └── utils/                       # Utilities
│       ├── testData.ts
│       └── testDataGenerator.ts
├── test-results/                    # Test execution results (gitignored)
├── playwright-report/               # HTML reports (gitignored)
├── .auth/                           # Auth state files (gitignored)
├── playwright.config.ts             # Playwright configuration
├── package.json                     # Dependencies and scripts
└── tsconfig.json                    # TypeScript configuration
```

---

## 🔐 GitHub Secrets Configuration

### Required Secrets

Add these secrets in your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Description | Example |
|------------|-------------|---------|
| `BASE_URL` | Application base URL (optional) | `https://euacerdev.sharepoint.com/sites/ExtranetHub` |
| `TEST_USER_EMAIL` | Test user email | `test.user@company.com` |
| `TEST_USER_PASSWORD` | Test user password | `SecureP@ssw0rd!` |

> **Note:** BASE_URL is optional - it will fallback to the URL in playwright.config.ts if not set

---

## 🚀 Single Workflow File

### `playwright.yml` - All-in-One Pipeline

**Triggers:**
- ✅ Push to `main` or `master` branch
- ✅ Pull requests to `main` or `master`
- ✅ Manual workflow dispatch (with browser selection)

**Features:**
- ✅ Multi-browser testing (chromium, firefox, webkit)
- ✅ Matrix strategy for parallel execution
- ✅ Automatic retries (2x on CI - configured in playwright.config.ts)
- ✅ Smart artifact uploads (reports, videos, screenshots, traces)
- ✅ npm caching for faster builds
- ✅ Browser-specific installations (install only what you need)
- ✅ Environment variable support via GitHub Secrets

**Usage:**

**Automatic trigger:**
```bash
git push origin main
```

**Manual trigger via GitHub UI:**
1. Go to **Actions** tab
2. Select **Playwright Tests**
3. Click **Run workflow**
4. Choose browser:
   - `chromium` (default, fastest)
   - `firefox`
   - `webkit`
   - `all` (runs all three browsers)
5. Click **Run workflow**

**Manual trigger via GitHub CLI:**
```bash
# Run on chromium (default)
gh workflow run playwright.yml

# Run on specific browser
gh workflow run playwright.yml -f browser=firefox

# Run on all browsers
gh workflow run playwright.yml -f browser=all
```

---

## 🛠️ Playwright Config Changes

### Key Improvements Made:

```typescript
// Multiple reporters for CI
reporter: process.env.CI 
  ? [
      ['html', { outputFolder: 'playwright-report', open: 'never' }],
      ['json', { outputFile: 'test-results/results.json' }],
      ['junit', { outputFile: 'test-results/junit.xml' }],
      ['github'], // Annotates GitHub PR with test results
    ]
  : 'html',

// Environment-based base URL
baseURL: process.env.BASE_URL || 'https://euacerdev.sharepoint.com/sites/ExtranetHub',

// Enhanced trace collection on CI
trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',

// CI-optimized video recording
video: process.env.CI ? 'retain-on-failure' : 'on-first-retry',

// Added timeouts
actionTimeout: 15 * 1000,
navigationTimeout: 30 * 1000,
```

---

## 📋 CI/CD Best Practices for QA Automation

### 1. **Test Execution Strategy**

```yaml
✅ DO:
- Run chromium tests on every PR (fast feedback)
- Run all browsers manually when needed
- Implement retry logic for flaky tests (max 2 retries)
- Use meaningful test names and descriptions

❌ DON'T:
- Run all browsers on every commit (slow)
- Ignore flaky tests (fix or mark them)
- Hardcode test data
```

### 2. **Artifact Management**

```yaml
✅ Retention Policy:
- HTML reports: 30 days (always uploaded)
- Test results: 30 days (always uploaded)
- Failure artifacts (videos/traces): 15 days (only on failure)

✅ Upload Strategy:
- Always upload HTML reports (for debugging)
- Upload test results (JSON/JUnit for analysis)
- Upload screenshots/videos/traces only on failure
```

### 3. **Performance Optimization**

```typescript
// Use CI caching
- uses: actions/setup-node@v4
  with:
    cache: 'npm'  // Cache npm dependencies

// Install only needed browsers
npx playwright install --with-deps chromium  // Not all browsers

// Matrix strategy runs browsers in parallel
matrix:
  browser: [chromium, firefox, webkit]
```

### 4. **Security Best Practices**

```yaml
✅ DO:
- Store credentials in GitHub Secrets (never in code)
- Use .env.example as template
- Add .env to .gitignore
- Rotate secrets regularly

❌ DON'T:
- Commit .env files
- Hardcode passwords or API keys
- Log sensitive information
```

### 5. **Test Stability**

```typescript
// Implement proper waits
await expect(page.locator('.element')).toBeVisible({ timeout: 15000 });

// Retry logic configured in playwright.config.ts
retries: process.env.CI ? 2 : 0,

// Add test timeouts
test.setTimeout(60 * 1000);

// Use proper test isolation
test.afterEach(async ({ context }) => {
  await context.close();
});
```

### 6. **Reporting & Monitoring**

```yaml
✅ Reports Generated on CI:
- HTML report (visual analysis)
- JUnit XML (CI integration)
- JSON (custom dashboards)
- GitHub annotations (PR feedback)

✅ Monitor:
- Test execution time trends
- Flaky test rates
- Browser-specific failures
```

### 7. **Branch Strategy**

```yaml
main/master branch:
  - Run chromium tests automatically
  - Can manually trigger all browsers
  - Block merge if tests fail

Pull requests:
  - Run chromium tests (fast feedback <10 min)
  - Manual all-browser run before merge
```

---

## 🎯 NPM Scripts

Updated `package.json` with helpful scripts:

```bash
# Run all tests
npm test

# Run tests with UI mode
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Debug tests
npm run test:debug

# View last report
npm run report

# Record new tests
npm run codegen
```

---

## 🔄 CI Workflow

### Pull Request Flow:
```
1. Developer creates PR
2. CI triggers playwright.yml
3. Tests run on chromium (fast)
4. Results annotated on PR
5. Artifacts uploaded for review
6. PR blocked if tests fail
```

### Main Branch Flow:
```
1. Code merged to main/master
2. Tests run on chromium
3. Artifacts retained for 30 days
4. Team can review reports
```

### Manual All-Browser Flow:
```
1. Go to Actions → Run workflow
2. Select "all" browsers
3. All 3 browsers run in parallel
4. Full coverage reports generated
```

---

## 📊 Viewing Test Results

### 1. GitHub Actions UI:
- Go to **Actions** tab
- Select workflow run
- Click on job (e.g., "Test - chromium")
- View logs and download artifacts

### 2. Download Artifacts:
```bash
# Using GitHub CLI
gh run list --workflow=playwright.yml
gh run download <run-id>

# Then view locally
npx playwright show-report playwright-report/
```

### 3. View Traces:
```bash
# Download trace.zip from artifacts
npx playwright show-trace path/to/trace.zip
```

---

## 🐛 Debugging Failed Tests

### From CI Artifacts:

1. **HTML Report** - Overview of all tests
2. **Screenshots** - Visual state at failure
3. **Videos** - Full test execution recording
4. **Traces** - Interactive debugging with Trace Viewer

### Analyze Traces:
```bash
# Download failure-artifacts from GitHub Actions
npx playwright show-trace test-results/**/trace.zip
```

---

## 📝 Additional Recommendations

### 1. `.gitignore` entries:
```gitignore
/test-results/
/playwright-report/
/.auth/
.env
.env.local
```

### 2. Environment template (`.env.example`):
```bash
BASE_URL=https://euacerdev.sharepoint.com/sites/ExtranetHub
TEST_USER_EMAIL=
TEST_USER_PASSWORD=
```

### 3. Add test tags for selective execution:
```typescript
test('Create Work Group @smoke @critical', async ({ page }) => {
  // Test implementation
});

// Run only smoke tests
npx playwright test --grep @smoke
```

---

## ✅ Production Checklist

- [ ] GitHub Secrets configured (TEST_USER_EMAIL, TEST_USER_PASSWORD)
- [ ] `.gitignore` updated
- [ ] `playwright.yml` workflow added
- [ ] Playwright config updated
- [ ] NPM scripts added
- [ ] Test stability verified locally
- [ ] Branch protection rules set (optional)
- [ ] Team trained on CI/CD process
- [ ] `.env.example` created

---

## 🆘 Troubleshooting

### Tests fail on CI but pass locally:
- Check if secrets are configured in GitHub
- Verify browser versions match
- Review CI logs for errors
- Check timeout configurations

### Artifacts not uploading:
- Verify tests actually ran
- Check artifact paths in workflow
- Ensure GitHub has storage available

### Slow test execution:
- Run only chromium on PR (not all browsers)
- Use manual trigger for full browser coverage
- Optimize test data generation
- Check for unnecessary waits

### Secret warnings in workflow file:
- Normal when editing locally
- Warnings disappear once secrets are added in GitHub
- Not actual errors

---

**Questions? Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for common commands.**
