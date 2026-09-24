import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useNuxtApp } from '#app'
import { defineComponent, h } from 'vue'

const TranslatedFixture = defineComponent({
  name: 'TranslatedFixture',
  setup() {
    const nuxtApp = useNuxtApp()
    const i18n = nuxtApp.$i18n as { t: (key: string) => string }
    return () => h('div', { 'data-testid': 'fixture' }, i18n.t('app.name'))
  },
})

describe('locale context switching', () => {
  it('renders English text from locale keys', async () => {
    const wrapper = await mountSuspended(TranslatedFixture)
    expect(wrapper.find('[data-testid="fixture"]').text()).toBe(
      'Wine Tasting Notes',
    )
  })

  it('renders updated text when locale message changes', async () => {
    const wrapper = await mountSuspended(TranslatedFixture)
    expect(wrapper.find('[data-testid="fixture"]').text()).toBe(
      'Wine Tasting Notes',
    )

    const nuxtApp = useNuxtApp()
    const i18n = nuxtApp.$i18n as {
      mergeLocaleMessage: (locale: string, messages: Record<string, unknown>) => void
    }
    i18n.mergeLocaleMessage('en', { app: { name: 'Alternate Wine App' } })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="fixture"]').text()).toBe(
      'Alternate Wine App',
    )
  })
})
