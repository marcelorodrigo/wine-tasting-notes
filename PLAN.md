# Wine Tasting Notes Experience: Architecture and Delivery Plan

## Document Purpose

This document is the implementation contract for the Wine Tasting Notes Experience. It records the approved product scope, architecture, package structure, domain contracts, test strategy, and a backlog of pull-request-sized GitHub issues.

Future agents should implement one issue per pull request unless an issue explicitly permits a documentation-only change. Each pull request must satisfy the issue acceptance criteria and the global Definition of Done.

## Product Scope

Build two connected product surfaces under one brand and design system:

1. A public educational academy for wine-tasting technique, setup, the WSET Level 3 Systematic Approach to Tasting (SAT), aroma and flavour education, faults, glossary, frequently asked questions, and worked examples.
2. An adaptive guided tasting tool that covers Appearance, Nose, Palate, Conclusions, review, prose generation, copy, native sharing, and explicit shareable links.

The experience serves all wine enthusiasts. It pairs approachable guidance with exact approved WSET Level 3 terminology.

## Confirmed Requirements

- The application is a client-rendered Nuxt SPA with `ssr: false`.
- The repository contains no backend, API, database, accounts, or cloud note persistence.
- Cloudflare Pages deploys the generated static output through its existing GitHub connection. This repository does not need a deployment workflow.
- The default tasting sequence is Appearance, Nose, Palate, and Conclusions.
- Conditional fields adapt the flow, while users may review and jump between sections.
- Aroma and flavour selection has two synchronized presentations: an accessible searchable hierarchy and an interactive radial SVG wheel.
- The application launches in English, but data, UI text, and generated prose are localization-ready.
- Unfinished local drafts use `sessionStorage` only and are removed after completion or explicit reset.
- Theme and preferred aroma view may use `localStorage`; tasting content must not.
- Explicit share links encode a compact, schema-versioned payload in the URL fragment.
- The application warns that anyone with a share link can read it and that messaging or social platforms may retain it.
- Opening a shared link does not create a local or durable note.
- Copy and native Web Share are supported where the browser permits them.
- Offline and installable Progressive Web App (PWA) behavior is launch scope.
- The application is mobile-first, responsive, and supports light and dark themes.
- The application contains no analytics.
- The user has confirmed written WSET permission. The exact evidence, attribution, disclaimer, territories, and modification terms must be recorded before official material is merged.

## Out of Scope

- Accounts and authentication
- Backend APIs or Nitro application endpoints
- Databases or cloud-saved tasting notes
- Durable local note history
- Public feeds, collaboration, comments, or social features
- Server-side rendering or prerendered application pages
- Analytics, behavioral tracking, or advertising technology
- Generated social image cards for individual notes
- Query-string note sharing
- Non-English launch translations
- Broad grape, region, food-pairing, or service encyclopedias

## Architecture Overview

Build the product as a client-rendered Nuxt 4 SPA. The academy and adaptive tasting workflow share one component and design foundation. Static, versioned domain data drives SAT fields, terminology, aroma selection, conditional rules, validation, and narrative generation without coupling those rules to Vue components.

Pinia owns transient tasting state. A repository port isolates session recovery from browser storage. A versioned share codec maps complete tastings to compact URL-fragment payloads. Pure TypeScript modules implement domain rules, validation, generation, and encoding so tests can run without Nuxt where browser integration is not required.

## Architecture Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Rendering | Nuxt SPA with `ssr: false` | Browser storage and the interactive workflow are explicit product requirements. |
| Hosting | Static output for externally managed Cloudflare Pages | The application requires no server runtime or repository deployment workflow. |
| Source root | Nuxt 4 `app/` directory | This matches the existing scaffold. |
| State | Pinia for tasting and preference stores | The workflow spans routes and needs explicit, testable state transitions. |
| Domain logic | Framework-independent TypeScript modules | SAT rules, completion, prose, and sharing remain independently testable. |
| SAT data | Stable IDs plus localization keys in versioned modules | Official values remain separate from presentation and future translations. |
| Localization | `@nuxtjs/i18n` with unprefixed English default | The launch remains English while all user-facing text is localization-ready. |
| Styling | Tailwind CSS 4 through `@tailwindcss/vite` | The project needs a mobile-first token system without a large UI framework. |
| Visual direction | Editorial cellar style with burgundy, parchment, sage, ink, and restrained radial motifs | The product should look distinct from a generic dashboard. |
| Fonts | Bundled variable Fontsource packages | Local fonts support privacy and offline use. |
| Forms | Schema-driven SAT field rendering | A field definition controls labels, choices, cardinality, help, and applicability. |
| Conditional logic | Pure applicability functions | Business rules do not spread across Vue templates. |
| Aroma interfaces | One taxonomy and selection set for hierarchy and wheel | Both interfaces remain equivalent and synchronized. |
| Wheel rendering | Deterministic SVG geometry from ordered taxonomy | Geometry is responsive, repeatable, and testable. |
| Validation | Zod at persistence/share boundaries; domain functions in the workflow | Untrusted browser data is parsed strictly while routine completion remains domain-specific. |
| Draft persistence | `sessionStorage` for locally authored unfinished drafts only | Refresh recovery works without durable history. |
| Preferences | `localStorage` for theme and aroma-view preference only | Preferences contain no tasting note data. |
| Share payload | Canonical JSON DTO, LZ compression, base64url, `#note=v1.<payload>` | The link is compact, versioned, and excluded from HTTP requests. |
| Shared-note isolation | Imported drafts use `source: 'shared'` and never enter draft persistence | Opening a link cannot create recovered note state. |
| Share size | Maximum final fragment length of 8,000 characters | The UI fails clearly before creating impractical links. |
| Note generation | Pure section builders plus localized templates and `Intl.ListFormat` | Output is deterministic, grammatical, and translation-ready. |
| PWA | `@vite-pwa/nuxt` generated service worker with user-controlled updates | The app supports repeat-visit offline use without interrupting active tastings. |
| SEO | Semantic routes, route metadata, canonical URLs, sitemap, robots, and social defaults | These are the useful SPA-compatible discovery measures. |
| Academy content | Typed English content modules rendered by reusable blocks | Content remains reviewable without a CMS or runtime fetch. |
| Testing | Vitest unit and Nuxt projects plus focused Playwright/axe tests | Tests run at the lowest appropriate layer and cover browser-only contracts. |
| Analytics | None | Product requirement. |
| CI | Quality workflow only | Cloudflare owns deployment through its GitHub connection. |

## Current Repository Context

The repository is a minimal Nuxt starter:

```text
wine-tasting-notes/
├── app/
│   └── app.vue
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── test/
│   ├── nuxt/component.test.ts
│   └── unit/example.test.ts
├── nuxt.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
└── vitest.config.ts
```

Current versions and tools:

- Nuxt 4.5.2
- Vue 3.5.x
- Vue Router 5.x
- pnpm 11.24.0
- Vitest 4.1.11
- `@nuxt/test-utils` 4.2.0
- Vue Test Utils 2.5.0
- happy-dom 20.12.0
- V8 coverage provider

The repository has no established pages, layouts, components, stores, composables, domain modules, styles, content system, end-to-end tests, linting, CI, or deployment files. Generated `.nuxt/`, `.output/`, `coverage/`, and `node_modules/` directories remain outside source control.

## Coding Conventions

- Vue components and TypeScript types use PascalCase.
- Functions, composables, variables, and Pinia store IDs use camelCase.
- Route files and directories use kebab-case.
- TypeScript uses two-space indentation, single quotes, and trailing commas.
- Vue components use `<script setup lang="ts">`.
- Nuxt framework APIs may use auto-imports. Domain modules, schemas, ports, and data use explicit imports.
- Domain IDs are stable, lowercase, dot-separated values such as `nose.intensity.medium-plus`.
- Components and generators use translation keys rather than hard-coded user-facing strings.
- Pure domain modules do not import Vue, Nuxt, Pinia, DOM, navigation, or browser storage APIs.
- Browser behavior sits behind explicit ports or focused client composables.
- Completion state is derived from answers and definitions, not persisted.
- Shared-note imports remain isolated from editable local drafts.
- Native elements are preferred. Custom controls expose accessible names, state, focus, and keyboard behavior.
- Comments explain only non-obvious geometry, migration, or browser behavior.

## Dependency Baseline

Required runtime additions:

- `pinia`
- `@pinia/nuxt`
- `@nuxtjs/i18n`
- `@vite-pwa/nuxt`
- `zod`
- `lz-string`
- `@fontsource-variable/manrope`
- `@fontsource-variable/newsreader`
- `@nuxtjs/sitemap`
- `@nuxtjs/robots`

Required styling and build additions:

- `tailwindcss`
- `@tailwindcss/vite`

Required quality additions:

- `@nuxt/eslint`
- `eslint`
- `typescript`
- `vue-tsc`
- `@testing-library/vue`
- `@playwright/test`
- `@axe-core/playwright`

Node 22 LTS is the runtime baseline. `package.json`, `.nvmrc`, and CI must agree on the major version.

## Domain Contracts

### Tasting Draft

```ts
interface TastingDraft {
  schemaVersion: 1
  source: 'local' | 'shared'
  createdAt: string
  updatedAt: string
  currentSection: TastingSectionId
  identity: {
    wineName: string
    vintage: string
    wineKind: 'still' | 'sparkling' | 'fortified'
  }
  appearance: {
    clarityId: string | null
    intensityId: string | null
    colourId: string | null
    otherObservations: string
  }
  nose: {
    conditionId: string | null
    faultIds: string[]
    intensityId: string | null
    developmentId: string | null
    aromaIds: string[]
    otherAromas: string[]
  }
  palate: {
    sweetnessId: string | null
    acidityId: string | null
    tanninId: string | null
    alcoholId: string | null
    bodyId: string | null
    mousseId: string | null
    flavourIntensityId: string | null
    flavourIds: string[]
    otherFlavours: string[]
    finishId: string | null
  }
  conclusions: {
    qualityId: string | null
    readinessId: string | null
  }
}
```

Draft validation rules:

- `wineName` is optional, trimmed, and limited to 120 characters.
- `vintage` is optional, trimmed, and limited to 20 characters. It is not forced to a numeric year.
- `wineKind` is required because it controls field applicability.
- Every option and aroma ID must exist in versioned data.
- Free-text descriptors are trimmed, deduplicated case-insensitively, limited to 12 entries, and limited to 80 characters each.
- Empty optional values do not enter generated prose or share payloads.
- `mousseId` applies only to sparkling wine.
- `tanninId` follows the approved SAT applicability rules.
- `faultIds` apply only when nose condition is unclean.
- A controlling answer change clears answers that become hidden.
- Section completion counts only required applicable fields.

### SAT Field Definition

```ts
interface SatFieldDefinition {
  id: string
  sectionId: TastingSectionId
  labelKey: string
  promptKey: string
  helpKey?: string
  control: 'single' | 'multi' | 'text-list'
  required: boolean
  optionIds?: string[]
  applicabilityRuleId?: ApplicabilityRuleId
}
```

