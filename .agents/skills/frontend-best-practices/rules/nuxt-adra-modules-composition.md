---
title: ADRA Nuxt Modules Composition
impact: MEDIUM
impactDescription: Avoids duplicate registration and broken auth/RBAC ordering
tags: nuxt, modules, authentication, rbac, adra-frontends
---

## ADRA Nuxt Modules Composition

**Impact: MEDIUM (duplicate modules confuse behavior; RBAC assumes auth is present)**

**Canonical rule** for ADRA `modules` list hygiene and ordering. **Related:** [`adra-network-modules-when-to-use.md`](adra-network-modules-when-to-use.md) (which module when); [`nuxt-layer-vs-adra-module.md`](nuxt-layer-vs-adra-module.md) (modules vs layers).

ADRA `modules` entries should list each `@adra-network/*` module **once** and load `@adra-network/authentication-module` before `@adra-network/rbac-module`.

### Registration hygiene

**Incorrect (duplicate module / wrong order):**

```typescript
export default defineNuxtConfig({
  modules: [
    '@adra-network/rbac-module',
    '@adra-network/authentication-module',
    '@adra-network/rbac-module',
  ],
})
```

**Correct (unique entries, auth before RBAC):**

```typescript
export default defineNuxtConfig({
  modules: [
    '@adra-network/authentication-module',
    '@adra-network/rbac-module',
    '@adra-network/i18n-module',
    '@adra-network/feature-flag-module',
  ],
})
```

For optional module inclusion guidance (`i18n-module`, `feature-flag-module`, `help-modal-module`), use the canonical mapping in [`adra-network-modules-when-to-use.md`](adra-network-modules-when-to-use.md).

Reference: [Nuxt modules](https://nuxt.com/docs/guide/concepts/modules)
