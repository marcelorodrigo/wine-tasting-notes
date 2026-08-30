import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'

describe('nested nuxt component test', () => {
  it('renders a component using renderSuspended', async () => {
    const TestComponent = defineComponent({
      setup() {
        return () =>
          h('div', [
            h('h1', 'Tasting Session'),
            h('p', 'Welcome to the wine tasting'),
          ])
      },
    })

    const { getByText } = await renderSuspended(TestComponent)

    expect(getByText('Tasting Session')).toBeTruthy()
    expect(getByText('Welcome to the wine tasting')).toBeTruthy()
  })
})