### Aroma Node

```ts
interface AromaNode {
  id: string
  parentId: string | null
  kind: 'family' | 'category' | 'descriptor'
  labelKey: string
  order: number
  colourToken: string
}
```

Aroma rules:

- IDs remain stable across translations.
- Every non-root node references an existing parent.
- Sibling order is unique and deterministic.
- Only nodes designated selectable may enter aroma or flavour selections.
- Hierarchy and wheel components consume the same collection and emit the same IDs.
- Nose-to-palate suggestions never copy values automatically.

### Generated Note

```ts
interface GeneratedTastingNote {
  title: string
  sections: Array<{
    id: TastingSectionId
    heading: string
    text: string
  }>
  plainText: string
}
```

### Shared Note Version 1

```ts
interface SharedNoteV1 {
  v: 1
  i: {
    n?: string
    y?: string
    k: 's' | 'p' | 'f'
  }
  a: {
    c?: string
    i?: string
    o?: string
    x?: string
  }
  n: {
    c?: string
    f?: string[]
    i?: string
    d?: string
    a?: string[]
    x?: string[]
  }
  p: {
    s?: string
    a?: string
    t?: string
    l?: string
    b?: string
    m?: string
    i?: string
    f?: string[]
    x?: string[]
    e?: string
  }
  q: {
    q?: string
    r?: string
  }
}
```

Encoding pipeline:

1. Validate and map the complete draft to `SharedNoteV1`.
2. Serialize canonical JSON in fixed key order.
3. Compress the serialized content with `lz-string`.
4. Encode the compressed value as unpadded base64url.
5. Prefix it with `#note=v1.`.
6. Reject a final fragment longer than 8,000 characters.

Decoding reverses the process, rejects extra schema keys, validates every identifier, and marks the result as `source: 'shared'`.

## Core Modules and Responsibilities

| Module | Input | Output | Responsibility |
| --- | --- | --- | --- |
| `satV1Sections` | None | `SatSectionDefinition[]` | Canonical field definitions and order. |
| `satV1Aromas` | None | `AromaNode[]` | Canonical aroma and flavour hierarchy. |
| `satV1Provenance` | None | `SatProvenance` | Source version, permission reference, attribution, and review date. |
| `getApplicableFields` | Draft and definitions | Applicable definitions | Evaluate conditional visibility. |
| `validateSection` | Section ID and draft | Validation result | Report missing or invalid applicable answers. |
| `getSectionCompletion` | Section ID and draft | Completion counts | Derive section progress. |
| `createEmptyDraft` | Optional clock | `TastingDraft` | Create a version 1 local draft. |
| `sanitizeDraft` | Unknown value | Parsed draft or typed error | Reject unknown values and clear stale hidden answers. |
| `generateTastingNote` | Complete draft and translator | Generated note | Produce localized narrative sections and plain text. |
| `encodeSharedNote` | Complete draft | Fragment or typed error | Produce the versioned URL fragment. |
| `decodeSharedNote` | Fragment | Shared draft or typed error | Validate and import shared note data. |
| `TastingStore` | User actions and restored draft | Reactive draft | Own editable workflow state. |
| `PreferencesStore` | Theme and view actions | Reactive preferences | Own non-note browser preferences. |
| `SessionDraftRepository` | Draft | Read/write/remove result | Abstract session recovery. |
| `ClipboardPort` | Text | Copy result | Abstract clipboard operations. |
| `NativeSharePort` | Share data | Share result | Abstract Web Share operations. |

## Component Catalog

| Component | Input | Output | Responsibility |
| --- | --- | --- | --- |
| `useDraftPersistence` | Tasting store and draft repository | Restore status and cleanup handle | Restore and observe local draft changes. |
| `useSharedNote` | Current route fragment | Decoded shared-note state | Decode a shared link without entering draft persistence. |
| `usePageMetadata` | Page metadata | Nuxt head entries | Apply title, description, canonical, and social metadata. |
| `useTheme` | Preferences store and system-theme port | Applied theme state | Synchronize the selected theme with the document and system preference. |
| `useOnlineStatus` | Browser connection events | Reactive connection state | Report online and offline transitions. |
| `AppHeader` | Current route | Header navigation | Present the brand, primary navigation, tasting CTA, and theme toggle. |
| `AppFooter` | None | Footer navigation | Present academy, legal, source, and product links. |
| `OfflineStatus` | Connection state | Live status message | Announce offline and restored states. |
| `PwaUpdatePrompt` | Service-worker state | Update action | Let the user activate a waiting worker safely. |
| `AcademyArticle` | Typed article | Semantic article | Render article blocks, table of contents, sources, and CTA. |
| `GlossaryList` | Glossary entries and query | Filtered definitions | Provide client-side accessible glossary search. |
| `FaqList` | FAQ entries | Disclosure list | Render keyboard-operable questions and answers. |
| `WorkedExampleCard` | Worked-example fixture | Example presentation | Show structured observations beside generated prose. |
| `TastingShell` | Section and completion state | Workflow frame | Present progress, navigation, save state, and reset. |
| `TastingStepper` | Section completion map | Navigation events | Expose canonical sequence and incomplete/complete state without color alone. |
| `WineIdentityForm` | Draft identity | Validated identity update | Collect optional name/vintage and required wine kind. |
| `SatFieldRenderer` | Field definition and current value | Typed answer update | Select the correct field control from schema metadata. |
| `SingleChoiceField` | Single-select definition and value | Selected option ID | Render an accessible single-choice field. |
| `MultiChoiceField` | Multi-select definition and values | Selected option IDs | Render accessible checkbox choices with limits. |
| `TextObservationField` | Text definition and value | Sanitized text values | Collect limited optional observations. |
| `SectionValidationSummary` | Section validation result | Field-focus request | Link incomplete items to their controls. |
| `SectionReviewCard` | Section definitions and answers | Edit request | Present localized human-readable review data. |
| `AromaPicker` | Taxonomy and selected IDs | Selection and view changes | Coordinate hierarchy, search, wheel, and selected chips. |
| `AromaSearch` | Taxonomy and query | Contextual matches | Search normalized labels with ancestor context. |
| `AromaHierarchy` | Taxonomy, focus node, and selected IDs | Focus and selection changes | Provide the first-class browse and drill-down interaction. |
| `AromaWheel` | Taxonomy, focus node, geometry, and selected IDs | Focus and selection changes | Present the responsive deterministic SVG view. |
| `SelectedAromas` | Selected IDs | Remove events | Show selected terms with category context. |
| `GeneratedNoteView` | Generated note | Rendered note | Present title, section paragraphs, and accessible text structure. |
| `ShareActions` | Generated text and complete draft | Copy, native-share, and link actions | Coordinate supported sharing mechanisms. |
| `SharePrivacyDialog` | Link creation request and encoded size state | Confirm or cancel | Explain readable-link and platform-retention risks. |
| `SharedNoteView` | Decoded shared draft and generated note | Start-new action | Present a read-only import without recovery persistence. |

## Validators

| Validator | Input | Rules |
| --- | --- | --- |
| `TastingDraftSchema` | Restored session value | Schema version, limits, enums, known IDs, strict keys, and valid combinations. |
| `SharedNoteV1Schema` | Decompressed fragment value | Strict compact DTO, payload limits, known IDs, and valid combinations. |
| `validateSection` | Draft and section ID | Required applicable values and selection limits. |
| `validateDraftForGeneration` | Full draft | Complete applicable sections and no stale or unknown answers. |
| `validateAromaTaxonomy` | Aroma node collection | Unique IDs, valid parents, no cycles, sibling order, and selectable-node rules. |
| `validateSatDefinitions` | Fields and options | Unique IDs, valid option and translation references, and registered applicability rules. |
| `validateArticleRegistry` | Academy content | Unique slugs, required metadata, sources, review dates, CTA routes, and known block types. |

## External Boundaries

| Interface | Implementation | Browser system | Purpose |
| --- | --- | --- | --- |
| `SessionDraftRepository` | `BrowserSessionDraftRepository` | `sessionStorage` | Recover one unfinished local draft during the current session. |
| `PreferenceRepository` | `BrowserPreferenceRepository` | `localStorage` | Store theme and aroma-view preference only. |
| `ClipboardPort` | `BrowserClipboardAdapter` | Clipboard API and document fallback | Copy generated plain text. |
| `NativeSharePort` | `BrowserNativeShareAdapter` | Web Share API | Report supported, shared, cancelled, or failed outcomes. |
| `SystemThemePort` | `BrowserSystemThemeAdapter` | `matchMedia` | Observe the system color preference. |
| Service worker boundary | `@vite-pwa/nuxt` generated worker | Cache and Service Worker APIs | Install and update offline assets. |

## Public Routes

| Route | Purpose | Failure behavior |
| --- | --- | --- |
| `/` | Product homepage | Client error boundary. |
| `/academy` | Academy landing page | Client error boundary. |
| `/academy/how-to-taste` | Tasting technique guide | Unknown slug renders client 404. |
| `/academy/setup` | Setup and glassware guide | Unknown slug renders client 404. |
| `/academy/sat` | SAT overview | Unknown slug renders client 404. |
| `/academy/appearance` | Appearance guide | Unknown slug renders client 404. |
| `/academy/nose` | Nose guide | Unknown slug renders client 404. |
| `/academy/palate` | Palate guide | Unknown slug renders client 404. |
| `/academy/conclusions` | Conclusions guide | Unknown slug renders client 404. |
| `/academy/aromas` | Aroma and flavour education | Unknown slug renders client 404. |
| `/academy/faults` | Wine faults guide | Unknown slug renders client 404. |
| `/academy/glossary` | Searchable glossary | Unknown slug renders client 404. |
| `/academy/examples` | Worked examples | Unknown slug renders client 404. |
| `/faq` | Frequently asked questions | Client error boundary. |
| `/about` | Product and methodology | Client error boundary. |
| `/privacy` | Privacy disclosure | Client error boundary. |
| `/terms` | Terms, attribution, and disclaimer | Client error boundary. |
| `/tasting` | Start or recover a tasting | Invalid recovery data is discarded with notice. |
| `/tasting/appearance` | Appearance form | Missing draft redirects to `/tasting`. |
| `/tasting/nose` | Nose and aroma form | Missing draft redirects to `/tasting`. |
| `/tasting/palate` | Palate and flavour form | Missing draft redirects to `/tasting`. |
| `/tasting/conclusions` | Conclusions form | Missing draft redirects to `/tasting`. |
| `/tasting/review` | Full review and edit links | Validation blocks note generation, not section navigation. |
| `/tasting/note` | Generated note and sharing | Incomplete draft redirects to review. |
| `/tasting/shared#note=v1...` | Read-only shared note | Typed malformed, version, and size errors. |

## Data Flows

### Local Tasting

