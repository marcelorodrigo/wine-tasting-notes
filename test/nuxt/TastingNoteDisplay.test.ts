import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TastingNoteDisplay from '~/components/results/TastingNoteDisplay.vue'

describe('TastingNoteDisplay', () => {
  describe('empty state', () => {
    it('shows empty state when text is undefined', async () => {
      const wrapper = await mountSuspended(TastingNoteDisplay)
      expect(wrapper.find('[data-testid="tasting-note-empty"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="tasting-note-content"]').exists()).toBe(false)
    })

    it('shows empty state when text is null', async () => {
      const wrapper = await mountSuspended(TastingNoteDisplay, {
        props: { text: null }
      })
      expect(wrapper.find('[data-testid="tasting-note-empty"]').exists()).toBe(true)
    })

    it('shows empty state when text is empty string', async () => {
      const wrapper = await mountSuspended(TastingNoteDisplay, {
        props: { text: '' }
      })
      expect(wrapper.find('[data-testid="tasting-note-empty"]').exists()).toBe(true)
    })

    it('shows empty state when text is whitespace only', async () => {
      const wrapper = await mountSuspended(TastingNoteDisplay, {
        props: { text: '   \n\n   ' }
      })
      expect(wrapper.find('[data-testid="tasting-note-empty"]').exists()).toBe(true)
    })

    it('displays the empty state message', async () => {
      const wrapper = await mountSuspended(TastingNoteDisplay)
      const empty = wrapper.find('[data-testid="tasting-note-empty"]')
      expect(empty.text()).toContain('Complete the wizard and click Generate')
    })
  })

  describe('note rendering', () => {
    it('renders note content when text is provided', async () => {
      const wrapper = await mountSuspended(TastingNoteDisplay, {
        props: { text: 'A simple tasting note.' }
      })
      expect(wrapper.find('[data-testid="tasting-note-content"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="tasting-note-empty"]').exists()).toBe(false)
    })

    it('renders text without headers as body paragraphs', async () => {
      const wrapper = await mountSuspended(TastingNoteDisplay, {
        props: { text: 'Looks pale gold with medium intensity.' }
      })
      const content = wrapper.find('[data-testid="tasting-note-content"]')
      expect(content.findAll('h3')).toHaveLength(0)
      expect(content.findAll('p')).toHaveLength(1)
      expect(content.text()).toContain('Looks pale gold with medium intensity.')
    })

    it('parses professional ALL-CAPS section headers', async () => {
      const text = 'APPEARANCE: Clear, medium gold in color.\n\nNOSE: Clean, with medium intensity.'
      const wrapper = await mountSuspended(TastingNoteDisplay, {
        props: { text }
      })
      const headers = wrapper.findAll('h3')
      expect(headers).toHaveLength(2)
      expect(headers[0]!.text()).toBe('APPEARANCE')
      expect(headers[1]!.text()).toBe('NOSE')
    })

    it('parses casual sentence-case section headers', async () => {
      const text = 'Appearance: This wine shows a clear, gold color.\n\nOn the nose: Clean and bright.'
      const wrapper = await mountSuspended(TastingNoteDisplay, {
        props: { text }
      })
      const headers = wrapper.findAll('h3')
      expect(headers).toHaveLength(2)
      expect(headers[0]!.text()).toBe('Appearance')
      expect(headers[1]!.text()).toBe('On the nose')
    })

    it('renders body text alongside headers', async () => {
      const text = 'PALATE: Dry, with high acidity and medium tannin.'
      const wrapper = await mountSuspended(TastingNoteDisplay, {
        props: { text }
      })
      const paragraphs = wrapper.findAll('p')
      expect(paragraphs).toHaveLength(1)
      expect(paragraphs[0]!.text()).toBe('Dry, with high acidity and medium tannin.')
    })

    it('splits multiple paragraphs on double newlines', async () => {
      const text = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.'
      const wrapper = await mountSuspended(TastingNoteDisplay, {
        props: { text }
      })
      const paragraphs = wrapper.findAll('p')
      expect(paragraphs).toHaveLength(3)
    })

    it('handles mixed paragraphs with and without headers', async () => {
      const text = 'APPEARANCE: Clear, pale lemon.\n\nA beautiful wine to behold.'
      const wrapper = await mountSuspended(TastingNoteDisplay, {
        props: { text }
      })
      const headers = wrapper.findAll('h3')
      const paragraphs = wrapper.findAll('p')
      expect(headers).toHaveLength(1)
      expect(paragraphs).toHaveLength(2)
      expect(headers[0]!.text()).toBe('APPEARANCE')
    })

    it('text is selectable', async () => {
      const wrapper = await mountSuspended(TastingNoteDisplay, {
        props: { text: 'Some note text.' }
      })
      const content = wrapper.find('[data-testid="tasting-note-content"]')
      expect(content.classes()).toContain('select-text')
    })
  })

  describe('full note rendering', () => {
    it('renders a complete professional note', async () => {
      const text = [
        'APPEARANCE: Clear, medium gold in color, showing legs/tears.',
        'NOSE: Clean, with medium intensity. Detected floral (acacia) and citrus fruit (lemon) aromas. Developing.',
        'PALATE: Dry, with high acidity. Medium alcohol. Body is medium, with medium flavor intensity. Medium(+) finish.',
        'CONCLUSIONS: This wine is of very good quality. Can drink now, but has potential for ageing.'
      ].join('\n\n')

      const wrapper = await mountSuspended(TastingNoteDisplay, {
        props: { text }
      })
      const headers = wrapper.findAll('h3')
      expect(headers).toHaveLength(4)
      expect(headers.map(h => h.text())).toEqual([
        'APPEARANCE',
        'NOSE',
        'PALATE',
        'CONCLUSIONS'
      ])
    })

    it('renders a headerless bartalk note', async () => {
      const text = 'Pale gold, crystal clear.\n\nSmells great — lemon and flowers.\n\nBone dry, crisp acidity. Medium body. Nice finish.'
      const wrapper = await mountSuspended(TastingNoteDisplay, {
        props: { text }
      })
      const headers = wrapper.findAll('h3')
      const paragraphs = wrapper.findAll('p')
      expect(headers).toHaveLength(0)
      expect(paragraphs).toHaveLength(3)
    })
  })
})
