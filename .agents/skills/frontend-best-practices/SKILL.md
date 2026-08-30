---
name: frontend-best-practices
description: Best practices for frontend development including React, TypeScript, CSS, performance, accessibility, and component design. Use when reviewing frontend code, building UI components, setting up frontend projects, or enforcing frontend coding standards.
---

# Frontend Best Practices

Comprehensive frontend development guidelines for React, TypeScript, Vue, CSS, performance, accessibility, and component design. Contains rules prioritized by impact to guide code generation and review.

## When to Apply

Reference these guidelines when:
- Writing new React or Vue components
- Implementing client-side data fetching or state management
- Reviewing frontend code for quality or accessibility issues
- Refactoring existing UI code
- Optimizing bundle size or rendering performance
- Enforcing coding standards across the team

## Quick Reference

- `adra-network-layers-when-to-use` - Layer package map; pair with `nuxt-layer-vs-adra-module` + `nuxt-adra-extends-layer-order`
- `adra-network-libraries-api-when-to-use` - UI/library package map; HTTP/OpenAPI wiring → `api-clients-workspace-packages` + `api-service-nuxt-layer-useapi`
- `adra-network-modules-when-to-use` - Module capability map; list hygiene → `nuxt-adra-modules-composition`
- `adra-network-tooling-packages-when-to-use` - Use shared ADRA helper/tooling packages in the correct runtime or dev scope
- `api-clients-workspace-packages` - Consume HTTP/OpenAPI via `api-service`, `openapi-clients/*`, and Nuxt layers—not per-app axios copies
- `api-service-nuxt-layer-useapi` - Use `useApi()` in app code; layer in `extends` per `nuxt-adra-extends-layer-order`; packages → `api-clients-workspace-packages`
- `authentication-module-useauth` - Use `useAuth()` from `@adra-network/authentication-module` and access computed refs correctly
- `common-config-layer-nuxt-when-to-use` - Baseline layer in `extends` after favicon; full chain → `nuxt-adra-extends-layer-order`
- `css-classes-rem-framework-styling` - Prefer CSS classes and Vuetify/Tailwind utilities over inline styles; use `rem` not `px` for type and spacing
- `feature-flag-usage-frontend` - Use `useFlag()` composable consistently across middleware, composables, templates, and menus
- `nuxt-adra-extends-layer-order` - Order ADRA `extends`: favicon → common-config → api-service-nuxt-layer → ui-layer
- `nuxt-adra-modules-composition` - List each ADRA module once; auth before rbac; add i18n/feature-flag/help only when needed
- `nuxt-layer-vs-adra-module` - Layers for shared nuxt.config presets; modules for runtime registration; plain deps for import-only libs
- `nuxt-runtime-config-adra-namespace` - Merge shared module options under `runtimeConfig.public.adra` with a per-module `configKey`
- `nuxt-ui-layer-usage` - Vuetify, fonts, ADRA UI auto-imports via `ui-layer` in `extends`; do not duplicate stack; order → `nuxt-adra-extends-layer-order`
- `pnpm-workspace-catalog-dependencies` - Use `workspace:*` for `@adra-network/*` and `catalog:` for shared third-party versions
- `rbac-module-usage` - Use `@adra-network/rbac-module` for tenant-scoped route protection and UI gating
- `shared-packages-no-app-domain` - Keep `packages/*` generic; no imports from `frontends/*` or single-app routes and copy in shared libs
- `testing-utilities-use-createpathhelper` - Use `@adra-network/testing-utilities` (Nuxt module + `createPathHelper`) for CI-safe Playwright E2E paths and predictable auth state

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/feature-flag-usage-frontend.md
```

Each rule file contains:

- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references