1. `/tasting` asks `SessionDraftRepository` for a current-session draft.
2. Restored data passes through the strict draft schema.
3. Invalid data is removed and the UI reports that recovery failed.
4. Starting a tasting creates a local draft after wine-kind selection.
5. Section pages obtain definitions from versioned SAT data.
6. Pure applicability rules determine which fields the page renders.
7. Store actions update answers and clear values that become inapplicable.
8. `useDraftPersistence` writes valid local changes to `sessionStorage`.
9. Section validation provides completion guidance without trapping navigation.
10. Review derives labels and completion from canonical data.
11. Full validation gates note generation.
12. The note generator derives prose from the draft.
13. Completion or explicit reset removes the session draft.

### Aroma Selection

1. `AromaPicker` receives the canonical taxonomy and selected IDs.
2. Search, hierarchy, and wheel derive their presentation from the same ordered tree.
3. Either view emits a canonical aroma ID.
4. The store owns the selected ID set.
5. Wheel drill-down changes presentation focus only.
6. Palate suggestions derive from nose aroma IDs.
7. Suggested flavour IDs are added only after explicit user acceptance.

### Shared Link Creation

1. The user selects “Create private link.”
2. A confirmation dialog explains fragment readability and platform retention.
3. The share codec validates, maps, compresses, encodes, and checks final length.
4. The resulting URL targets `/tasting/shared#note=v1.<payload>`.
5. The user copies the URL or invokes native sharing.
6. The application creates no query parameter, API request, server record, or analytics event.

### Shared Link Opening

1. `/tasting/shared` reads the fragment on the client.
2. The decoder checks the prefix and version before decompression.
3. A strict schema and canonical data validate all values.
4. The mapper creates a `source: 'shared'` draft.
5. The page renders observations and generated prose.
6. Shared state never enters session draft persistence.
7. “Taste this wine yourself” starts an empty local draft only after explicit action.

### Academy Content

1. `/academy/[slug]` validates the slug against the typed article registry.
2. Unknown slugs produce the client 404 state.
3. The route applies title, description, canonical, and social metadata.
4. `AcademyArticle` renders typed semantic blocks without raw HTML.
5. Article metadata supplies sources, review date, and contextual tool calls to action.

### Offline Lifecycle

1. The first successful online visit installs and caches the generated shell and local assets.
2. Fingerprinted local assets use cache-first behavior.
3. Navigation fallback serves the SPA shell for client routes.
4. The app announces offline state but keeps local tasting available.
5. A new deployment triggers a user-controlled update prompt.
6. The application needs no remote fonts, scripts, content, or APIs at runtime.

## Error Contracts

| Error | Code | Trigger |
| --- | --- | --- |
| `InvalidRecoveredDraft` | `draft.invalid` | Session data fails schema or ID validation. |
| `DraftStorageUnavailable` | `draft.storage-unavailable` | The browser blocks or throws on session storage access. |
| `MissingTastingDraft` | `draft.missing` | A workflow route opens without a local draft. |
| `IncompleteTasting` | `tasting.incomplete` | Note generation starts before required applicable fields are complete. |
| `InvalidSatDefinition` | `sat.definition-invalid` | Static SAT data contains invalid or duplicate references. |
| `InvalidAromaTaxonomy` | `sat.aroma-taxonomy-invalid` | Aroma data contains invalid parents, duplicate IDs, or cycles. |
| `InvalidSharedPayload` | `share.invalid-payload` | Fragment decoding or strict schema validation fails. |
| `UnsupportedShareVersion` | `share.unsupported-version` | The fragment version is not supported. |
| `SharePayloadTooLarge` | `share.payload-too-large` | The final encoded fragment exceeds 8,000 characters. |
| `UnknownSharedIdentifier` | `share.unknown-identifier` | A shared value references an unknown canonical ID. |
| `ClipboardUnavailable` | `clipboard.unavailable` | No supported clipboard path exists. |
| `CopyFailed` | `clipboard.copy-failed` | The clipboard operation rejects. |
| `NativeShareUnavailable` | `share.native-unavailable` | Web Share is unsupported. |
| `NativeShareCancelled` | `share.native-cancelled` | The user cancels the operating-system share sheet. |
| `NativeShareFailed` | `share.native-failed` | Web Share rejects for another reason. |
| `UnknownAcademyArticle` | `content.article-not-found` | An academy slug is not registered. |
| `PwaUpdateFailed` | `pwa.update-failed` | An updated service worker cannot activate. |

Domain and boundary functions return discriminated results such as `{ ok: true, value } | { ok: false, error }`. UI components translate error codes into localized actions. The application must not render malformed data or log tasting payload contents.

## Target Package Structure

The issue backlog introduces this structure incrementally. An issue should create only the files needed for its own acceptance criteria.

```text
wine-tasting-notes/
├── .github/workflows/ci.yml
├── app/
│   ├── assets/css/main.css
│   ├── components/
│   │   ├── academy/
│   │   ├── aroma/
│   │   ├── result/
│   │   ├── shell/
│   │   ├── tasting/
│   │   └── ui/
│   ├── composables/
│   │   ├── useDraftPersistence.ts
│   │   ├── useOnlineStatus.ts
│   │   ├── usePageMetadata.ts
│   │   ├── useSharedNote.ts
│   │   └── useTheme.ts
│   ├── content/en/
│   ├── data/sat/v1/
│   │   ├── aromas.ts
│   │   ├── options.ts
│   │   ├── provenance.ts
│   │   └── sections.ts
│   ├── domain/
│   │   ├── academy/
│   │   ├── sat/
│   │   └── tasting/
│   ├── i18n/locales/en.json
│   ├── layouts/default.vue
│   ├── middleware/
│   ├── pages/
│   │   ├── academy/
│   │   └── tasting/
│   ├── plugins/
│   ├── ports/
│   ├── repositories/
│   ├── services/
│   ├── stores/
│   ├── app.vue
│   └── error.vue
├── docs/
│   ├── content-governance.md
│   └── legal/wset-permission.md
├── public/
│   ├── icons/
│   ├── favicon.ico
│   └── social-card.png
├── test/
│   ├── e2e/
│   ├── fixtures/
│   ├── nuxt/
│   └── unit/
├── .env.example
├── .nvmrc
├── eslint.config.mjs
├── nuxt.config.ts
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
├── README.md
├── tsconfig.json
└── vitest.config.ts
```

## Testing Standard

Every pull request that changes executable code must add or update tests. A pull request is incomplete when its behavior is covered only by manual verification.

### Test Layers

- Use `test/unit/**/*.test.ts` with the Vitest `unit` project for pure domain functions, schemas, repositories with injected fakes, geometry, adapters, and data contracts.
- Use `test/nuxt/**/*.test.ts` with the Vitest `nuxt` project for Vue components, composables that depend on Nuxt, Pinia integration, route middleware, pages, plugins, and localized rendering.
- Use `mountSuspended` from `@nuxt/test-utils/runtime` for components and pages that need the Nuxt application context.
- Use `renderSuspended` with `@testing-library/vue` when role, label, name, and visible-text queries express the behavior more clearly than wrapper APIs.
- Use `mockNuxtImport` and Nuxt test utilities for framework auto-imports. Do not mock Vue internals.
- Use `registerEndpoint` only if a test needs to prove that no real network call occurs. The production application must not add API endpoints.
- Use Playwright only for real-browser contracts: routing through generated output, browser storage lifetimes, URL fragments, service workers, native focus behavior, responsive layouts, and full keyboard workflows.
- Use `@axe-core/playwright` on representative complete page states. Axe supplements, but does not replace, keyboard and semantic assertions.
- Test observable behavior. Avoid snapshots of whole components. Snapshot only stable prose fixtures or deterministic geometry where a focused snapshot is useful.
- Use fake clocks and injected browser APIs rather than timing sleeps.
- Tests must not make network calls to third-party services.

### Coverage

Core modules under `app/domain/`, `app/repositories/`, and `app/services/` target at least 90 percent for lines, statements, functions, and branches. Presentational article prose is excluded from coverage calculations, but content registries and schemas remain tested.

### Required Commands

