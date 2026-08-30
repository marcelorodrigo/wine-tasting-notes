---
title: No App-Specific Domain Logic in Shared Packages
impact: HIGH
impactDescription: Preserves reuse across frontends and avoids circular workspace dependencies
tags: monorepo, packages, architecture, vue, nuxt
---

## No App-Specific Domain Logic in Shared Packages

**Impact: HIGH (shared packages stay reusable; apps own product behavior)**

Code under `packages/*` must stay product- and tenant-agnostic. Do not bake in routes, copy, or workflows belonging to a single frontend. Apps in `frontends/*` compose shared primitives via props, runtime config, and layers.

**Incorrect (frontend import from a shared package or product-specific code in packages):**

```typescript
// packages/ui-library/src/components/DonorDashboardCard.vue
import { useDonorStore } from '../../../../frontends/donor-relationship-manager/stores/donor'
```

```vue
<!-- Hard-coded single-app path or branding in a shared component -->
<NuxtLink to="/drm/donors/123">Open donor</NuxtLink>
```

**Correct (generic package; app supplies behavior and routes):**

```vue
<!-- packages/ui-library - props and slots, no frontend imports -->
<script setup lang="ts">
defineProps<{ profileUrl: string; title: string }>()
</script>

<template>
  <NuxtLink :to="profileUrl">{{ title }}</NuxtLink>
</template>
```

```vue
<!-- frontends/donor-relationship-manager - wires app-specific URLs -->
<DonorCard :profile-url="`/drm/donors/${id}`" :title="donorName" />
```

Shared modules may extend `runtimeConfig.public.adra` only with generic, documented options—not app-only feature flags tied to one product unless expressed as neutral configuration.
