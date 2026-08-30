---
title: ADRA Nuxt Layer extends Order
impact: MEDIUM
impactDescription: Predictable config merges and fewer override surprises
tags: nuxt, layers, monorepo, adra-frontends
---

## ADRA Nuxt Layer extends Order

**Impact: MEDIUM (later layers override earlier defaults intentionally—order matters)**

**Canonical rule** for ADRA shared layer ordering. **Related:** [`nuxt-layer-vs-adra-module.md`](nuxt-layer-vs-adra-module.md) (layers vs modules vs plain deps); [`adra-network-layers-when-to-use.md`](adra-network-layers-when-to-use.md) (which layer package when).

In ADRA Nuxt apps, `extends` should list shared layers in a fixed order so baselines load before UI and API wiring.

**Incorrect (UI or API layer before shared baseline):**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    '@adra-network/ui-layer',
    '@adra-network/common-config-layer-nuxt',
    '@adra-network/favicon-layer',
  ],
})
```

**Correct (favicon → common config → API layer → UI stack):**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    '@adra-network/favicon-layer',
    '@adra-network/common-config-layer-nuxt',
    '@adra-network/api-service-nuxt-layer',
    '@adra-network/ui-layer',
  ],
})
```

Omit layers your app does not need; keep the **relative** order for any subset (e.g. favicon before common-config).

Reference: [Nuxt extends](https://nuxt.com/docs/api/nuxt-config#extends)
