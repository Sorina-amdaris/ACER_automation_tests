# Quick Reference: CI/CD Commands

## 🚀 Local Testing
```bash
# Run all tests
npm test

# Run specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Debug mode
npm run test:debug

# UI mode (interactive)
npm run test:ui

# Headed mode (see browser)
npm run test:headed

# View last report
npm run report

# Generate test code
npm run codegen
```

---

## 🎯 CI Environment Simulation

```bash
# Run with CI settings (retries, traces, etc.)
CI=true npm test

# Run specific browser in CI mode
CI=true npx playwright test --project=chromium

# Run with all CI reporters
CI=true npm test
```

---

## ⚡ Manual Workflow Triggers

### Via GitHub UI:
1. Go to repository → **Actions** tab
2. Select **Playwright Tests** workflow
3. Click **Run workflow** button
4. Choose browser:
   - `chromium` - Fast, recommended for quick checks
   - `firefox` - Firefox testing
   - `webkit` - Safari/WebKit testing
   - `all` - Run all three browsers in parallel
5. Click **Run workflow**

### Via GitHub CLI:
```bash
# Run with default browser (chromium)
gh workflow run playwright.yml

# Run specific browser
gh workflow run playwright.yml -f browser=chromium
gh workflow run playwright.yml -f browser=firefox
gh workflow run playwright.yml -f browser=webkit

# Run all browsers
gh workflow run playwright.yml -f browser=all
```

---

## 📊 Viewing Test Results

### List recent workflow runs:
```bash
gh run list --workflow=playwright.yml --limit 10
```

### View specific run:
```bash
gh run view <run-id>
```

### Download all artifacts:
```bash
# Download from latest run
gh run download

# Download from specific run
gh run download <run-id>
```

### Download specific artifact:
```bash
gh run download <run-id> -n playwright-report-chromium-1
```

### View downloaded report:
```bash
npx playwright show-report playwright-report/
```

### View trace file:
```bash
npx playwright show-trace path/to/trace.zip
```

---

## 🔐 GitHub Secrets Management

### Add/Update secrets:
```bash
gh secret set BASE_URL
# Then paste value when prompted

# Or provide inline
gh secret set TEST_USER_EMAIL --body "user@example.com"
gh secret set TEST_USER_PASSWORD --body "password123"
```

### List all secrets:
```bash
gh secret list
```

### Delete a secret:
```bash
gh secret delete SECRET_NAME
```

---

## 🏷️ Test Tags Usage

### Add tags to tests:
```typescript
test('Create Work Group @smoke', async ({ page }) => {
  // Test code
});

test('Edit permissions @critical @smoke', async ({ page }) => {
  // Test code
});
```

### Run tests by tag:
```bash
# Run only smoke tests
npx playwright test --grep @smoke

# Run critical tests
npx playwright test --grep @critical

# Multiple tags (OR)
npx playwright test --grep "@smoke|@critical"

# Exclude tests
npx playwright test --grep-invert @slow
```

---

## 🔧 Common Test Commands

### Run specific test file:
```bash
npx playwright test tests/ui-functional/Create_WG.spec.ts
```

### Run specific test by name:
```bash
npx playwright test -g "Create Work Group"
```

### Run in headed mode (see browser):
```bash
npx playwright test --headed
```

### Run with specific workers:
```bash
npx playwright test --workers=2
```

### Update snapshots:
```bash
npx playwright test --update-snapshots
```

### Generate test:
```bash
npx playwright codegen https://your-app.com
```

---

## 🐛 Debugging

### Run in debug mode:
```bash
npx playwright test --debug
```

### Debug specific test:
```bash
npx playwright test --debug tests/ui-functional/Create_WG.spec.ts
```

### Show trace viewer:
```bash
npx playwright show-trace trace.zip
```

### Show last HTML report:
```bash
npx playwright show-report
```

---

## 📈 Performance & Optimization

### Check which tests will run:
```bash
npx playwright test --list
```

### Run in parallel with custom workers:
```bash
npx playwright test --workers=4
```

### Run only failed tests:
```bash
npx playwright test --last-failed
```

### Limit failures:
```bash
npx playwright test --max-failures=5
```

---

## 🔍 Common Troubleshooting

### Tests timeout on CI:
```typescript
// In test file
test.setTimeout(120000); // 2 minutes

// Or in playwright.config.ts
timeout: 120 * 1000
```

### Clear test cache:
```bash
npx playwright install --force
```

### Reinstall browsers:
```bash
npx playwright install --with-deps
```

### Check Playwright version:
```bash
npx playwright --version
```

### Validate config:
```bash
npx playwright test --list
```

---

## 📦 Artifact Information

### Uploaded on every run:
- `playwright-report-{browser}-{attempt}` - HTML test report (30 days)
- `test-results-{browser}-{attempt}` - Raw test results (30 days)

### Uploaded only on failure:
- `failure-artifacts-{browser}-{attempt}` - Videos, screenshots, traces (15 days)

---

## ⚙️ Environment Variables

### Local testing with environment:
```bash
# Create .env file (copy from .env.example)
BASE_URL=https://your-url.com
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password

# Then run tests
npm test
```

### Override for single run:
```bash
# Windows PowerShell
$env:BASE_URL="https://custom-url.com"; npm test

# Linux/Mac
BASE_URL="https://custom-url.com" npm test
```

---

## ✅ Pre-Commit Checklist

Before pushing code:
- [ ] Tests pass locally: `npm test`
- [ ] No `test.only` or `test.skip` in code
- [ ] Secrets not hardcoded
- [ ] `.env` not committed
- [ ] New tests added for new features
- [ ] Flaky tests fixed or marked

---

## 📚 Useful Links

- **View workflow runs**: Repository → Actions tab
- **Playwright docs**: https://playwright.dev
- **GitHub CLI docs**: https://cli.github.com
- **Test report**: Actions → Select run → Download artifacts

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Tests fail on CI but pass locally | Check GitHub Secrets are set |
| Slow test execution | Use `--workers=1` or reduce parallel tests |
| Artifacts not found | Check workflow completed and paths are correct |
| Browser not found | Run `npx playwright install --with-deps` |
| Flaky tests | Add retries or improve wait conditions |
| Secrets not working | Verify secret names match exactly |

---

**Need more details? See [CI_CD_SETUP_GUIDE.md](CI_CD_SETUP_GUIDE.md)**
