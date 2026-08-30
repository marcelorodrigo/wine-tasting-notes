---
title: ADRA Network Nuxt Modules When to Use
impact: MEDIUM
impactDescription: Correct module choice prevents auth, RBAC, and runtime wiring drift
tags: nuxt, modules, adra-network, authentication, architecture
---

## ADRA Network Nuxt Modules When to Use

**Impact: MEDIUM (wrong module usage causes duplicated runtime behavior and broken auth/RBAC flows)**

Use ADRA Nuxt modules in `modules` when the app needs runtime registration (plugins, imports, middleware). They do not belong in `extends`.

**Composition** (unique entries, `authentication-module` before `rbac-module`, optional modules): canonical in [`nuxt-adra-modules-composition.md`](nuxt-adra-modules-composition.md).

**Incorrect (ad-hoc app auth instead of shared ADRA modules):**

```typescript
// frontends/my-app/composables/useKeycloak.ts
// Re-implements auth flow already provided by the ADRA module.
export function useKeycloak() {
  /* ... */
}
```

**Correct:** register the right `@adra-network/*` modules in `modules` following [`nuxt-adra-modules-composition.md`](nuxt-adra-modules-composition.md).

### Package mapping

| Package | When to use |
|---------|-------------|
| `@adra-network/authentication-module` | App needs ADRA Keycloak integration and shared auth session/login flow. |
| `@adra-network/rbac-module` | App gates routes/UI by roles or permissions; pair with `authentication-module`. |
| `@adra-network/i18n-module` | App uses ADRA i18n setup and shared translation loading. |
| `@adra-network/feature-flag-module` | App uses Unleash-backed flags via `useFlag()`. |
| `@adra-network/help-modal-module` | App ships the standard contextual help modal experience. |

Reference: [Nuxt modules](https://nuxt.com/docs/guide/concepts/modules)
