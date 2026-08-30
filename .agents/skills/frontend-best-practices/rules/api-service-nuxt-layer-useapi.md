---
title: Use useApi() from api-service-nuxt-layer
impact: MEDIUM
impactDescription: Keeps API calls consistent with shared configuration and auth token injection
tags: nuxt, layers, api-service, useapi, authentication
---

## Use useApi() from api-service-nuxt-layer

**Impact: MEDIUM (wrong wiring/calling patterns bypass shared configuration and auth handling)**

### Nuxt wiring

Register `@adra-network/api-service-nuxt-layer` in **`extends`**, never under `modules`. Use the canonical ADRA layer order in [`nuxt-adra-extends-layer-order.md`](nuxt-adra-extends-layer-order.md). Layer vs module rules: [`nuxt-layer-vs-adra-module.md`](nuxt-layer-vs-adra-module.md). Workspace client packages: [`api-clients-workspace-packages.md`](api-clients-workspace-packages.md).

Pair with `@adra-network/authentication-module` in `modules` when apps need token injection via `useAuth()`.

### App code: use `useApi()` clients, not raw `$fetch`/axios

**Incorrect (bypasses shared auth + base URL wiring):**

```vue
<script setup lang="ts">
const { public: publicConfig } = useRuntimeConfig()

const { data } = await useAsyncData(() =>
  $fetch(`${publicConfig.AD_USO_EXTERNAL_BASE_URL}/profiles/123`),
)
</script>
```

**Correct (uses shared, configured API client):**

```vue
<script setup lang="ts">
const { uso } = useApi()

const response = await uso.get('/profiles/123')
const profile = response.data.data
</script>
```

Reference: [Nuxt layers](https://nuxt.com/docs/guide/going-further/layers)