Each code pull request must pass the commands available at that point in the dependency graph. After the tooling foundation is complete, the standard set is:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm generate
```

Issues that add or alter browser-only behavior also run the relevant Playwright project. Release-gate issues run the complete suite:

```bash
pnpm test:e2e
```

## Global Definition of Done

Every issue and pull request must meet these conditions:

- The pull request implements one issue and names its stable issue ID.
- The implementation follows this architecture and does not expand product scope.
- New behavior includes tests at the lowest suitable layer.
- Vue, page, composable, middleware, or Pinia integration uses Nuxt test utilities.
- Browser-only contracts include focused Playwright coverage when unit or happy-dom tests cannot prove them.
- Accessibility behavior has semantic and keyboard assertions, not only visual checks.
- User-facing strings use localization keys.
- Tasting values use canonical IDs rather than display labels.
- No tasting data enters logs, analytics, query strings, `localStorage`, IndexedDB, cookies, or network requests.
- The pull request updates documentation when it changes a public contract, storage key, route, command, or architecture decision.
- Relevant lint, typecheck, tests, and production generation pass.
- The pull request does not commit generated `.nuxt/`, `.output/`, `coverage/`, or `node_modules/` content.
- The pull request does not add a Cloudflare deployment workflow.

# GitHub Issue Backlog

Issue IDs are stable dependency references. Create GitHub issues in the listed order, but parallelize issues when all named dependencies are complete.

## Foundation and Governance

### WT-001: Record WSET permission and source provenance

**Type:** Documentation and legal gate  
**Labels:** `legal`, `content`, `priority:critical`  
**Depends on:** None  

**Pull request outcome**

The repository contains an approved, auditable record of the permission and exact source used for official WSET Level 3 SAT material.

**Scope**

- Create `docs/legal/wset-permission.md`.
- Record evidence date and immutable evidence location.
- Record permitted territories, channels, languages, and modification terms.
- Record exact approved attribution, trademark spelling, link, disclaimer, and placement requirements.
- Record source title, edition or version, publication date, and access date.
- State whether evidence can be committed publicly or must be externally referenced.
- Do not commit unreviewed correspondence, personal data, or confidential material.

**Acceptance criteria**

- Public wording is copied exactly from approved terms.
- The source edition for SAT data is unambiguous.
- Official terms are identified as verbatim material.
- Sensitive evidence is redacted or referenced safely.
- A named owner records approval in the pull request.

**Tests**

- Documentation-only issue. No executable test is required.
- Markdown links and formatting must pass repository lint once that tooling exists.

---

### WT-002: Define content governance and editorial review

**Type:** Documentation  
**Labels:** `content`, `documentation`  
**Depends on:** WT-001  

**Pull request outcome**

The repository defines how official terminology and original educational content are authored, sourced, reviewed, corrected, and dated.

**Scope**

- Create `docs/content-governance.md`.
- Define editorial owner and legal/content reviewer responsibilities.
- Define citation, updated-date, and review-cadence rules.
- Define the boundary between verbatim official terms and original explanatory prose.
- Define correction and source-version update procedures.
- Define rules for worked examples and licensed/original text.

**Acceptance criteria**

- Every factual academy article requires sources, owner, reviewer, and review date.
- Official terms cannot be copy-edited without checking permission and source.
- Worked examples must be original or explicitly licensed.
- The update process covers both content and canonical SAT data.

**Tests**

- Documentation-only issue. No executable test is required.

---

### WT-003: Establish Node, lint, typecheck, and package scripts

**Type:** Tooling  
**Labels:** `foundation`, `tooling`  
**Depends on:** None  

**Pull request outcome**

Contributors and CI use one Node version and consistent lint, typecheck, and test commands.

**Scope**

- Set Node 22 in `.nvmrc` and `package.json` engines.
- Add `@nuxt/eslint`, ESLint, TypeScript, and `vue-tsc`.
- Create `eslint.config.mjs` using Nuxt's flat configuration.
- Add `lint`, `lint:fix`, `typecheck`, and `check` scripts.
- Keep pnpm 11.24.0 as the package manager.
- Update the lockfile.
- Document the commands in `README.md`.

**Acceptance criteria**

- `pnpm install --frozen-lockfile` works on Node 22.
- `pnpm lint` covers TypeScript and Vue source.
- `pnpm typecheck` uses Nuxt-generated types.
- Existing starter source passes lint and typecheck.
- `pnpm check` runs non-browser quality commands in a documented order.

**Tests**

- Preserve and run existing Vitest tests.
- Tooling configuration is verified by `pnpm lint`, `pnpm typecheck`, and `pnpm test`.

---

### WT-004: Configure client-only Nuxt application modules

**Type:** Application foundation  
**Labels:** `foundation`, `nuxt`  
**Depends on:** WT-003  

**Pull request outcome**

Nuxt runs as a static client-only application with the approved runtime modules installed and configured at their minimum viable settings.

**Scope**

- Set `ssr: false` in `nuxt.config.ts`.
- Add Pinia, Nuxt i18n, Tailwind 4 Vite integration, Zod, LZ String, local font packages, sitemap, robots, and PWA modules.
- Register `app/assets/css/main.css` as global CSS.
- Add `.env.example` with `NUXT_PUBLIC_SITE_URL`.
- Configure English as the default unprefixed locale.
- Keep PWA behavior disabled or minimal until WT-037.
- Do not add a server directory or Nitro endpoint.

**Acceptance criteria**

- `pnpm dev` starts the client-only app.
- `pnpm generate` creates `.output/public`.
- No application API or server handler exists.
- The generated app boots with JavaScript enabled.
- Missing optional site URL does not prevent local development.

**Tests**

- Replace the starter Nuxt test with a `mountSuspended` smoke test for `app.vue`.
- Assert that the route announcer and root application mount.
- Run `pnpm test:nuxt` and `pnpm generate`.

---

### WT-005: Restructure Vitest projects and add shared test fixtures

**Type:** Test foundation  
**Labels:** `testing`, `foundation`  
**Depends on:** WT-003, WT-004  

**Pull request outcome**

Vitest supports nested unit and Nuxt test suites with coverage focused on application code.

**Scope**

- Update `vitest.config.ts` to include nested `test/unit/**/*.test.ts` and `test/nuxt/**/*.test.ts` files.
- Add `@testing-library/vue` for Nuxt tests that benefit from `renderSuspended` and user-facing queries.
- Keep the node environment for pure units and Nuxt/happy-dom for application tests.
- Enable coverage only for the coverage command, not every normal test run.
- Configure focused coverage includes and excludes.
- Add `test/fixtures/` and typed fixture conventions.
- Remove placeholder arithmetic tests after replacement tests exist.
- Document when to use unit, Nuxt, and browser tests.

**Acceptance criteria**

- `pnpm test:unit`, `pnpm test:nuxt`, and `pnpm test:coverage` all work.
- Nested tests are discovered.
- Normal tests do not write coverage output.
- Coverage excludes generated, configuration, and article prose files.

**Tests**

- Add one nested pure unit fixture test.
- Add one nested Nuxt component test using `mountSuspended`.
- The issue validates itself by running all three Vitest scripts.

---

### WT-006: Add Playwright and axe browser-test foundation

**Type:** Test foundation  
**Labels:** `testing`, `e2e`, `accessibility`  
**Depends on:** WT-004, WT-005  

**Pull request outcome**

The repository can test generated SPA output in a real browser and run axe checks on representative pages.

**Scope**

- Add Playwright and `@axe-core/playwright`.
- Create `playwright.config.ts` using Nuxt preview/generated output.
- Add `test:e2e` and focused browser-test scripts.
- Create `test/e2e/smoke.spec.ts`.
- Configure desktop and mobile projects without duplicating every test.
- Configure trace and screenshot retention on failure.
- Do not require external network access during tests.

**Acceptance criteria**

- The smoke test loads `/` from generated output.
- The test asserts no serious or critical axe violations on the starter shell.
- Failure artifacts are available without retaining successful-run noise.
- Browser tests do not call third-party services.

**Tests**

- The Playwright smoke and axe checks are the required tests for this issue.
- Run `pnpm generate` followed by the focused browser-test command.

---

### WT-007: Add pull-request CI quality workflow

**Type:** CI  
**Labels:** `ci`, `foundation`  
**Depends on:** WT-003, WT-005, WT-006  

**Pull request outcome**

GitHub validates every pull request and default-branch update without deploying the application.

**Scope**

- Create `.github/workflows/ci.yml`.
- Use Node 22 and the package-manager version declared by the repository.
- Install with the frozen lockfile.
- Cache pnpm safely.
- Run lint, typecheck, Vitest, production generation, and Playwright smoke tests.
- Upload browser failure artifacts only when useful.
- Do not add Cloudflare credentials or deployment steps.

**Acceptance criteria**

- Workflow triggers on pull requests and default-branch pushes.
- Every command maps to a documented package script.
- Jobs fail when any quality command fails.
- The workflow has no deployment permissions or secrets.

**Tests**

- CI configuration must pass local action/schema lint if available.
- Run the same package commands locally before merge.

## Design System and Shared Application Shell

### WT-008: Define design tokens, local fonts, and global responsive styles

**Type:** Frontend foundation  
**Labels:** `frontend`, `design-system`  
**Depends on:** WT-004, WT-005  

**Pull request outcome**

The application has a tested global visual foundation for both themes and common viewport sizes.

**Scope**

- Define burgundy, parchment, sage, ink, status, border, focus, and surface tokens in `app/assets/css/main.css`.
- Bundle Newsreader for editorial headings and Manrope for body and interface text.
- Define typography, spacing, radii, shadows, content widths, and focus rings.
- Add reduced-motion behavior.
- Add visually hidden and safe-area utility patterns where Tailwind does not supply them.
- Do not build page-specific layouts.

**Acceptance criteria**

- Light and dark tokens meet WCAG AA contrast for normal text and controls.
- Font files load locally with no remote font request.
- Base styles avoid horizontal overflow at 320 px.
- Focus-visible styles remain visible in both themes.
- Reduced-motion users do not receive non-essential transitions.

**Tests**

- Add a Nuxt style-fixture component test that verifies token classes and semantic markup render.
- Add or update the Playwright smoke test to assert local font responses and 320 px overflow behavior.

---

### WT-009: Build accessible base UI components

**Type:** Component library  
**Labels:** `frontend`, `design-system`, `accessibility`  
**Depends on:** WT-008  

**Pull request outcome**

Feature pull requests can compose consistent accessible buttons, cards, dialogs, fieldsets, progress, notices, and skip links.

**Scope**

- Add `BaseButton.vue`, `BaseCard.vue`, `BaseDialog.vue`, `BaseFieldset.vue`, `BaseProgress.vue`, `InlineNotice.vue`, and `SkipLink.vue`.
- Prefer native button, progress, fieldset, legend, and dialog semantics where support permits.
- Define variants through typed props.
- Implement disabled, busy, error, and focus states.
- Implement dialog focus trapping, Escape dismissal, and trigger focus restoration.

**Acceptance criteria**

- Components expose no product-specific strings.
- Buttons retain native keyboard activation.
- Dialogs expose name, modal state, focus containment, Escape behavior, and focus restoration.
- Progress includes a text alternative.
- Fieldsets associate error and help text correctly.
- Touch targets are at least 44 by 44 CSS pixels for interactive controls.

**Tests**

- Add focused Nuxt tests using `mountSuspended` for each public component contract.
- Use role and accessible-name assertions.
- Test keyboard activation and dialog focus lifecycle.
- Run axe against a component fixture in Playwright.

---

### WT-010: Build responsive application shell and navigation

**Type:** Frontend shell  
**Labels:** `frontend`, `navigation`, `accessibility`  
**Depends on:** WT-008, WT-009  

**Pull request outcome**

All pages render in a branded responsive layout with keyboard-accessible navigation and route announcements.

**Scope**

- Add the default layout, app header, footer, logo, primary navigation, and mobile navigation.
- Retain `NuxtRouteAnnouncer`.
- Add a skip link and `main` focus target.
- Add academy, tasting tool, about, FAQ, privacy, and terms links.
- Close mobile navigation after route changes.
- Add `app/error.vue` for client error states.

**Acceptance criteria**

- Navigation works from 320 px through wide desktop.
- All navigation is keyboard-operable.
- Mobile navigation closes on selection and Escape.
- Focus reaches main content through the skip link.
- Header and footer links reflect the approved route map.
- Unknown pages render a useful error state.

**Tests**

- Add Nuxt tests for default layout, active links, mobile menu, Escape, and route-change closure.
- Add a Playwright keyboard smoke test at mobile and desktop viewports.

---

### WT-011: Establish English localization keys and translation contracts

**Type:** Localization foundation  
**Labels:** `i18n`, `frontend`, `testing`  
**Depends on:** WT-004, WT-005  

**Pull request outcome**

Application code can render English UI and domain labels through stable localization keys.

**Scope**

- Create `app/i18n/locales/en.json`.
- Define key namespaces for shell, academy, SAT, tasting, validation, note generation, sharing, legal, offline, and errors.
- Add a typed or test-validated translation-key lookup contract.
- Configure localized list formatting.
- Add a repository rule that components do not hard-code product strings.

**Acceptance criteria**

- English is the default locale without a URL prefix.
- Missing keys are visible in development and fail translation contract tests.
- Translation keys do not embed canonical option IDs as labels.
- Generated prose can receive a translator and list formatter without importing Nuxt.

**Tests**

- Add unit tests that collect registered keys and detect duplicates or missing references.
- Add a Nuxt test that switches the test locale context and renders a translated fixture component.

---

### WT-012: Implement theme and non-note preference storage

**Type:** Browser preference feature  
**Labels:** `frontend`, `state`, `privacy`  
**Depends on:** WT-008, WT-009, WT-011  

**Pull request outcome**

Users can choose system, light, or dark theme, and the application stores only approved non-note preferences.

**Scope**

- Add `PreferenceRepository` and `SystemThemePort`.
- Implement browser adapters with injected `Storage` and `matchMedia` dependencies.
- Add `PreferencesStore`, `useTheme`, initialization plugin, and `ThemeToggle.vue`.
- Reserve a preference field for hierarchy/wheel view.
- Use one documented `localStorage` key.
- Handle unavailable or malformed storage.

**Acceptance criteria**

- System preference applies until a user chooses an explicit theme.
- Explicit theme survives a new browser session.
- The only stored values are theme and aroma-view preference.
- Storage errors do not prevent rendering or theme changes.
- Initial theme application avoids a disruptive visible flash.

**Tests**

- Unit-test repository and system-theme adapters with injected fakes.
- Nuxt-test store initialization, toggle rendering, malformed values, and storage failure.
- Playwright-test preference persistence across page reloads.

## Canonical SAT Domain

### WT-013: Define SAT domain types and canonical option registry

**Type:** Domain data  
**Labels:** `domain`, `data`, `testing`  
**Depends on:** WT-001, WT-005, WT-011  

**Pull request outcome**

The repository contains typed, versioned canonical SAT sections and approved options, excluding the aroma hierarchy.

**Scope**

- Create `app/domain/sat/types.ts`.
- Create `app/data/sat/v1/options.ts`, `sections.ts`, and `provenance.ts`.
- Transcribe the approved user-supplied Appearance, Nose, Palate, and Conclusions terms.
- Assign stable dot-separated IDs.
- Store label, prompt, help, order, control, and selection-cardinality metadata.
- Add source expectations in `test/fixtures/sat-source-expectations.ts`.
- Exclude applicability behavior from this issue.

**Acceptance criteria**

- Every approved non-aroma term appears exactly once where intended.
- Official wording matches the recorded source.
- IDs are unique and independent of English labels.
- Every field references existing options and localization keys.
- Provenance records schema and source version.
- The source-expectation fixture detects omission and accidental duplication.

**Tests**

- Unit-test uniqueness, order, option references, translation keys, and expected counts.
- Test that data modules do not import Vue or Nuxt.

---

### WT-014: Define and validate the aroma and flavour taxonomy

**Type:** Domain data  
**Labels:** `domain`, `data`, `aroma-wheel`, `testing`  
**Depends on:** WT-001, WT-005, WT-011  

**Pull request outcome**

The complete approved aroma and flavour lexicon exists as one ordered, validated hierarchy.

**Scope**

- Create `app/data/sat/v1/aromas.ts`.
- Add aroma-specific types to `app/domain/sat/types.ts`.
- Transcribe families, categories, and descriptors from the approved source.
- Assign stable IDs, parents, sibling order, selectable state, and color tokens.
- Implement taxonomy validation in `app/domain/sat/definition-validation.ts`.
- Extend source-expectation fixtures with counts and key paths.

**Acceptance criteria**

- Every approved descriptor is represented exactly once where intended.
- IDs are unique and parent references are valid.
- The graph has no cycle.
- Sibling ordering is deterministic.
- Selectable nodes are explicitly identified.
- Every node has an English translation key.

**Tests**

- Unit-test duplicates, missing parents, cycles, sibling order, selectable nodes, translation keys, and expected counts.
- Include mutation-style negative fixtures that prove each validator can fail.

---

### WT-015: Implement SAT applicability and stale-answer clearing

**Type:** Domain logic  
**Labels:** `domain`, `testing`  
**Depends on:** WT-013  

**Pull request outcome**

Pure domain rules determine which SAT fields apply and which stale answers must be removed after controlling values change.

**Scope**

- Create `app/domain/sat/applicability.ts`.
- Define registered applicability rule IDs.
- Implement wine-kind, mousse, tannin, and nose condition/fault rules from the approved definitions.
- Implement `getApplicableFields`.
- Implement a pure function that clears or reports stale hidden answers.
- Do not add Vue components or stores.

**Acceptance criteria**

- Every conditional definition references a registered rule.
- Sparkling mousse and fault behavior match approved rules.
- Tannin applicability is explicit and testable.
- Changing a controlling answer produces a deterministic stale-answer result.
- Unknown rule IDs fail static validation.

**Tests**

- Unit-test each rule with applicable and inapplicable cases.
- Add table-driven tests for still, sparkling, fortified, clean, and faulty drafts.
- Test chained changes that make existing answers stale.

---

### WT-016: Implement section validation and completion

**Type:** Domain logic  
**Labels:** `domain`, `validation`, `testing`  
**Depends on:** WT-013, WT-015  

**Pull request outcome**

The application can derive valid, incomplete, and complete states for each SAT section and the full tasting.

**Scope**

- Create `app/domain/sat/completion.ts`.
- Implement `validateSection`, `getSectionCompletion`, and `validateDraftForGeneration` contracts.
- Validate required applicable fields, selection limits, and known values.
- Return field IDs and localized error codes rather than display strings.
- Exclude optional unanswered fields from incomplete counts.

**Acceptance criteria**

- Completion derives from definitions and draft values.
- Hidden fields do not affect completion.
- Missing required fields return stable field-specific errors.
- Invalid known/unknown selections are distinguished.
- Full validation reports every incomplete section in canonical order.

**Tests**

- Unit-test empty, partial, complete, conditional, stale, and invalid drafts.
- Add table-driven tests for every section and supported wine kind.

---

### WT-017: Implement deterministic aroma tree and wheel geometry utilities

**Type:** Domain presentation logic  
**Labels:** `domain`, `aroma-wheel`, `testing`  
**Depends on:** WT-014  

**Pull request outcome**

Framework-independent utilities provide normalized search, tree navigation, breadcrumbs, and deterministic radial geometry.

**Scope**

- Add aroma selectors and tree helpers under `app/domain/sat/`.
- Implement case- and diacritic-normalized search with hierarchy context.
- Implement child, ancestor, breadcrumb, and canonical-order helpers.
- Implement pure ring/arc geometry for ordered wheel segments.
- Keep SVG rendering outside this issue.

**Acceptance criteria**

- Search returns canonical IDs and ancestor context.
- Tree helpers handle root, intermediate, and selectable nodes.
- Geometry is deterministic for fixed taxonomy and dimensions.
- Segment angles cover the expected circle without overlap beyond floating-point tolerance.
- Geometry does not depend on DOM measurement APIs.

**Tests**

- Unit-test search normalization, ordering, breadcrumbs, and empty results.
- Unit-test geometry boundaries, focus roots, stable ordering, and representative snapshots.
- Prefer numeric assertions over broad snapshots.

## Academy Content System

### WT-018: Define typed academy content schemas and registry

**Type:** Content architecture  
**Labels:** `academy`, `content`, `testing`  
**Depends on:** WT-002, WT-005, WT-011  

**Pull request outcome**

Academy content has a typed block format, validated metadata, and fixed route registry without unsafe raw HTML.

**Scope**

- Create `app/domain/academy/types.ts` and `article-schema.ts`.
- Define metadata for slug, title, description, owner, reviewer, sources, review date, and contextual CTA.
- Define typed paragraph, heading, list, callout, figure, definition, and table blocks.
- Create the English article registry.
- Implement registry validation.
- Do not author full launch articles in this issue.

**Acceptance criteria**

- Duplicate slugs fail validation.
- Every article requires source and review metadata under governance rules.
- Unknown block types fail validation.
- Raw HTML is not a supported block.
- Registry order is deterministic.

**Tests**

- Unit-test valid and invalid article metadata, duplicate slugs, unknown blocks, and registry order.
- Test that every registered CTA targets a known route contract.

---

### WT-019: Build homepage and academy landing page

**Type:** Public frontend  
**Labels:** `frontend`, `academy`  
**Depends on:** WT-009, WT-010, WT-011, WT-018  

**Pull request outcome**

Visitors can understand the product, distinguish education from the tasting tool, and navigate into both surfaces.

**Scope**

- Build `app/pages/index.vue` and `app/pages/academy/index.vue`.
- Add a product hero, process preview, academy topic cards, privacy/offline reassurance, and “Start tasting” CTA.
- Build reusable `AcademyHero.vue` where appropriate.
- Use temporary registry metadata for article links until content issues fill them.
- Do not add broad editorial content.

**Acceptance criteria**

- Homepage clearly states the product value without claiming WSET affiliation.
- Education and tasting-tool calls to action are distinct.
- Academy landing page links all launch topics.
- Layout works at 320 px and desktop widths.
- Heading hierarchy and landmarks are semantic.

**Tests**

- Nuxt-test both pages with `mountSuspended` and route context.
- Assert headings, landmarks, route links, and CTA accessible names.
- Add focused mobile and desktop Playwright navigation checks.

---

### WT-020: Build reusable academy article route and renderer

**Type:** Public frontend  
**Labels:** `frontend`, `academy`, `accessibility`  
**Depends on:** WT-009, WT-010, WT-018, WT-019  

**Pull request outcome**

Registered articles render through one semantic route and reusable block components.

**Scope**

- Build `app/pages/academy/[slug].vue`.
- Add `AcademyArticle.vue`, `ArticleCallout.vue`, and `ArticleTableOfContents.vue`.
- Render all approved block types without raw HTML.
- Add sources, reviewer, updated date, and contextual tasting CTA.
- Render unknown slugs through the client 404 behavior.

**Acceptance criteria**

- Heading levels remain valid for all block combinations.
- Table of contents targets unique heading IDs.
- Sources and review metadata are visible.
- Unknown slugs do not render another article accidentally.
- Content remains legible in both themes and mobile layouts.

**Tests**

- Nuxt-test every content block, heading IDs, source rendering, CTA, and unknown slug.
- Playwright-test keyboard table-of-contents navigation and axe on a complete article fixture.

---

### WT-021: Author tasting technique and setup academy articles

**Type:** Content  
**Labels:** `academy`, `content`  
**Depends on:** WT-001, WT-002, WT-020  

**Pull request outcome**

The academy publishes reviewed `/academy/how-to-taste` and `/academy/setup` articles.

**Scope**

- Author tasting technique, environment, glassware, pouring, setup, and preparation content.
- Add sources, owner, reviewer, and review dates.
- Add contextual calls to action into the tasting tool.
- Explain technical terms in plain language at first use.

**Acceptance criteria**

- Both route slugs render complete reviewed content.
- Factual claims have sources.
- Content serves general enthusiasts.
- The copy makes no unsupported certification, health, or affiliation claim.

**Tests**

- Extend content-registry unit tests for required slugs and metadata.
- Nuxt-test article headings, key guidance callouts, citations, and CTA targets.

---

### WT-022: Author SAT overview and section academy articles

**Type:** Content  
**Labels:** `academy`, `content`, `sat`  
**Depends on:** WT-001, WT-002, WT-013, WT-020  

**Pull request outcome**

The academy publishes reviewed SAT overview, Appearance, Nose, Palate, and Conclusions guides.

**Scope**

- Author `/academy/sat`, `/academy/appearance`, `/academy/nose`, `/academy/palate`, and `/academy/conclusions` content.
- Reference canonical terminology rather than duplicating ad hoc labels.
- Add section-specific tasting-tool CTAs.
- Apply approved attribution and disclaimer placement.

**Acceptance criteria**

- Official terms match canonical data and approved source.
- Approachable explanations accompany technical terminology.
- Every article has sources, owner, reviewer, and review date.
- CTAs target the correct workflow entry or section contract.

**Tests**

- Unit-test that official terms referenced by content exist in canonical data.
- Nuxt-test each slug, metadata block, key heading, and CTA target.

---

### WT-023: Author aroma, flavour, faults, and glossary content

**Type:** Content and searchable reference  
**Labels:** `academy`, `content`, `aroma`  
**Depends on:** WT-001, WT-002, WT-014, WT-020  

**Pull request outcome**

The academy publishes aroma/flavour education, common wine faults, and a searchable glossary.

**Scope**

- Author `/academy/aromas` and `/academy/faults`.
- Create glossary entries and `GlossaryList.vue` for `/academy/glossary`.
- Normalize glossary search for case and diacritics.
- Link glossary terms to canonical SAT/aroma IDs where applicable.
- Keep fault guidance educational and avoid unsafe health claims.

**Acceptance criteria**

- All three routes render reviewed content.
- Glossary filters by term and definition and announces result counts.
- Empty search has a useful reset action.
- Canonical terms match approved data.
- Every factual claim has source metadata.

**Tests**

- Unit-test glossary registry integrity and canonical ID references.
- Nuxt-test search normalization, result count, empty state, reset, and semantic list rendering.
- Playwright-test keyboard search and axe on populated and empty states.

---

### WT-024: Author FAQ, about page, and worked examples

**Type:** Content and public frontend  
**Labels:** `academy`, `content`  
**Depends on:** WT-001, WT-002, WT-020  

**Pull request outcome**

The public site includes reviewed frequently asked questions, methodology/about content, and original worked examples.

**Scope**

- Build `FaqList.vue`, `WorkedExampleCard.vue`, `/faq`, and `/about`.
- Register `/academy/examples` content.
- Show structured observations alongside polished narrative examples.
- Use only original or explicitly licensed examples.
- Explain local processing, no accounts, and no durable note history accurately.

**Acceptance criteria**

- FAQ disclosures are keyboard-operable and semantic.
- Worked examples distinguish observations from generated prose.
- About copy explains scope and methodology without unsupported affiliation claims.
- Sources and ownership metadata meet governance requirements.

**Tests**

- Nuxt-test FAQ disclosure behavior, about landmarks, and worked-example rendering.
- Unit-test example fixtures against draft schemas once those schemas exist; until then, use typed canonical references and add the schema assertion in WT-034.
- Playwright-test FAQ keyboard behavior and axe.

## Tasting State and Browser Boundaries

### WT-025: Implement versioned tasting draft schema and factory

**Type:** Domain model  
**Labels:** `domain`, `state`, `testing`  
**Depends on:** WT-013, WT-015, WT-016  

**Pull request outcome**

The application can create and strictly parse version 1 tasting drafts without importing browser or Vue APIs.

**Scope**

- Create tasting types, Zod schema, error types, and `createEmptyDraft`.
- Implement string limits, known-ID validation, free-text normalization, and source values.
- Inject the clock used for timestamps.
- Implement `sanitizeDraft` and stale-answer clearing integration.
- Reject unknown schema keys at persistence boundaries.

**Acceptance criteria**

- Empty drafts contain every required object and canonical null/empty value.
- Timestamps are deterministic under an injected clock.
- Unknown IDs, invalid lengths, extra keys, and unsupported schema versions fail with typed errors.
- Free-text lists trim and deduplicate case-insensitively.
- Sanitization clears values made inapplicable by controlling answers.

**Tests**

- Unit-test factory, strict parsing, all limits, Unicode input, duplicate text, unknown IDs, extra keys, and stale answers.
- Use table-driven fixtures for each wine kind.

---

### WT-026: Implement Pinia tasting store and workflow actions

**Type:** State management  
**Labels:** `state`, `pinia`, `testing`  
**Depends on:** WT-025  

**Pull request outcome**

One Pinia store owns the editable tasting, section navigation, updates, resets, and derived completion state.

**Scope**

- Create `app/stores/tasting.ts`.
- Add actions for start, identity update, field update, text update, section navigation, restore, complete, and reset.
- Delegate validation and applicability to domain functions.
- Clear stale values after controlling updates.
- Expose derived section and full-tasting completion.
- Do not persist inside store actions.

**Acceptance criteria**

- Store state contains canonical IDs, not labels.
- Store actions cannot create an invalid structural shape.
- Controlling updates clear hidden stale answers.
- Navigation supports canonical order and explicit section jumps.
- Reset returns to no active draft.
- Completion is derived, not stored.

**Tests**

- Use Nuxt/Pinia tests with a fresh Pinia per case.
- Test every action, derived completion, stale clearing, restore, and reset.
- Do not test Pinia internals or use a global shared store between tests.

---

### WT-027: Implement session-only draft repository and persistence composable

**Type:** Browser persistence  
**Labels:** `state`, `privacy`, `testing`  
**Depends on:** WT-025, WT-026  

**Pull request outcome**

Unfinished local drafts recover after refresh in the current browser session and never enter durable storage.

**Scope**

- Add `SessionDraftRepository` and `BrowserSessionDraftRepository`.
- Inject the `Storage` dependency.
- Use `wtng:draft:v1` as the sole session draft key.
- Add `useDraftPersistence`.
- Restore only valid `source: 'local'` drafts.
- Remove invalid data and report typed recovery status.
- Remove the key on completion and explicit reset.
- Refuse to save `source: 'shared'` data.

**Acceptance criteria**

- Refresh in the same tab/session restores an unfinished draft.
- Completion and reset remove the session key.
- Blocked storage does not prevent use of the tasting tool.
- No tasting content is written to `localStorage`, IndexedDB, cookies, or query strings.
- Shared data cannot be saved even if a caller invokes the repository incorrectly.

**Tests**

- Unit-test repository read, save, remove, malformed JSON, invalid schema, quota error, unavailable storage, and shared-source rejection.
- Nuxt-test composable restore/watch/cleanup with an injected fake repository.
- Playwright coverage for real session lifetime belongs to WT-038.

---

### WT-028: Build tasting start, recovery, and workflow shell

**Type:** Tasting frontend  
**Labels:** `tasting-flow`, `frontend`, `accessibility`  
**Depends on:** WT-009, WT-010, WT-011, WT-016, WT-026, WT-027  

**Pull request outcome**

Users can start or recover a tasting and navigate a responsive workflow shell before section forms are implemented.

**Scope**

- Build `/tasting`, `WineIdentityForm.vue`, `TastingShell.vue`, and `TastingStepper.vue`.
- Collect optional wine name and vintage plus required wine kind.
- Show recovery success and failure states.
- Show section completion, session save status, section links, and reset confirmation.
- Add `require-draft` middleware.
- Allow section jumps without presenting incomplete sections as complete.

**Acceptance criteria**

- A valid identity starts a local draft.
- Missing wine kind prevents start and focuses its field.
- Optional identity limits match the domain schema.
- Missing drafts on workflow routes return to `/tasting`.
- Reset requires confirmation and clears store and session state.
- Stepper is understandable without color alone.

**Tests**

- Nuxt-test form validation, start action, recovery notices, reset dialog, middleware, stepper labels, and section navigation.
- Playwright-test start and reset at mobile and desktop widths.

## Tasting Workflow Interfaces

### WT-029: Build schema-driven SAT field components and Appearance page

**Type:** Tasting frontend  
**Labels:** `tasting-flow`, `forms`, `accessibility`  
**Depends on:** WT-028  

**Pull request outcome**

The first complete workflow section renders from canonical definitions using reusable accessible controls.

**Scope**

- Add `SatFieldRenderer.vue`, `SingleChoiceField.vue`, `MultiChoiceField.vue`, `TextObservationField.vue`, and `SectionValidationSummary.vue`.
- Build `/tasting/appearance` from applicable definitions.
- Add prompt, official label, help, required, error, and completion presentation.
- Link validation-summary errors to fields and focus them.
- Save updates through store actions.

**Acceptance criteria**

- Appearance field order and options come from canonical data.
- Controls expose labels, selected state, help, and errors to assistive technology.
- Validation links focus the correct field.
- Text limits are visible and enforced.
- Progress updates as answers change.
- Refresh recovery preserves valid Appearance answers.

**Tests**

- Nuxt-test each reusable field component using `mountSuspended`.
- Nuxt-test the page with a real test Pinia and localized data.
- Test keyboard choice selection, errors, focus links, text limits, and recovered state.

---

### WT-030: Build searchable hierarchical aroma selector

**Type:** Tasting component  
**Labels:** `aroma`, `frontend`, `accessibility`  
**Depends on:** WT-009, WT-012, WT-014, WT-017  

**Pull request outcome**

Users can search, browse, select, and remove every aroma descriptor without using a visual wheel.

**Scope**

- Build `AromaPicker.vue`, `AromaSearch.vue`, `AromaHierarchy.vue`, and `SelectedAromas.vue` in hierarchy-only mode.
- Add family/category drill-down, breadcrumbs, search results with context, selected chips, and result counts.
- Emit canonical IDs through typed events.
- Add screen-reader selection and result announcements without excessive chatter.
- Do not add wheel rendering yet.

**Acceptance criteria**

- Every selectable descriptor is reachable by hierarchy navigation.
- Search handles case and diacritics.
- Search results include family/category context.
- Selection is visible and announced.
- Removing a chip restores focus predictably.
- Color is not the only category or selected-state cue.

**Tests**

- Nuxt-test search, drill-down, breadcrumbs, selection, removal, focus, announcements, empty results, and canonical event values.
- Playwright-test complete keyboard selection and run axe on browse, search, and selected states.

---

### WT-031: Build Nose page with condition rules and aroma hierarchy

**Type:** Tasting section  
**Labels:** `tasting-flow`, `nose`, `accessibility`  
**Depends on:** WT-015, WT-016, WT-028, WT-029, WT-030  

**Pull request outcome**

Users can complete the Nose assessment through canonical fields and the hierarchy aroma selector.

**Scope**

- Build `/tasting/nose`.
- Render condition, faults, intensity, development, aromas, and optional free-text aromas.
- Apply condition/fault rules and clear hidden faults when condition changes.
- Integrate hierarchy `AromaPicker` with store state.
- Add section validation and navigation.

**Acceptance criteria**

- Fault controls appear only when the approved rule applies.
- Hidden fault values clear when condition changes.
- Aroma IDs remain selected across search and drill-down.
- Nose completion reflects required applicable fields.
- Back, next, and section jumps preserve state.

**Tests**

- Nuxt-test clean/faulty transitions, stale clearing, selection persistence, validation, and navigation with real Pinia state.
- Add a focused Playwright Nose flow using keyboard controls and hierarchy selection.

---

### WT-032: Add interactive radial SVG aroma wheel

**Type:** Tasting component  
**Labels:** `aroma-wheel`, `frontend`, `accessibility`  
**Depends on:** WT-017, WT-030, WT-031  

**Pull request outcome**

Users with suitable viewports can use a responsive SVG wheel that remains synchronized with the hierarchy selector.

**Scope**

- Build `AromaWheel.vue`.
- Render deterministic arcs and labels from geometry utilities.
- Support focus, category zoom, descriptor selection, breadcrumbs, and return to all families.
- Add pointer and keyboard interactions.
- Synchronize wheel and hierarchy through `AromaPicker`'s one selection state.
- Default to hierarchy view below the empirically chosen usable breakpoint.
- Persist only the preferred view through `PreferencesStore`.

**Acceptance criteria**

- Wheel and hierarchy show identical selections immediately.
- Wheel zoom does not lose selections.
- All wheel actions have accessible names and keyboard equivalents.
- Category and selection do not rely on color alone.
- Labels remain readable at supported wheel dimensions.
- Hierarchy remains available at every viewport and is the mobile default where needed.

**Tests**

- Nuxt-test SVG semantics, keyboard events, zoom, reset, selection synchronization, and preference changes.
- Unit-test any additional geometry behavior.
- Playwright-test pointer and keyboard use at supported desktop/tablet sizes plus hierarchy fallback on mobile.
- Run axe in both views.

---

### WT-033: Build Palate page and explicit nose-derived suggestions

**Type:** Tasting section  
**Labels:** `tasting-flow`, `palate`, `accessibility`  
**Depends on:** WT-015, WT-016, WT-028, WT-029, WT-030, WT-031, WT-032  

**Pull request outcome**

Users can complete the Palate assessment with correct conditional fields and optionally accept nose-derived flavour suggestions.

**Scope**

- Build `/tasting/palate`.
- Render sweetness, acidity, tannin, alcohol, body, mousse, flavour intensity, flavour characteristics, free text, and finish.
- Apply wine-kind and approved color-dependent applicability.
- Reuse `AromaPicker` with separate palate state.
- Derive suggestions from nose aromas.
- Require explicit acceptance for each suggestion or group.
- Support dismissal without altering Nose selections.

**Acceptance criteria**

- Sparkling-specific fields appear only for sparkling wine.
- Inapplicable values clear after controlling changes.
- Nose and palate selections remain independent.
- Suggestions never select themselves automatically.
- Accepted suggestions become normal removable palate selections.
- Palate completion reflects only applicable required fields.

**Tests**

- Nuxt-test still, sparkling, and fortified states, applicability changes, stale clearing, suggestions, dismissal, acceptance, independence, and validation.
- Playwright-test one sparkling path and one still-wine path.

---

### WT-034: Build Conclusions and complete tasting review

**Type:** Tasting sections  
**Labels:** `tasting-flow`, `review`, `accessibility`  
**Depends on:** WT-016, WT-028, WT-029, WT-031, WT-033  

**Pull request outcome**

Users can complete Conclusions, review all applicable observations, edit any section, and see why generation is blocked.

**Scope**

- Build `/tasting/conclusions` and `/tasting/review`.
- Add `SectionReviewCard.vue`.
- Render quality and readiness fields from canonical definitions.
- Present human-readable localized labels for all applicable answers.
- Add edit links to every section.
- Gate note generation on full validation.
- Validate worked-example fixtures from WT-024 against the complete draft schema.

**Acceptance criteria**

- Review omits hidden and unanswered optional observations.
- Review never exposes internal IDs or translation keys.
- Incomplete sections show direct edit actions.
- Complete tastings expose the generation action.
- Back/forward navigation preserves answers.
- Conclusions use approved options and prompts.

**Tests**

- Nuxt-test Conclusions fields, incomplete review, complete review, localized labels, edit links, and generation gating.
- Unit-test worked-example fixtures against the draft schema.
- Playwright-test review editing and return navigation.

## Generated Notes and Sharing

### WT-035: Implement deterministic localized note generation

**Type:** Domain logic  
**Labels:** `domain`, `note-generation`, `testing`  
**Depends on:** WT-013, WT-014, WT-016, WT-025, WT-034  

**Pull request outcome**

A pure generator converts a complete draft into polished, deterministic localized prose.

**Scope**

- Create `app/domain/tasting/note-generator.ts`.
- Implement title and Appearance, Nose, Palate, and Conclusions builders.
- Inject translator and list formatter dependencies.
- Use canonical ordering for descriptors.
- Handle optional identity, free text, and zero/one/two/many lists.
- Add representative complete draft fixtures.
- Do not render a page in this issue.

**Acceptance criteria**

- Output contains no internal IDs, keys, `undefined`, or empty punctuation.
- Identical input produces identical output.
- Descriptor order follows canonical taxonomy order.
- Optional identity and observations read naturally.
- Official terms remain intact where permission requires them.
- Generated output is not stored independently.

**Tests**

- Unit-test red, white, sparkling, fortified, faulty, simple, and complex fixtures.
- Test missing optional identity and list cardinalities.
- Use focused approved prose snapshots plus semantic assertions.

---

### WT-036: Build generated-note page, copy, and native share

**Type:** Result frontend  
**Labels:** `frontend`, `sharing`, `accessibility`  
**Depends on:** WT-009, WT-011, WT-026, WT-027, WT-034, WT-035  

**Pull request outcome**

Users can view a generated note, copy its text, use native sharing where supported, and complete the local session.

**Scope**

- Build `/tasting/note`, `GeneratedNoteView.vue`, and initial `ShareActions.vue`.
- Add `complete-tasting` middleware.
- Add `ClipboardPort`, `NativeSharePort`, and browser adapters with injected navigator/document dependencies.
- Report copied, unsupported, cancelled, and failed outcomes accessibly.
- Remove session recovery after explicit completion while keeping the current in-memory result until navigation.
- Exclude private-link creation until WT-038.

**Acceptance criteria**

- Incomplete drafts redirect to review.
- Generated sections and plain text match domain output.
- Copy works through the Clipboard API and safe fallback where supported.
- Native share is hidden or disabled when unsupported.
- User cancellation is not shown as failure.
- Completing removes the session draft key.

**Tests**

- Unit-test clipboard and native-share adapters for success, unavailable, cancellation, and failure.
- Nuxt-test page middleware, result rendering, action announcements, and completion cleanup.
- Playwright-test real clipboard behavior where browser permissions allow it.

---

### WT-037: Implement strict versioned share codec

**Type:** Domain boundary  
**Labels:** `domain`, `sharing`, `privacy`, `testing`  
**Depends on:** WT-014, WT-025, WT-035  

**Pull request outcome**

Complete tastings round-trip through a strict compact version 1 URL-fragment payload with typed failures.

**Scope**

- Create `app/domain/tasting/share-codec.ts`.
- Define strict `SharedNoteV1` Zod schema.
- Implement canonical draft-to-DTO and DTO-to-shared-draft mapping.
- Implement LZ compression and unpadded base64url encoding.
- Use `#note=v1.<payload>`.
- Enforce the 8,000-character final fragment limit.
- Reject malformed payloads, unknown IDs, extra keys, and unsupported versions.

