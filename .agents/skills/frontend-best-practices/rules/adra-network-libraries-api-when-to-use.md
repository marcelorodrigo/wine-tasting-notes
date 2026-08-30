---
title: ADRA Network Libraries and API Packages When to Use
impact: MEDIUM
impactDescription: Shared libraries avoid duplicated UI and HTTP client implementations
tags: packages, api, ui, openapi, adra-network
---

## ADRA Network Libraries and API Packages When to Use

**Impact: MEDIUM (wrong dependency choices duplicate UI/HTTP layers and increase maintenance)**

Use ADRA libraries in `dependencies` when app code imports components, composables, or clients directly.

**HTTP / OpenAPI clients:** do not add per-app axios/fetch wrappers. Canonical guidance and examples: [`api-clients-workspace-packages.md`](api-clients-workspace-packages.md). In Nuxt apps, call configured clients via [`api-service-nuxt-layer-useapi.md`](api-service-nuxt-layer-useapi.md).

### Package mapping

| Package | When to use |
|---------|-------------|
| `@adra-network/ui-library` | Primary Vuetify-based ADRA components/composables via documented exports. |
| `@adra-network/ui` | Tailwind-oriented private UI kit for products on that stack. |
| `@adra-network/notifications` | In-app notifications UI with Novu integration. |
| `@adra-network/forms` | Form.io-oriented product flows. |
| `@adra-network/api-service` | Core typed HTTP client surface. |
| `@adra-network/openapi-orchestrator-client` (and `openapi-clients/*`) | Generated clients for API contracts. |
| `@adra-network/orchestrator` | Private facade when standardizing on orchestration wrapper APIs. |

Reference: [pnpm workspaces](https://pnpm.io/workspaces)
