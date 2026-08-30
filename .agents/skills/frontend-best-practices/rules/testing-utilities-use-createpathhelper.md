---
title: Use Testing Utilities in Playwright E2E
impact: MEDIUM
impactDescription: Reduces flaky navigation/auth issues in CI
tags: playwright, e2e, nuxt, testing, ci
---

## Use Testing Utilities in Playwright E2E

**Impact: MEDIUM (consistent CI paths and predictable auth state)**

For Playwright E2E tests in `frontends/*`, prefer `@adra-network/testing-utilities` over hard-coded URLs and ad-hoc auth handling. It provides a `createPathHelper()` helper to generate the correct base path in CI and a Nuxt module to wire up the expected Playwright setup.

### Build URLs with `createPathHelper()` (CI-safe paths)

Use `createPathHelper('<frontend-name>')` when navigating with `goto()` so tests work both locally and in CI (where apps may be served under an extra base path).

**Incorrect (hard-coded base path):**

```typescript
// frontends/donation-page-receiver/tests/e2e/some-test.ts
import { test } from '@nuxt/test-utils/playwright'

test('navigates to index', async ({ page, goto }) => {
  // ❌ Breaks when CI adds a base path prefix
  await goto('/donation-page-receiver/')
})
```

**Correct (CI-safe base path via helper):**

```typescript
// frontends/donation-page-receiver/tests/e2e/some-test.ts
import { test } from '@nuxt/test-utils/playwright'
import { createPathHelper } from '@adra-network/testing-utilities'

const getPath = createPathHelper('donation-page-receiver')

test('navigates to index', async ({ page, goto }) => {
  await goto(getPath('/'), { waitUntil: 'domcontentloaded' })
})
```

### Handle auth state intentionally

`@adra-network/testing-utilities` authenticates tests by default via Playwright global setup. If a test needs to cover unauthenticated/public behavior, reset Playwright storage state at the top of the file.

**Incorrect (unauthenticated test but no storage reset):**

```typescript
import { test } from '@nuxt/test-utils/playwright'

test('shows public page without login', async ({ page, goto }) => {
  // ❌ Might still run as an authenticated user (default setup)
  await goto('/some-public-page', { waitUntil: 'domcontentloaded' })
})
```

**Correct (reset storage state for unauthenticated cases):**

```typescript
import { test } from '@nuxt/test-utils/playwright'
import { createPathHelper } from '@adra-network/testing-utilities'

const getPath = createPathHelper('donation-page-receiver')

// Unauthenticated/public scenario
test.use({ storageState: { cookies: [], origins: [] } })

test('shows public page without login', async ({ page, goto }) => {
  await goto(getPath('/some-public-page'), { waitUntil: 'domcontentloaded' })
})
```

