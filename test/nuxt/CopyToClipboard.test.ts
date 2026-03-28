import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CopyToClipboard from '~/components/results/CopyToClipboard.vue'

const writeTextMock = vi.fn().mockResolvedValue(undefined)

describe('CopyToClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true
    })
  })

  describe('rendering', () => {
    it('renders a button with copy label', async () => {
      const wrapper = await mountSuspended(CopyToClipboard, {
        props: { text: 'Some note' }
      })
      const btn = wrapper.find('[data-testid="copy-to-clipboard"]')
      expect(btn.exists()).toBe(true)
      expect(btn.text()).toContain('Copy to Clipboard')
    })

    it('button is disabled when text is undefined', async () => {
      const wrapper = await mountSuspended(CopyToClipboard)
      const btn = wrapper.find('[data-testid="copy-to-clipboard"]')
      expect(btn.attributes('disabled')).toBeDefined()
    })

    it('button is disabled when text is null', async () => {
      const wrapper = await mountSuspended(CopyToClipboard, {
        props: { text: null }
      })
      const btn = wrapper.find('[data-testid="copy-to-clipboard"]')
      expect(btn.attributes('disabled')).toBeDefined()
    })

    it('button is disabled when text is empty string', async () => {
      const wrapper = await mountSuspended(CopyToClipboard, {
        props: { text: '' }
      })
      const btn = wrapper.find('[data-testid="copy-to-clipboard"]')
      expect(btn.attributes('disabled')).toBeDefined()
    })

    it('button is disabled when text is whitespace only', async () => {
      const wrapper = await mountSuspended(CopyToClipboard, {
        props: { text: '   ' }
      })
      const btn = wrapper.find('[data-testid="copy-to-clipboard"]')
      expect(btn.attributes('disabled')).toBeDefined()
    })

    it('button is enabled when text is provided', async () => {
      const wrapper = await mountSuspended(CopyToClipboard, {
        props: { text: 'A tasting note' }
      })
      const btn = wrapper.find('[data-testid="copy-to-clipboard"]')
      expect(btn.attributes('disabled')).toBeUndefined()
    })
  })

  describe('copy behavior', () => {
    it('calls clipboard API on click', async () => {
      const text = 'APPEARANCE: Clear, medium gold.'
      const wrapper = await mountSuspended(CopyToClipboard, {
        props: { text }
      })
      await wrapper.find('[data-testid="copy-to-clipboard"]').trigger('click')
      expect(writeTextMock).toHaveBeenCalledWith(text)
    })

    it('shows success feedback by changing label', async () => {
      const wrapper = await mountSuspended(CopyToClipboard, {
        props: { text: 'Some note' }
      })
      await wrapper.find('[data-testid="copy-to-clipboard"]').trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Copied!')
    })

    it('does nothing when text is empty on click', async () => {
      const wrapper = await mountSuspended(CopyToClipboard, {
        props: { text: '' }
      })
      await wrapper.find('[data-testid="copy-to-clipboard"]').trigger('click')
      expect(writeTextMock).not.toHaveBeenCalled()
    })
  })
})