**Acceptance criteria**

- Supported complete notes round-trip without semantic data loss.
- Unicode free text round-trips.
- Output is canonical for identical input.
- Unsupported versions produce a distinct typed error.
- Oversized output fails before a URL is returned.
- Decoded drafts always use `source: 'shared'`.

**Tests**

- Unit-test every representative tasting fixture.
- Test malformed base64url, decompression failure, invalid JSON, extra keys, unknown IDs, unsupported versions, Unicode, and size boundary values.
- Include property-style round-trip cases across option combinations where practical.

---

### WT-038: Build private-link creation and read-only shared-note route

**Type:** Sharing frontend  
**Labels:** `frontend`, `sharing`, `privacy`, `accessibility`  
**Depends on:** WT-009, WT-027, WT-034, WT-035, WT-036, WT-037  

**Pull request outcome**

Users can explicitly create a warned fragment link and recipients can open a read-only note without any draft persistence.

**Scope**

- Build `SharePrivacyDialog.vue`, `SharedNoteView.vue`, `/tasting/shared`, `useSharedNote`, and private-link actions.
- Explain that anyone with the URL can read it and that platforms may retain it.
- Require confirmation before every newly generated link.
- Add copy and native-share support for the link.
- Render invalid, oversized, unknown-ID, and unsupported-version states.
- Offer “Taste this wine yourself” as an explicit empty local start.
- Never move shared state into `TastingStore` draft persistence.

