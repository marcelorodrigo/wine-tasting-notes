---
title: Nuxt Layer vs ADRA Module vs Plain Package
impact: MEDIUM
impactDescription: Right abstraction keeps shared code reusable and apps thin
tags: nuxt, layers, modules, architecture, adra-frontends
---

## Nuxt Layer vs ADRA Module vs Plain Package

**Impact: MEDIUM (wrong choice spreads app logic or blocks composition)**

**Canonical rule** for choosing layer vs module vs plain workspace dependency. **Related:** [`nuxt-adra-extends-layer-order.md`](nuxt-adra-extends-layer-order.md) (fixed `extends` order); [`nuxt-adra-modules-composition.md`](nuxt-adra-modules-composition.md) (module list composition).

Use a **Nuxt layer** (`extends`) for shared `nuxt.config` presets (favicon, common tooling, API layer wiring, Vuetify/ui stack). Use a **Nuxt module** (`modules`) when the package registers runtime behavior: composables via `addImports`, plugins, middleware hooks, or generated types. Use a **plain workspace dependency** when you only import Vue components, composables, or TS helpers without Nuxt-specific registration—often together with a layer that already configures the stack.

**Incorrect (treating a module like a layer or vice versa):**

```typescript
// Module-only package listed under extends — wrong mechanism
export default defineNuxtConfig({
  extends: ['@adra-network/authentication-module'],
})

// Layer-only package listed under modules — wrong mechanism
export default defineNuxtConfig({
  modules: ['@adra-network/ui-layer'],
})
```

**Correct (layers in extends, ADRA modules in modules, UI lib via deps + layer):**

```typescript
export default defineNuxtConfig({
  extends: [
    '@adra-network/favicon-layer',
    '@adra-network/common-config-layer-nuxt',
    '@adra-network/api-service-nuxt-layer',
    '@adra-network/ui-layer',
  ],
  modules: [
    '@adra-network/authentication-module',
    '@adra-network/feature-flag-module',
  ],
})
```

Add `@adra-network/ui-library` (or `notifications`, `forms`) in `package.json` when the app imports them directly; prefer **`ui-layer`** to centralize Vuetify-related Nuxt config.

Reference: [Nuxt layers](https://nuxt.com/docs/guide/going-further/layers), [Nuxt modules](https://nuxt.com/docs/guide/concepts/modules)
