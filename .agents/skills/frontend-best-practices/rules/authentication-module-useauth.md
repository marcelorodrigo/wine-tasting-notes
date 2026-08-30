---
title: Use `useAuth()` From Authentication Module
impact: MEDIUM
impactDescription: Prevents auth-state bugs and avoids duplicating Keycloak handling
tags: nuxt, auth, composables, keycloak, typescript
---

## Use `useAuth()` From `@adra-network/authentication-module`

**Impact: MEDIUM (prevents auth-state bugs and duplicated token handling)**

Use the shared ADRA authentication Nuxt module to access login/logout and reactive user/auth state. `useAuth()` returns Vue computed refs, so read `.value` in `<script setup>`/composables, while templates can use the ref directly (Vue unwraps it). For local development, enable the module's built-in `mock` mode via `adraAuthentication` in `nuxt.config.ts`.

**Incorrect (treats computed auth state as plain values):**

```typescript
import { useAuth } from '@adra-network/authentication-module'

export default defineComponent({
  setup() {
    const { authenticated, token } = useAuth()

    // WRONG: `authenticated` is a ComputedRef<boolean>, not a boolean
    if (authenticated) {
      console.log('User is authenticated')
    }

    // Often WRONG: captures a one-time snapshot; use a computed/watch if you need reactivity
    const accessToken = token.value

    return { accessToken }
  },
})
```

**Correct (reads computed refs and keeps reactivity):**

```typescript
import { computed, watch } from 'vue'
import { useAuth } from '@adra-network/authentication-module'

const { authenticated, token, login, logout } = useAuth()

watch(
  () => authenticated.value,
  (isAuthenticated) => {
    if (isAuthenticated) logout()
  },
)

// Keep token reactive when deriving other state
const accessToken = computed(() => token.value)

// Call module-provided methods
const ensureLoggedIn = () => {
  if (!authenticated.value) login()
}
```

### Dev: use `adraAuthentication.mock` instead of per-component fake auth

**Incorrect (inventing mock auth state in each component):**

```typescript
import { computed, ref } from 'vue'
import type { User } from '@adra-network/authentication-module'

// WRONG: fake auth state lives in every component; you lose shared token refresh and consistency.
const user = ref<User | null>({
  sub: 'demo',
  email_verified: true,
  roles: ['cloud_user_superadmin'],
  organizations: {},
  name: 'Demo User',
  preferred_username: 'demo.user',
  given_name: 'Demo',
  family_name: 'User',
  email: 'demo@adra.cloud',
})

const authenticated = computed(() => true)
```

**Correct (let the module handle mock mode consistently):**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@adra-network/authentication-module'],
  adraAuthentication: {
    mock: true,
  },
})
```

### Global access: prefer `$auth` inside plugins/middleware

In Nuxt plugins, you can read `nuxtApp.$auth` (provided by the module) rather than re-importing or re-creating auth state.

