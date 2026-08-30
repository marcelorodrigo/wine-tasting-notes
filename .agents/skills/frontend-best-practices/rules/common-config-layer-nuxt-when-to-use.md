---
title: Common Config Layer Nuxt When to Use
impact: MEDIUM
impactDescription: Consistent baseline Nuxt config avoids per-app drift
tags: nuxt, layers, adra-network, monorepo, configuration
---

## Common Config Layer Nuxt When to Use

**Impact: MEDIUM (skipping shared baseline config causes duplicated setup and config drift across apps)**

Use `@adra-network/common-config-layer-nuxt` when an app should inherit the standard ADRA Nuxt baseline configuration.

This rule is intentionally scoped to **when** to include the package:
- For layer/module classification rules, see [`nuxt-layer-vs-adra-module.md`](nuxt-layer-vs-adra-module.md).
- For canonical `extends` ordering, see [`nuxt-adra-extends-layer-order.md`](nuxt-adra-extends-layer-order.md).

### Quick decision guide

| Situation | Use `@adra-network/common-config-layer-nuxt` |
|-----------|-----------------------------------------------|
| Standard ADRA frontend app | Yes |
| App already using other ADRA shared layers/modules | Yes |
| Intentionally standalone/special-case app with custom-only config | Optional |

Reference: [Nuxt layers](https://nuxt.com/docs/guide/going-further/layers)
