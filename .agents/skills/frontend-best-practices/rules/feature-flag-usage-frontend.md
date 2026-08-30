---
title: Feature Flag Usage in Vue 3 & Nuxt Frontend
impact: MEDIUM
impactDescription: Prevents runtime errors and improves code maintainability
tags: feature-flags, vue3, nuxt, composables, middleware, frontend
---

## Feature Flag Usage in Vue 3 & Nuxt Frontend

**Impact: MEDIUM (Prevents runtime errors, ensures consistent feature rollout)**

Feature flags in Vue 3/Nuxt frontends must follow consistent patterns across composables, middleware, and pages. Use the `useFlag()` composable from the `@adra-network/feature-flag-module` to check flag status and control component rendering, navigation, or conditional logic.

### Middleware Usage

Use middleware to gate entire routes based on feature flags. This ensures unauthorized users are redirected before the page loads.

**Incorrect (no flag check in middleware):**

```typescript
// middleware/finance-feature-flag.global.ts
export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/forms/finance')) {
    return
  }
  // Missing feature flag check - page loads regardless
})
```

**Correct (flag check before route access):**

```typescript
// middleware/finance-feature-flag.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Only apply to routes that require the feature
  if (!to.path.startsWith('/forms/finance')) {
    return
  }

  // Use useFlag() to check if feature is enabled
  const financeFeatureEnabled = useFlag('DEVT-1314')
  if (!financeFeatureEnabled.value) {
    return navigateTo('/')  // Redirect if flag is disabled
  }
})
```

### Composable Usage

Extract flag logic into composables for reusability across multiple pages or components. Use computed properties to reactively track flag status.

**Incorrect (flag check in multiple places):**

```typescript
// pages/dashboard.vue
import { computed } from 'vue'

export default {
  setup() {
    const isSkillsEnabled = useFlag('global.user_skills.first_release')
    const isDashboardEnabled = useFlag('global.dashboard.new_design')
    
    return { isSkillsEnabled, isDashboardEnabled }
  }
}

// pages/profile.vue
import { computed } from 'vue'

export default {
  setup() {
    const isSkillsEnabled = useFlag('global.user_skills.first_release')  // Repeated
    
    return { isSkillsEnabled }
  }
}
```

**Correct (centralized in composable):**

```typescript
// composables/useFeatures.ts
import { computed } from 'vue'

export default function () {
  const isSkillsFirstRelease = useFlag('global.user_skills.first_release')
  const isDashboardNewDesign = useFlag('global.dashboard.new_design')
  
  return {
    isSkillsFirstRelease,
    isDashboardNewDesign,
  }
}

// pages/dashboard.vue
export default {
  setup() {
    const { isSkillsFirstRelease, isDashboardNewDesign } = useFeatures()
    return { isSkillsFirstRelease, isDashboardNewDesign }
  }
}

// pages/profile.vue
export default {
  setup() {
    const { isSkillsFirstRelease } = useFeatures()
    return { isSkillsFirstRelease }
  }
}
```

### Component Conditional Rendering

Use computed flags to control element visibility and avoid rendering unnecessary DOM nodes when features are disabled.

**Incorrect (no flag guard):**

```typescript
// composables/useProfileMenu.ts
export default function () {
  const { t } = useI18n()
  
  return computed(() => [
    {
      icon: mdiAccountOutline,
      title: t('profile_sidebar.profile'),
      link: '/user-settings/profile',
      disabled: false,
    },
    {
      icon: mdiBriefcaseOutline,
      title: t('profile_sidebar.skills'),
      link: '/user-settings/skills',
      disabled: false,  // Skills page always accessible, even if not released
    },
  ])
}
```

**Correct (flag controls disabled state):**

```typescript
// composables/useProfileMenu.ts
export default function () {
  const isSkillsFirstRelease = useFlag('global.user_skills.first_release')
  const { t } = useI18n()
  
  return computed(() => [
    {
      icon: mdiAccountOutline,
      title: t('profile_sidebar.profile'),
      link: '/user-settings/profile',
      disabled: false,
    },
    {
      icon: mdiBriefcaseOutline,
      title: t('profile_sidebar.skills'),
      link: '/user-settings/skills',
      disabled: !isSkillsFirstRelease.value,  // Disabled until feature is released
      new: isSkillsFirstRelease.value,        // Show "new" badge when enabled
    },
  ])
}
```

### Template Conditional Rendering

Use `v-if` directives in templates to avoid rendering UI elements when features are disabled.

**Incorrect (always renders element):**

```vue
<template>
  <div class="profile-menu">
    <router-link to="/user-settings/skills">
      {{ t('profile_sidebar.skills') }}
    </router-link>
  </div>
</template>
```

**Correct (flag-gated rendering):**

```vue
<template>
  <div class="profile-menu">
    <router-link v-if="isSkillsFirstRelease" to="/user-settings/skills">
      {{ t('profile_sidebar.skills') }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
const { isSkillsFirstRelease } = useFeatures()
</script>
```

