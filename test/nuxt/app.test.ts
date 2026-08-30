import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import App from '~/app.vue'

describe('app.vue', () => {
  it('renders the root application', async () => {
    const wrapper = await mountSuspended(App)

    expect(wrapper.html()).toBeTruthy()
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('includes the route announcer for screen readers', async () => {
    const wrapper = await mountSuspended(App)

    const announcer = wrapper.find('[role="status"]')
    expect(announcer.exists()).toBe(true)
  })
})
