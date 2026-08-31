# Wine Tasting Notes

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=marcelorodrigo_wine-tasting-notes&metric=alert_status)](https://sonarcloud.io/dashboard?id=marcelorodrigo_wine-tasting-notes)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=marcelorodrigo_wine-tasting-notes&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=marcelorodrigo_wine-tasting-notes)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=marcelorodrigo_wine-tasting-notes&metric=coverage)](https://sonarcloud.io/dashboard?id=marcelorodrigo_wine-tasting-notes)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=marcelorodrigo_wine-tasting-notes&metric=code_smells)](https://sonarcloud.io/dashboard?id=marcelorodrigo_wine-tasting-notes)

Educational wine-tasting academy and adaptive guided tasting tool built with Nuxt 4.

## Development

```bash
pnpm dev
```

Opens `http://localhost:3000`.

## Quality Commands

```bash
pnpm lint          # Lint TypeScript and Vue sources
pnpm lint:fix      # Lint and auto-fix
pnpm typecheck     # Type-check with Nuxt-generated types
pnpm test          # Run Vitest test suite
pnpm check         # Run lint, typecheck, and test in order
```

## Build

```bash
pnpm generate
pnpm preview
```

## Tests

```bash
pnpm test:unit     # Unit tests only
pnpm test:nuxt     # Nuxt integration tests only
pnpm test:coverage # Tests with coverage report
pnpm test:e2e      # Playwright browser tests (desktop + mobile)
pnpm test:e2e:smoke # Smoke + axe only
```

### Test Layers

| Layer | Directory | Environment | Use for |
|-------|-----------|-------------|---------|
| **Unit** | `test/unit/**/*.test.ts` | Node | Pure domain logic, schemas, adapters, utilities — no Vue or Nuxt imports |
| **Nuxt** | `test/nuxt/**/*.test.ts` | happy-dom | Components, composables, Pinia stores, middleware — uses `mountSuspended` / `renderSuspended` |
| **Browser** | `test/e2e/**/*.spec.ts` | Chromium (desktop + mobile) | End-to-end user flows, accessibility contracts, axe checks |

Shared test fixtures live in `test/fixtures/` and export typed factories (e.g. `createWineNote`).
Unit tests import fixtures directly; Nuxt tests can use them inside `mountSuspended`.

### Browser Tests

First-time setup (installs Chromium):

```bash
pnpm exec playwright install chromium
```

Browser tests run against generated output (`pnpm generate` is triggered automatically via `webServer` in `playwright.config.ts`). Artifacts (traces, screenshots) are retained only on failure.

## Localization

English is the default locale. All user-facing strings must go through `t()` / `$t()` from `useI18n()` — never hard-code product text in templates or components.

### Locale catalog

`app/i18n/locales/en.json` is the single source of truth for translation keys. Namespaces:

| Namespace | Purpose |
|-----------|---------|
| `app` | Global app strings (name, tagline) |
| `shell` | Header, footer, navigation |
| `error` | Error page UI |
| `academy` | Academy content labels |
| `sat` | SAT wine assessment options |
| `tasting` | Tasting workflow UI |
| `validation` | Field validation messages |
| `note` | Generated note prose |
| `share` | Sharing UI and actions |
| `legal` | Legal pages |
| `offline` | Offline/PWA messages |
| `errors` | Domain error code messages |

### Translation key contract

- CI enforces that every `t('...')` reference resolves to a key in `en.json`
- CI detects duplicate keys and unreferenced (unused) keys
- Template audit prevents hard-coded product strings in Vue components
- Error codes in `errors.*` are a stable contract — do not rename without updating consumers

### Adding a new locale

1. Create `app/i18n/locales/<code>.json`
2. Register it in `nuxt.config.ts` under `i18n.locales`
3. Translate all keys from `en.json`

### Domain formatting seams

`app/services/i18n/` exports pure TypeScript types (`Translator`, `ListFormatter`) and utilities for locale-aware formatting. Domain code (e.g. note generators) receives these via dependency injection — no Nuxt imports required.
