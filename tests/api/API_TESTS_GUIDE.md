# API Tests Guide (Playwright)

## What was implemented

The API test suite was split into dedicated files:

- `ACER_API_positive.spec.ts` - authenticated success-path and chained workflow tests
- `ACER_API_negative.spec.ts` - unauthorized checks and invalid-payload checks
- `helpers/apiAuth.ts` - shared auth/header/base URL logic

---

## File structure

```text
tests/api/
  ACER_API_positive.spec.ts
  ACER_API_negative.spec.ts
  helpers/
    apiAuth.ts
  API_TESTS_GUIDE.md
```

---

## Authentication model

Shared auth is handled in `helpers/apiAuth.ts`:

- `ACER_BEARER_TOKEN` (preferred)
- Optional audience filter: `ACER_API_AUDIENCE`
- Base URL: `ACER_API_BASE_URL`

---

## Test types

## 1) Positive tests (`ACER_API_positive.spec.ts`)

Includes success checks for multiple endpoints, for example:

- `CreateEntityRequest`
- `UpdateEntity`
- `ChangeGroupMemberRole`
- `AddGroupMember`
- `RemoveGroupMember`
- `ApproveEntityRequest`
- `AddEvent`
- `UpdateEvent`
- `DeleteEvent`
- `CreateUser`
- `UpdateUser`
- `DeleteUser`
- `DeleteEntity`

Also includes **chained workflows**:

- Create entity request -> read returned `id` -> approve using that `id`
- Create user -> read returned `id` -> update user -> delete user

These tests are guarded by a valid bearer token.

## 2) Negative tests (`ACER_API_negative.spec.ts`)

Covers:

- Unauthorized checks (no credentials): expects `401`/`403` (or `404` where applicable)
- Authenticated invalid payload checks: expects `>= 400`
- Unknown endpoint check: expects `404`

---

## Environment variables

Use project `.env` (template in `.env.example`):

- `ACER_API_BASE_URL`
- `ACER_BEARER_TOKEN`
- `ACER_API_AUDIENCE`

---

## Run options

From repository root:

- All API tests:
  - `npm run test:api`
- Positive only:
  - `npx playwright test tests/api/ACER_API_positive.spec.ts`
- Negative only:
  - `npx playwright test tests/api/ACER_API_negative.spec.ts`
- One test by title:
  - `npx playwright test tests/api/ACER_API_positive.spec.ts -g "CreateUser -> UpdateUser -> DeleteUser uses returned id"`

Report:

- `npm run report`

---

## Notes

- Positive tests may fail if seed IDs used by endpoints are not valid in the current environment.
- Chained tests reduce hardcoded dependencies by reusing returned IDs.
- Negative tests are expected to assert error statuses and should not be treated as failures when they receive expected error responses.
