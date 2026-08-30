---
title: Nuxt Runtime Config Under the adra Namespace
impact: MEDIUM
impactDescription: Avoids key collisions and documents module integration
tags: nuxt, runtimeConfig, modules, adra-frontends
---

## Nuxt Runtime Config Under the adra Namespace

**Impact: MEDIUM (predictable integration surface for shared modules)**

Shared ADRA Nuxt modules should merge public runtime options under `runtimeConfig.public.adra`, using a distinct `configKey` per module (e.g. `adraAuthentication`). Extend existing `adra` objects rather than scattering unrelated keys at the top level of `public`.

**Incorrect (module options at arbitrary public keys):**

```typescript
// Inside a defineNuxtModule setup — overwrites or clutters root public config
nuxt.options.runtimeConfig.public.authMock = options.mock
nuxt.options.runtimeConfig.public.keycloakRealm = options.realm
```

**Correct (nested under adra with a module-specific key):**

```typescript
nuxt.options.runtimeConfig.public.adra = {
  ...nuxt.options.runtimeConfig.public.adra,
  adraAuthentication: options,
}
```

Apps and other modules can rely on one prefix (`adra`) for discovery and merges.

Reference: [Nuxt runtime config](https://nuxt.com/docs/guide/going-further/runtime-config)
