import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppLogo from '~/components/AppLogo.vue'

describe('AppLogo', () => {
  it('renders the app name', async () => {
    const wrapper = await mountSuspended(AppLogo)
    expect(wrapper.text()).toContain('Wine Tasting Notes')
  })

  it('renders the wine glass icon', async () => {
    const wrapper = await mountSuspended(AppLogo)
    // UIcon renders as <span class="iconify i-lucide:wine ...">
    const icon = wrapper.find('span.iconify')
    expect(icon.exists()).toBe(true)
    expect(icon.classes()).toContain('i-lucide:wine')
  })

  it('uses the display font class on the title', async () => {
    const wrapper = await mountSuspended(AppLogo)
    const titleSpan = wrapper.find('span.font-display')
    expect(titleSpan.exists()).toBe(true)
    expect(titleSpan.text()).toBe('Wine Tasting Notes')
  })

  it('uses primary color on the icon', async () => {
    const wrapper = await mountSuspended(AppLogo)
    const icon = wrapper.find('span.iconify')
    expect(icon.classes()).toContain('text-primary')
  })
})
