---
title: pnpm workspace:* and catalog: for Monorepo Dependencies
impact: MEDIUM
impactDescription: Prevents version drift and keeps internal packages on one source of truth
tags: pnpm, monorepo, workspace, catalog, adra-frontends
---

## pnpm workspace:* and catalog: for Monorepo Dependencies

**Impact: MEDIUM (aligned framework versions across apps and packages)**

In the ADRA frontends monorepo, internal packages (`@adra-network/*` living under `packages/` or `openapi-clients/`) must be declared with `"workspace:*"`. Shared third-party versions (Nuxt, Vue, Vite, Vuetify, Vitest, etc.) should use `"catalog:"` with the version defined only in the repo root `pnpm-workspace.yaml` `catalog` section.

**Incorrect (semver pin to an internal package or literal stack versions everywhere):**

```json
{
  "dependencies": {
    "@adra-network/ui-library": "^0.0.10",
    "nuxt": "^3.20.1"
  }
}
```

**Correct (workspace + catalog):**

```json
{
  "dependencies": {
    "@adra-network/ui-library": "workspace:*",
    "nuxt": "catalog:"
  }
}
```

Reserve literal versions only for documented exceptions (e.g. a package that must lag the catalog temporarily).

Reference: [pnpm catalog](https://pnpm.io/catalogs), [pnpm workspace protocol](https://pnpm.io/workspaces#workspace-protocol-workspace)
