# Guide for AI Coding Agents: wine-tasting-notes

This project is a Nuxt 4 application using Nuxt UI, TypeScript, modern best practices, and a well-defined build/test workflow. Follow these guidelines for productivity and architectural compliance:

## Big Picture Architecture
- **Framework**: Nuxt 4 with Nuxt UI, TypeScript, and SSR/SSG enabled by default.
- **Source Structure**:
  - `app/`: Holds config (`app.config.ts` for UI branding) and root Vue (`app.vue`), primary pages in `pages/`, and custom components in `components/`.
  - **Component auto-imports**: Most UI components and helpers are auto-imported via Nuxt conventions. Always prefer using <UApp>, <UHeader>, <UFooter>, <UButton>, etc.
  - **Global CSS**: Found at `app/assets/css/main.css`, loaded via `nuxt.config.ts`.
- **Routing**: Defined by files in `app/pages/`, follows Nuxt file conventions for automatic route generation. Check for any custom `routeRules` in `nuxt.config.ts`.
- **Config**: Core options in `nuxt.config.ts`, including module imports, styling rules, routing, and ESLint rules.

## Developer Workflows
- **Install/Setup**: Use `pnpm install` for dependency management.
- **Development**: Start with `pnpm dev` (serves on http://localhost:3000).
- **Production**: Build with `pnpm build`; preview locally with `pnpm preview`.
- **Linting**: Run `pnpm lint` (uses ESLint with custom stylistic rules found in `nuxt.config.ts`).
- **Type Checking**: Run `pnpm typecheck` for strict TS compliance.
- **Testing**:
  - Uses `@nuxt/test-utils` module for complete Nuxt 4 testing support.
  - **Runtime** and **Unit** tests are configured, with runtime using the **happy-dom** Vitest environment for fast, browser-like behavior.
  - Test coverage is always enabled via Vitest.
  - Run all tests: `pnpm test`
  - Nuxt component tests: `pnpm test:nuxt`
  - Unit tests: `pnpm test:unit`
  - Coverage: `pnpm test:coverage`
  - All tests reside in `test/nuxt/` (Nuxt/app) and `test/unit/` (pure units).
  - See nuxt.config.ts for module setup and testing customization.

## Coding & Architectural Conventions
- **Nuxt UI First**: Always prefer using official Nuxt UI components and the Nuxt UI design system (https://ui.nuxt.com/) for any new feature, change, or implementation. Avoid creating custom components unless Nuxt UI cannot satisfy the requirements. This ensures consistency and leverages existing styling, accessibility, and behavior out of the box.
- **Tailwind CSS v4 Only for Styling**: Always use Tailwind CSS v4 utility classes for all styling needs. Do not create custom vanilla CSS, custom CSS files, or inline CSS. All new styles and overrides must use Tailwind conventions, which maximize maintainability and compatibility with Nuxt UI.
- **UI/Branding**: Custom colors are set in `app.config.ts` under the `ui` key. Change here if adjusting primary/neutral branding.
- **Component Patterns**: Utilize Nuxt UI for layouts, buttons, menus. Custom logic/components should follow the patterns set by `AppLogo.vue` or `TemplateMenu.vue`.
- **Meta/SEO**: Use Nuxt composables (e.g., `useHead`, `useSeoMeta`) in root and page components for proper SEO.
- **ESLint Stylistic**: Grammar (`commaDangle`: never, `braceStyle`: 1tbs) enforced at build/test.
- **External Integrations**: Uses iconify assets and Nuxt UI. For more, check `package.json` and imported modules in `nuxt.config.ts`.
- **SSR/SSG**: Defaults to SSR/SSG (static prerender at `/` route). Prefer SSR-compatible libraries/components.

## Integration & Extension Points
- **Add Components/Pages**: Place new Vue components in `app/components` or new pages in `app/pages`; routes are auto-generated.
- **Config Modules**: All major modules (`@nuxt/ui`, `@nuxt/eslint`, `@nuxt/test-utils`) are set in `nuxt.config.ts`. Add new modules there for additional framework features.
- **Custom Rules/Styles**: Extend the `eslint` or CSS settings in main config files.

## Key Files & Directories
- `README.md`: General workflow and live demo reference.
- `nuxt.config.ts`: Main Nuxt, ESLint, and route rules setup.
- `app/`: Application Vue and UI infrastructure.
- `test/`: All Vitest-based tests.
- `public/`: Static assets (favicon).

---
This guide applies to agents making actual improvements in this Nuxt UI codebase. Always reference this file for relevant conventions before making automated or manual edits. For questions on non-standard conventions or edge case design, review this file and raise clarifications as needed.
