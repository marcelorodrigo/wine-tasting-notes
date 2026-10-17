import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import {
  DEFAULT_PREFERENCES,
  type PreferenceRepository,
  type ThemePreference,
} from '~/ports/preferences'
import type { SystemTheme, SystemThemePort } from '~/ports/system-theme'
import { useTheme } from '~/composables/useTheme'
import { usePreferencesStore } from '~/stores/preferences'

function createRepository(theme: ThemePreference): PreferenceRepository {
  return {
    load: () => ({ ok: true, value: { schemaVersion: 1, theme, aromaView: 'hierarchy' } }),
    save: () => ({ ok: true, value: DEFAULT_PREFERENCES }),
  }
}

function createSystemPort(theme: SystemTheme): SystemThemePort {
  return { get: () => theme, subscribe: () => () => {} }
}

function createHarness(theme: ThemePreference, systemTheme: SystemTheme = 'light') {
  return defineComponent({
    name: 'ThemeHarness',
    setup() {
      const store = usePreferencesStore()
      store.initialize({
        repository: createRepository(theme),
        systemTheme: createSystemPort(systemTheme),
      })

      const { resolvedTheme, setTheme } = useTheme()

      return () =>
        h('div', [
          h('span', { 'data-testid': 'theme' }, resolvedTheme.value),
          h(
            'button',
            { type: 'button', 'data-testid': 'apply-light', onClick: () => setTheme('light') },
            'apply light',
          ),
        ])
    },
  })
}

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme')
  })

  it('applies an explicit theme to the document element', async () => {
    await mountSuspended(createHarness('dark'))
    await nextTick()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('removes the attribute while the system preference is active', async () => {
    await mountSuspended(createHarness('system', 'dark'))
    await nextTick()
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  })

  it('updates the document element when the theme changes', async () => {
    const wrapper = await mountSuspended(createHarness('system'))
    await nextTick()
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)

    await wrapper.find('[data-testid="apply-light"]').trigger('click')
    await nextTick()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
