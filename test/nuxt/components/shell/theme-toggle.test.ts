import { beforeEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import ThemeToggle from '~/components/shell/ShellThemeToggle.vue'
import {
  DEFAULT_PREFERENCES,
  type PreferenceRepository,
  type ThemePreference,
} from '~/ports/preferences'
import type { SystemTheme, SystemThemePort } from '~/ports/system-theme'
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

function createWrapper(theme: ThemePreference) {
  return defineComponent({
    name: 'ThemeToggleHarness',
    setup() {
      const store = usePreferencesStore()
      store.initialize({
        repository: createRepository(theme),
        systemTheme: createSystemPort('light'),
      })
      return () => h(ThemeToggle)
    },
  })
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders a labelled group with three options', async () => {
    const wrapper = await mountSuspended(createWrapper('system'))
    const group = wrapper.find('[role="group"]')
    expect(group.attributes('aria-label')).toBe('Color theme')
    expect(wrapper.findAll('button').map((button) => button.text())).toEqual([
      'System',
      'Light',
      'Dark',
    ])
  })

  it('exposes the active option as pressed', async () => {
    const wrapper = await mountSuspended(createWrapper('dark'))
    const pressed = wrapper
      .findAll('button')
      .filter((button) => button.attributes('aria-pressed') === 'true')
    expect(pressed).toHaveLength(1)
    expect(pressed.at(0)?.text()).toBe('Dark')
  })

  it('persists the selection and applies it to the document', async () => {
    const wrapper = await mountSuspended(createWrapper('system'))
    const lightButton = wrapper.findAll('button').find((button) => button.text() === 'Light')

    await lightButton?.trigger('click')
    await nextTick()

    const pressed = wrapper
      .findAll('button')
      .filter((button) => button.attributes('aria-pressed') === 'true')
    expect(pressed.at(0)?.text()).toBe('Light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
