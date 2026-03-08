import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import IndexPage from '~/pages/index.vue'

describe('Landing page (index.vue)', () => {
  it('renders the hero heading', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.text()).toContain('Craft Professional Wine Tasting Notes')
  })

  it('renders the WSET badge headline', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.text()).toContain('WSET Level 3')
  })

  it('renders the "Start Tasting" CTA link pointing to /tasting', async () => {
    const wrapper = await mountSuspended(IndexPage)
    const links = wrapper.findAll('a')
    const ctaLinks = links.filter(l => l.text().includes('Start Tasting'))
    expect(ctaLinks.length).toBeGreaterThan(0)
    for (const link of ctaLinks) {
      expect(link.attributes('href')).toBe('/tasting')
    }
  })

  it('renders all four feature cards', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.text()).toContain('WSET Level 3 Compliant')
    expect(wrapper.text()).toContain('Four Writing Profiles')
    expect(wrapper.text()).toContain('Mobile-First Design')
    expect(wrapper.text()).toContain('No Data Stored')
  })

  it('renders the bottom CTA section', async () => {
    const wrapper = await mountSuspended(IndexPage)
    expect(wrapper.text()).toContain('Ready to describe your next bottle?')
  })
})
