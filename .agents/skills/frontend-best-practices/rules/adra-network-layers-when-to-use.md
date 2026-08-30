---
title: ADRA Network Nuxt Layers When to Use
impact: MEDIUM
impactDescription: Correct layer usage keeps Nuxt presets consistent across apps
tags: nuxt, layers, adra-network, architecture, monorepo
---

## ADRA Network Nuxt Layers When to Use

**Impact: MEDIUM (wrong layer usage fragments shared Nuxt config and UI stack setup)**

ADRA **layer** packages belong in `extends`, never in `modules`.

- **Classification** (layer vs module vs plain dependency): [`nuxt-layer-vs-adra-module.md`](nuxt-layer-vs-adra-module.md)
- **Fixed `extends` order** for shared ADRA layers: [`nuxt-adra-extends-layer-order.md`](nuxt-adra-extends-layer-order.md)

This rule only maps **which layer package** to include when—after applying those two.

### Package mapping

| Package | When to use |
|---------|-------------|
| `@adra-network/favicon-layer` | App should use standard ADRA favicons/icons. |
| `@adra-network/common-config-layer-nuxt` | App needs baseline shared Nuxt config. |
| `@adra-network/api-service-nuxt-layer` | App needs Nuxt wiring for shared API clients. |
| `@adra-network/ui-layer` | App uses the standard Vuetify-based ADRA UI stack preset. |

Reference: [Nuxt layers](https://nuxt.com/docs/guide/going-further/layers)