**Acceptance criteria**

- Link targets `/tasting/shared#note=v1.<payload>`.
- No note value enters the query string.
- Opening a link performs no session-note write.
- Privacy warning appears before link creation.
- Error states are specific and actionable.
- Starting a new tasting from a shared note does not copy data implicitly.
- Fragment content does not appear in metadata or logs.

**Tests**

- Nuxt-test confirmation, cancellation, link actions, decoder states, read-only rendering, and no repository writes.
- Playwright-test complete link creation and opening in a fresh context.
- Inspect browser requests to prove fragments are not sent to the host.
- Assert no tasting data appears in local storage, cookies, or query strings.

## Metadata, Legal, and Offline Delivery

### WT-039: Add route metadata, sitemap, robots, and social defaults

**Type:** Discoverability  
**Labels:** `seo`, `static-hosting`, `testing`  
**Depends on:** WT-018, WT-019, WT-021, WT-022, WT-023, WT-024  

**Pull request outcome**

Public routes expose consistent client metadata and generated sitemap/robots artifacts without leaking tasting data.

**Scope**

- Implement `usePageMetadata`.
- Add unique title, description, canonical, Open Graph, and social metadata to public pages.
- Read base URL from `NUXT_PUBLIC_SITE_URL`.
- Configure sitemap entries for public academy and legal routes.
- Configure robots and sitemap location.
- Add a generic site social card only.
- Exclude workflow steps and shared fragments from sitemap.
- Document SPA crawler limitations.

