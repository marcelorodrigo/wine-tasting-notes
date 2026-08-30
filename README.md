# Wine Tasting Notes

Educational wine-tasting academy and adaptive guided tasting tool built with Nuxt 4.

## Requirements

- **Node.js 26** (see `.nvmrc`)
- **pnpm 12.1.0** (see `packageManager` in `package.json`)

## Setup

Enable corepack and install dependencies:

```bash
corepack enable
corepack prepare pnpm@12.1.0 --activate
pnpm install
```

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
```
