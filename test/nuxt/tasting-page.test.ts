import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TastingPage from '~/pages/tasting.vue'

describe('Tasting page (tasting.vue)', () => {
  it('renders the "Tasting Wizard" heading', async () => {
    const wrapper = await mountSuspended(TastingPage)
    expect(wrapper.text()).toContain('Tasting Wizard')
  })

  it('renders a "Back to Home" link pointing to /', async () => {
    const wrapper = await mountSuspended(TastingPage)
    const links = wrapper.findAll('a')
    const backLink = links.find(l => l.text().includes('Back to Home'))
    expect(backLink).toBeDefined()
    expect(backLink!.attributes('href')).toBe('/')
  })

  it('renders a wine icon', async () => {
    const wrapper = await mountSuspended(TastingPage)
    const icon = wrapper.find('span.iconify')
    expect(icon.exists()).toBe(true)
    expect(icon.classes()).toContain('i-lucide:wine')
  })
})
