import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ShellAppFooter from '~/components/shell/ShellAppFooter.vue'

// Canonical attribution block from docs/legal/wset-attribution.md. These
// strings must be reproduced verbatim, so the test asserts the exact wording.
const FRAMEWORK_CREDIT =
  "This project's tasting structure and terminology are informed by the WSET Level 3 Systematic Approach to Tasting."

const TRADEMARK_NOTICE =
  'We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with the Wine & Spirit Education Trust. "WSET" and "Systematic Approach to Tasting" are trademarks of the Wine & Spirit Education Trust.'

describe('ShellAppFooter', () => {
  it('renders the canonical WSET framework credit', async () => {
    const wrapper = await mountSuspended(ShellAppFooter)
    expect(wrapper.text()).toContain(FRAMEWORK_CREDIT)
  })

  it('renders the WSET trademark and non-affiliation notice', async () => {
    const wrapper = await mountSuspended(ShellAppFooter)
    expect(wrapper.text()).toContain(TRADEMARK_NOTICE)
  })

  it('renders product and legal navigation links', async () => {
    const wrapper = await mountSuspended(ShellAppFooter)
    const hrefs = wrapper.findAll('a').map((link) => link.attributes('href'))
    expect(hrefs).toEqual(
      expect.arrayContaining(['/academy', '/tasting', '/faq', '/about', '/privacy', '/terms']),
    )
  })
})
