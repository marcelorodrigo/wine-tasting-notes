---
title: Nuxt UI Layer Usage
impact: MEDIUM
impactDescription: Ensures consistent Vuetify + fonts + UI component setup
tags: nuxt, layers, ui, vuetify, fonts
---

## Nuxt UI Layer Usage

**Impact: MEDIUM (keeps apps consistent and avoids duplicated Vuetify config)**

Use `@adra-network/ui-layer` to standardize the Nuxt UI stack (Vuetify setup, Google Fonts, and ADRA UI component auto-imports). It is a **layer**: add it under `extends`, not `modules`. Classification: [`nuxt-layer-vs-adra-module.md`](nuxt-layer-vs-adra-module.md). **Order:** list it last among the ADRA shared layers in [`nuxt-adra-extends-layer-order.md`](nuxt-adra-extends-layer-order.md).

**Incorrect (using a Nuxt layer in `modules`):**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@adra-network/ui-layer'],
})
```

**Correct:** include `@adra-network/ui-layer` in `extends` in the canonical ADRA order (see [`nuxt-adra-extends-layer-order.md`](nuxt-adra-extends-layer-order.md)).

### Do not re-implement Vuetify + Google Fonts in each app

`@adra-network/ui-layer` already configures Vuetify + Google Fonts and registers the UI plugin that supports the ADRA UI library (including auto-imports with the `A` prefix).

**Incorrect (duplicating stack setup instead of relying on the layer):**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ['@adra-network/common-config-layer-nuxt'],
  modules: ['vuetify-nuxt-module', '@nuxtjs/google-fonts'],
  googleFonts: { families: { Montserrat: { wght: '200..900' } } },
  vuetify: { vuetifyOptions: { /* duplicated theme config */ } },
})
```

**Correct:** rely on `ui-layer` in `extends` (with the full ADRA layer chain per [`nuxt-adra-extends-layer-order.md`](nuxt-adra-extends-layer-order.md)); keep app `nuxt.config` focused on app-specific overrides.

Reference: [Nuxt layers](https://nuxt.com/docs/guide/going-further/layers), [Nuxt `extends`](https://nuxt.com/docs/api/nuxt-config#extends)
