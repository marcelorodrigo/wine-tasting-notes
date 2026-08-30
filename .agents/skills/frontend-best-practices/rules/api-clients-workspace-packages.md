---
title: API and OpenAPI Clients in Workspace Packages
impact: MEDIUM
impactDescription: Keeps HTTP usage consistent and avoids duplicated client logic
tags: monorepo, openapi, nuxt, axios, adra-frontends
---

## API and OpenAPI Clients in Workspace Packages

**Impact: MEDIUM (single place for types, base URLs, and interceptors)**

HTTP and OpenAPI-generated clients should live in dedicated workspace packages (`packages/api-service`, `openapi-clients/*`). Nuxt apps wire them through layers such as `api-service-nuxt-layer` instead of reimplementing fetch logic per frontend.

**Incorrect (ad-hoc API module duplicated in an app):**

```typescript
// frontends/some-app/composables/useDonorsApi.ts
import axios from 'axios'

export function useDonorsApi() {
  const client = axios.create({ baseURL: import.meta.env.VITE_ORCHESTRATOR_URL })
  return {
    list: () => client.get('/donors'),
  }
}
```

**Correct (depend on shared client packages):**

```json
// frontends/some-app/package.json (excerpt)
{
  "dependencies": {
    "@adra-network/api-service-nuxt-layer": "workspace:*",
    "@adra-network/openapi-orchestrator-client": "workspace:*"
  }
}
```

Use the shared layer and generated types in app code; extend the workspace package when a new API surface is needed rather than copying wrappers.

**Related:** [`adra-network-libraries-api-when-to-use.md`](adra-network-libraries-api-when-to-use.md) (UI and library package map); [`api-service-nuxt-layer-useapi.md`](api-service-nuxt-layer-useapi.md) (using `useApi()` in Nuxt apps).

Reference: [pnpm workspaces](https://pnpm.io/workspaces)
