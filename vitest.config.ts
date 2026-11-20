import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.ts'],
          environment: 'node',
          pool: 'threads',
          // Pure node tests: no globals, mocks, or module-level state.
          // Reusing workers is safe here and avoids one startup per file.
          isolate: false,
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.test.ts'],
          environment: 'nuxt',
          pool: 'threads',
          // @nuxt/test-utils memoizes a single Nuxt app per window and only
          // resets modules when there is no app. Reusing workers leaks
          // i18n/router/pinia state across files, so keep per-file isolation.
          isolate: true,
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL('.', import.meta.url)),
              domEnvironment: 'happy-dom',
            },
          },
        },
      }),
    ],
    coverage: {
      provider: 'v8',
      include: ['app/**'],
      exclude: [
        '.nuxt/**',
        '**/*.config.*',
        '**/*.d.ts',
        'app/content/**',
        'app/i18n/**',
      ],
      reporter: ['text', 'html', 'lcov'],
    },
  },
})
