---
title: ADRA Network Tooling Packages When to Use
impact: LOW
impactDescription: Shared tooling choices improve consistency and reduce duplicated utility code
tags: tooling, testing, rbac, i18n, adra-network
---

## ADRA Network Tooling Packages When to Use

**Impact: LOW (misuse mainly causes inconsistency and duplicated helpers)**

Use ADRA helper and tooling packages for shared capabilities in permissions, i18n assets, testing, and formatting. Keep them in the correct scope (runtime deps vs dev tooling), and avoid recreating logic already provided by ADRA packages. For Playwright path helpers and Nuxt testing module setup with `@adra-network/testing-utilities`, see [`testing-utilities-use-createpathhelper.md`](testing-utilities-use-createpathhelper.md).

**Incorrect (copying permission logic in app code):**

```typescript
// hand-written permission checks duplicated across files
const canEdit = user.roles.includes('admin') || user.permissions.includes('edit:donors')
```

**Correct (use shared helper package):**

```typescript
import { hasPermission } from '@adra-network/roles-permissions-helper'

const canEdit = hasPermission(user, 'edit:donors')
```

### Package mapping

| Package | When to use |
|---------|-------------|
| `@adra-network/roles-permissions-helper` | Fine-grained permission checks without reimplementing RBAC helpers. |
| `@adra-network/i18n-config` | Shared locale/config bundles without full `i18n-module` runtime behavior. |
| `@adra-network/testing-utilities` | Shared Playwright/component/Nuxt helpers in `devDependencies`. |
| `@adra-network/prettier-config` | Standard Prettier preset in root `package.json`. |
| `@adra-network/create-adra` | CLI to scaffold new ADRA frontends (not a runtime app dependency). |