**Acceptance criteria**

- Every public route has one title, description, and canonical URL.
- Sitemap contains only approved public routes.
- Robots output never contains note fragments.
- No note data enters social metadata.
- Missing production site URL causes a clear build/configuration warning.
- Documentation acknowledges client-only crawler limitations.

**Tests**

- Unit-test route metadata registry uniqueness and sitemap inclusion rules.
- Nuxt-test metadata application on representative pages.
- Playwright-test generated output metadata and direct navigation.

---

### WT-040: Publish privacy, terms, attribution, and storage disclosures

**Type:** Legal frontend  
**Labels:** `legal`, `privacy`, `content`  
**Depends on:** WT-001, WT-010, WT-024, WT-038, WT-039  

**Pull request outcome**

The public site accurately explains legal terms, approved WSET attribution, local processing, browser storage, and fragment-link privacy.

**Scope**

- Build `/privacy` and `/terms`.
- Add approved WSET attribution, trademark spelling, source, and non-affiliation disclaimer.
- Document session draft key and preference key.
- Explain session recovery, local preferences, explicit fragments, and platform retention.
- State that share links are readable, not secret or encrypted.
- State that the application has no accounts, backend note storage, or analytics.

**Acceptance criteria**

- Legal wording matches WT-001 exactly where required.
- Every browser storage key and stored value is listed accurately.
- No claim overstates fragment privacy.
- Pages have sources/review dates where governance requires them.
- Footer links point to both pages.

