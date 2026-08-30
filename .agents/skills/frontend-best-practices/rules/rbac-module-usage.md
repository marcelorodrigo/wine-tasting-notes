---
title: Use `@adra-network/rbac-module` for RBAC Authorization
impact: HIGH
impactDescription: Prevents unauthorized UI exposure and missing route protection
tags: nuxt, rbac, authorization, tenancy, security, middleware
---

## Use `@adra-network/rbac-module` for RBAC Authorization

**Impact: HIGH (prevents missing authorization checks and insecure role logic)**

Use `@adra-network/rbac-module` when you need role-based access control in Nuxt 3. The module wires an `authorized` route middleware (for route protection) and a `useRbac()` composable (for tenant-scoped UI gating via `$user.can()` / `$user.is()`).

### Route Protection (authorized middleware + `authorizedRoles`)

Important: the `authorized` middleware depends on auth-state. In practice, you should run `authenticated` first, because `authorized` returns early when the user is not authenticated.

**Incorrect (wrong middleware/meta keys):**

```vue
<!-- WRONG: RBAC middleware is registered as `authorized`, and it reads `to.meta.authorizedRoles` -->
<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated', 'rbac'],
  rbac: { roles: ['administrator'] },
})
</script>
```

**Correct (use `authorized` + `authorizedRoles`):**

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated', 'authorized'],
  authorizedRoles: ['administrator'],
})
</script>
```

**Incorrect (missing `authenticated`):**

```vue
<script setup lang="ts">
definePageMeta({
  // WRONG: unauthenticated users won't be redirected by `authorized`
  middleware: ['authorized'],
  authorizedRoles: ['administrator'],
})
</script>
```

### Global vs Per-Page Authorization

If you enable `adraRbac.globalMiddleware`, you must also configure the roles it should enforce (`adraRbac.globalRoles`). Otherwise the middleware runs globally but has no required roles to check, so routes won’t be protected.

**Incorrect (global middleware without roles):**

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@adra-network/authentication-module', '@adra-network/rbac-module'],
  adraRbac: {
    globalMiddleware: true,
    // WRONG: missing `globalRoles`
  },
})
```

**Correct (global middleware with enforced roles):**

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@adra-network/authentication-module', '@adra-network/rbac-module'],
  adraRbac: {
    globalMiddleware: true,
    globalRoles: ['administrator', 'drm'],
  },
})
```

### UI Gating (use `useRbac()` instead of ad-hoc localStorage checks)

**Incorrect (role checks outside the RBAC composable):**

```ts
import { computed } from 'vue'

const canSeeAdmin = computed(() => {
  // WRONG: bypasses tenant scoping and duplicates role/tenant logic
  const roles = JSON.parse(localStorage.getItem('roles') ?? '[]')
  return roles.includes('administrator')
})
```

**Correct (tenant-scoped checks via the RBAC composable):**

```ts
import { computed } from 'vue'

const $user = useRbac()

const canSeeAdmin = computed(() => $user.can('administrator'))
```

For multi-organization apps, tenant selection should flow through the shared UI (e.g. `OrganizationSwitcher` calling `$user.setTenant(...)`), so `$user.can()` checks the currently selected tenant.