### Flag Value Access

Always access the `.value` property when checking flag status in script code. In templates, Vue's reactivity system handles this automatically.

**Incorrect (missing .value):**

```typescript
const financeFeatureEnabled = useFlag('DEVT-1314')

if (financeFeatureEnabled) {  // Missing .value
  doSomething()
}
```

**Correct (accessing .value):**

```typescript
const financeFeatureEnabled = useFlag('DEVT-1314')

if (financeFeatureEnabled.value) {  // Use .value to access boolean
  doSomething()
}
```

### Factory Function Pattern (Dynamic Menus/Arrays)

Use spread operators with feature flags to conditionally include items in factory-built arrays, commonly used for dynamic menu construction in `app.vue` files.

**Incorrect (always includes menu item):**

```typescript
// app.vue
const mainItems = computed(() => [
  {
    title: 'Dashboard',
    link: '/',
  },
  {
    title: 'Data Management',
    link: '/data-management',
    children: [
      {
        title: 'Imports',
        link: '/data-management/import',
      },
      {
        title: 'Exports',
        link: '/data-management/export',
      },
    ],
  },
])
```

**Correct (conditionally includes menu items via spread):**

```typescript
// app.vue
const crmImportEnabled = useFlag('DEVT-1314')
const crmExportEnabled = useFlag('DEVT-1315')

const mainItems = computed(() => [
  {
    title: 'Dashboard',
    link: '/',
  },
  {
    title: 'Data Management',
    link: '/data-management',
    children: [
      ...(crmImportEnabled.value
        ? [
            {
              title: 'Imports',
              link: '/data-management/import',
            },
          ]
        : []),
      ...(crmExportEnabled.value
        ? [
            {
              title: 'Exports',
              link: '/data-management/export',
            },
          ]
        : []),
    ],
  },
])
```

### Combining Flags with RBAC

Integrate feature flags with role-based access control (RBAC) for fine-grained access management. Use `&&` operators to require both flag and permission.

**Incorrect (flag alone without permission check):**

```typescript
// app.vue
const aalEnetMigrationLaunched = useFlag('global.aal.enet-migration')

const mainItems = computed(() => [
  ...(aalEnetMigrationLaunched.value
    ? [
        {
          title: 'AAL Licenses',
          link: '/licenses',
        },
      ]
    : []),
])
// Any user with flag enabled can access this, even without aal-manager role
```

**Correct (flag AND permission check):**

```typescript
// app.vue
const aalEnetMigrationLaunched = useFlag('global.aal.enet-migration')

const mainItems = computed(() => [
  ...(aalEnetMigrationLaunched.value && $user.is('aal-manager')
    ? [
        {
          title: 'AAL Licenses',
          link: '/licenses',
        },
      ]
    : []),
])
// Only aal-manager role users can access when flag is enabled
```

### Naming Convention

Flag IDs must use **ticket-based names** so each flag maps to a Jira ticket for tracking and cleanup.

**Incorrect (generic or pattern-based names):**

```typescript
const genericFlag = useFlag('new-feature')
const vagueName = useFlag('flag-123')
// Global org-wide pattern — avoid for new flags
const globalFlag = useFlag('global.aal.enet-migration')
```

**Correct (ticket-based naming):**

```typescript
const isExportEnabled = useFlag('DEVT-1348')
const isFinanceFeatureEnabled = useFlag('DEVT-2156')
```

**Why ticket-based names:** direct link to requirements in Jira, easy cleanup when the ticket is resolved, and searchable by ticket number across the codebase.

### Descriptive Variable Naming

Use clear, descriptive names that indicate what feature is being gated, not just generic flag names.

**Incorrect (generic names):**

```typescript
const flag1 = useFlag('DEVT-1348')
const enabled = useFlag('DEVT-1314')
const isActive = useFlag('global.user_skills.first_release')
```

**Correct (descriptive names):**

```typescript
const isSkillsFirstRelease = useFlag('DEVT-1348')
const isFinanceFeatureEnabled = useFlag('DEVT-1314')
const isSkillsModuleActive = useFlag('global.user_skills.first_release')
```

### Best Practices Summary

- **Middleware**: Gate entire routes using `useFlag()` before the page renders
- **Composables**: Extract reusable flag logic to avoid duplication
- **Templates**: Use `v-if` to conditionally render elements based on flags
- **Factory Functions**: Use spread operators `...(flag.value ? [item] : [])` for conditional array items
- **RBAC Integration**: Combine flags with user permissions using `&&` operators
- **Property Access**: Always use `.value` when checking flags in script code
- **Variable Naming**: Use descriptive names indicating what feature is gated (e.g., `isSkillsFirstRelease`, not `flag1`)
- **Naming**: Use ticket-based flag IDs (e.g. `DEVT-XXXX`)
- **Cleanup**: Remove flags when their associated Jira ticket is resolved

Reference: [@adra-network/feature-flag-module](https://gitlab.com/adra-network/monorepo/-/tree/main/packages/feature-flag-module)