**Tests**

- Nuxt-test required disclosure headings, storage key names, attribution, and navigation links.
- Add a contract test that compares documented storage keys with exported repository constants.
- Playwright-run axe on both pages.

---

### WT-041: Configure manifest, icons, and installable PWA shell

**Type:** PWA foundation  
**Labels:** `pwa`, `offline`, `testing`  
**Depends on:** WT-004, WT-008, WT-010, WT-039  

**Pull request outcome**

The generated application has a valid manifest, local icons, and an installable service-worker shell.

**Scope**

- Add 192, 512, and maskable icons plus replacement favicon.
- Configure manifest name, short name, colors, display, start URL, and icons.
- Configure generated service worker and precache for shell, local fonts, icons, and static content assets.
- Configure SPA navigation fallback.
- Do not add forced update behavior.

**Acceptance criteria**

- Browser installability checks pass after an online load.
- Manifest icons have correct sizes and maskable purpose.
- Local fonts and static shell assets enter the precache.
- Service worker makes no external runtime request.
- Navigation fallback loads representative client routes.

**Tests**

- Unit-test manifest/config helpers if extracted.
- Playwright-test manifest availability, service-worker registration, icon responses, and repeat-load offline shell.
- Validate generated manifest and service worker in production output.

---

### WT-042: Add offline status and safe service-worker updates

**Type:** PWA frontend  
**Labels:** `pwa`, `offline`, `accessibility`  
**Depends on:** WT-027, WT-036, WT-038, WT-041  

**Pull request outcome**

Users can continue an active tasting offline and choose when to activate a new application version.

**Scope**

- Add `useOnlineStatus`, `OfflineStatus.vue`, and `PwaUpdatePrompt.vue`.
- Announce offline and restored states without repeated noise.
- Prompt before applying a waiting service worker.
- Ensure current local state is persisted before accepted reload.
- Keep the current application when update activation fails.
- Document first-visit and uncached-route limitations.

**Acceptance criteria**

- Going offline does not erase or block an active draft.
- A repeat visitor can navigate cached content and complete a tasting offline.
- An already-cached shared URL decodes offline.
- A new service worker never force-refreshes an active tasting.
- Offline and update controls are keyboard and screen-reader accessible.

**Tests**

- Nuxt-test status announcements and update prompt states with mocked Nuxt PWA imports.
- Playwright-test online installation, offline reload, draft edits, cached shared route, and accepted update behavior.

## Cross-Cutting Verification and Release

### WT-043: Add complete critical-path browser tests

**Type:** End-to-end quality  
**Labels:** `e2e`, `testing`, `release`  
**Depends on:** WT-021 through WT-024, WT-032 through WT-042  

**Pull request outcome**

Playwright covers the product's critical user journeys against production-like generated output.

**Scope**

- Add focused academy, tasting-flow, share-link, storage, and offline specs.
- Cover representative still and sparkling tastings.
- Cover draft refresh recovery and reset.
- Cover section review/edit and generated output.
- Cover private-link creation and fresh-context import.
- Cover direct navigation to representative static routes.
- Reuse page objects only when they reduce duplication without hiding assertions.
- Promote the CI browser step from the foundation smoke test to the complete critical-path suite.

**Acceptance criteria**

- Critical tests run on desktop and selected mobile projects without redundant duplication.
- Locators use roles, labels, and visible names.
- Tests use deterministic fixtures and no timing sleeps.
- The suite verifies no tasting-bearing network requests.
- The suite verifies allowed storage keys and session cleanup.
- Direct route navigation succeeds through preview output.
- Pull requests run the complete critical-path browser suite in CI.

**Tests**

- This issue consists of Playwright tests and any minimal test helpers required by them.
- Run the full `pnpm test:e2e` suite and all existing quality commands.

---

### WT-044: Complete accessibility and responsive verification

**Type:** Quality  
**Labels:** `accessibility`, `responsive`, `release`  
**Depends on:** WT-043  

**Pull request outcome**

Automated and manual-style browser checks cover keyboard completion, focus, semantics, reduced motion, and representative viewport sizes.

**Scope**

- Add axe checks for homepage, academy article, each tasting section, review, note, shared note, dialogs, and both aroma views.
- Add a complete keyboard-only tasting path.
- Verify focus after route changes, validation links, dialogs, wheel drill-down, and chip removal.
- Verify 320 px, common phone, tablet, laptop, and wide desktop layouts.
- Verify reduced-motion behavior and non-color status cues.
- Fix discovered defects within this issue when changes remain small; create follow-up issues for larger redesigns.

**Acceptance criteria**

- No serious or critical axe violations remain.
- The full tasting is possible without pointer input.
- No page has horizontal scrolling at 320 px.
- Focus never becomes lost or trapped outside a modal.
- Text remains readable at 200 percent browser zoom.
- Status and selection never depend on color alone.

**Tests**

- Add Playwright accessibility and responsive specs for every acceptance criterion that can be automated.
- Add Nuxt regression tests for any component defects fixed by the issue.
- Record remaining manual screen-reader checks in the pull request.

---

### WT-045: Enforce core coverage and complete release verification

**Type:** Release gate  
**Labels:** `release`, `quality`, `priority:critical`  
**Depends on:** WT-001 through WT-044  

**Pull request outcome**

The repository has enforced coverage, complete documentation, no starter artifacts, and a reproducible launch checklist.

**Scope**

- Enforce 90 percent line, statement, function, and branch coverage for domain, repository, and service code.
- Remove starter files, placeholder tests, dead code, and unused dependencies.
- Audit production bundle and route chunks for obvious avoidable weight.
- Validate manifest, icons, service worker, robots, sitemap, canonicals, and direct routes.
- Verify browser storage and network behavior in the complete suite.
- Update README with final setup, commands, architecture summary, environment variables, static output, Cloudflare Pages expectations, privacy, and known SPA/offline limits.
- Add a release checklist that requires legal/content sign-off.

**Acceptance criteria**

- `pnpm lint` passes.
- `pnpm typecheck` passes.
- `pnpm test` passes.
- `pnpm test:coverage` passes enforced thresholds.
- `pnpm generate` passes and creates `.output/public`.
- `pnpm test:e2e` passes.
- No tasting data is written outside the approved session key or explicit fragment.
- No analytics or note-bearing network request exists.
- WSET permission and all content reviews are approved.
- Known SPA SEO and first-visit offline limitations are documented.

**Tests**

- Run the complete quality suite from a clean checkout.
- Add regression tests for every defect found during the release audit.
- Do not weaken assertions or exclude core files only to satisfy coverage.

## Dependency Graph

The following graph shows the main delivery paths. An issue also depends on every explicit dependency listed in its own section.

```text
Governance:
WT-001 -> WT-002 -> WT-018 -> WT-020 -> WT-021/WT-022/WT-023/WT-024

Tooling:
WT-003 -> WT-004 -> WT-005 -> WT-006 -> WT-007

Shared UI:
WT-004/WT-005 -> WT-008 -> WT-009 -> WT-010
WT-004/WT-005 -> WT-011
WT-008/WT-009/WT-011 -> WT-012

SAT domain:
WT-001/WT-005/WT-011 -> WT-013 -> WT-015 -> WT-016
WT-001/WT-005/WT-011 -> WT-014 -> WT-017

Tasting state:
WT-013/WT-015/WT-016 -> WT-025 -> WT-026 -> WT-027 -> WT-028

Tasting UI:
WT-028 -> WT-029
WT-014/WT-017/WT-012 -> WT-030 -> WT-031 -> WT-032
WT-029/WT-031/WT-032 -> WT-033 -> WT-034

Notes and sharing:
WT-034 -> WT-035 -> WT-036
WT-025/WT-035 -> WT-037
WT-036/WT-037 -> WT-038

Public delivery:
WT-018/WT-019/WT-021..WT-024 -> WT-039 -> WT-040
WT-039 -> WT-041 -> WT-042

Release:
WT-021..WT-024/WT-032..WT-042 -> WT-043 -> WT-044 -> WT-045
```

## Suggested Milestones

### Milestone 1: Buildable Foundation

- WT-001 through WT-012
- Exit condition: client-only Nuxt shell, quality tooling, CI, localization, design system, and preferences work.

### Milestone 2: Canonical Domain and Academy Framework

- WT-013 through WT-020
- Exit condition: SAT data and rules are validated, and typed academy content can render.

### Milestone 3: Educational Launch Content

- WT-021 through WT-024
- Exit condition: all academy routes contain reviewed launch content.

### Milestone 4: Guided Tasting

- WT-025 through WT-034
- Exit condition: users can complete every tasting section and review a valid assessment.

### Milestone 5: Notes and Sharing

- WT-035 through WT-038
- Exit condition: prose generation, copy, native sharing, and isolated fragment links work.

### Milestone 6: Public Delivery and Release

- WT-039 through WT-045
- Exit condition: metadata, legal pages, PWA behavior, accessibility, browser tests, and release gates pass.

## Constraints for Future Agents

- Implement only one issue unless the user explicitly combines issues.
- Read this plan and the full target issue before editing.
- Verify that every dependency has merged. Do not silently implement missing prerequisite scope.
- Keep the pull request limited to the named outcome.
- Add tests in the same pull request as production code.
- Use Nuxt test utilities for Nuxt-aware code. Do not substitute only shallow Vue tests for route, plugin, store, or composable integration.
- Do not add backward-compatibility or migrations before a persisted or shipped version requires them.
- Do not add a backend to simplify sharing, content, storage, or PWA behavior.
- Do not add analytics, telemetry, remote fonts, or third-party runtime content.
- Do not invent missing WSET wording. Block on WT-001 or ask for the approved source.
- Keep the accessible aroma hierarchy complete even when improving the visual wheel.
- Treat shared fragments as readable transport, not encryption or secret storage.
- Never persist imported shared notes without an explicit user action that starts a new empty local tasting.
- Do not add a Cloudflare deployment workflow. Verify only the generated output and documented SPA fallback contract.

## Final Launch Conditions

The product is ready to launch only when:

- The written WSET permission record and public wording are approved.
- All canonical SAT and lexicon source expectations pass.
- All academy content has sources, owners, reviewers, and review dates.
- The complete tasting works on mobile, desktop, keyboard, and supported assistive technology semantics.
- Copy, native sharing, and fragment links meet their privacy contracts.
- Session recovery creates no durable note history.
- Repeat visitors can use the application offline.
- Static deep links work in the connected Cloudflare Pages project.
- Lint, typecheck, unit tests, Nuxt tests, coverage, production generation, Playwright, and axe release checks pass.
