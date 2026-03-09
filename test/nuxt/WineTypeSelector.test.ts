import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import WineTypeSelector from '~/components/wizard/inputs/WineTypeSelector.vue'

describe('WineTypeSelector', () => {
  it('renders three wine type options', async () => {
    const wrapper = await mountSuspended(WineTypeSelector)
    const options = wrapper.findAll('[role="radio"]')
    expect(options).toHaveLength(3)
  })

  it('displays White, Rosé, and Red labels', async () => {
    const wrapper = await mountSuspended(WineTypeSelector)
    expect(wrapper.text()).toContain('White')
    expect(wrapper.text()).toContain('Rosé')
    expect(wrapper.text()).toContain('Red')
  })

  it('displays grape variety subtitles', async () => {
    const wrapper = await mountSuspended(WineTypeSelector)
    expect(wrapper.text()).toContain('Chardonnay')
    expect(wrapper.text()).toContain('Provence')
    expect(wrapper.text()).toContain('Cabernet')
  })

  it('no option is selected by default', async () => {
    const wrapper = await mountSuspended(WineTypeSelector)
    const options = wrapper.findAll('[role="radio"]')
    for (const option of options) {
      expect(option.attributes('aria-checked')).toBe('false')
    }
  })

  it('emits correct wine type when each card is clicked', async () => {
    const wrapper = await mountSuspended(WineTypeSelector)

    await wrapper.find('[data-testid="wine-type-white"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['white'])

    await wrapper.find('[data-testid="wine-type-rose"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['rosé'])

    await wrapper.find('[data-testid="wine-type-red"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[2]).toEqual(['red'])
  })

  it('highlights selected card with aria-checked', async () => {
    const wrapper = await mountSuspended(WineTypeSelector, {
      props: { modelValue: 'white' }
    })
    const whiteCard = wrapper.find('[data-testid="wine-type-white"]')
    expect(whiteCard.attributes('aria-checked')).toBe('true')

    const roseCard = wrapper.find('[data-testid="wine-type-rose"]')
    expect(roseCard.attributes('aria-checked')).toBe('false')

    const redCard = wrapper.find('[data-testid="wine-type-red"]')
    expect(redCard.attributes('aria-checked')).toBe('false')
  })

  it('applies selected styling classes to chosen card', async () => {
    const wrapper = await mountSuspended(WineTypeSelector, {
      props: { modelValue: 'red' }
    })
    const redCard = wrapper.find('[data-testid="wine-type-red"]')
    const classes = redCard.classes().join(' ')
    expect(classes).toContain('border-primary-500')
    expect(classes).toContain('shadow-sm')
  })

  it('shows check icon only on selected card', async () => {
    const wrapper = await mountSuspended(WineTypeSelector, {
      props: { modelValue: 'rosé' }
    })
    // Selected card has swatch + check icon (2 aria-hidden elements)
    const roseCard = wrapper.find('[data-testid="wine-type-rose"]')
    const roseHidden = roseCard.findAll('[aria-hidden="true"]')
    expect(roseHidden.length).toBeGreaterThanOrEqual(2)

    // Unselected card has only the swatch (1 aria-hidden element)
    const whiteCard = wrapper.find('[data-testid="wine-type-white"]')
    const whiteHidden = whiteCard.findAll('[aria-hidden="true"]')
    expect(whiteHidden).toHaveLength(1)
  })

  it('all cards meet minimum touch target size (56px)', async () => {
    const wrapper = await mountSuspended(WineTypeSelector)
    const cards = wrapper.findAll('[role="radio"]')
    for (const card of cards) {
      expect(card.classes().join(' ')).toContain('min-h-[56px]')
    }
  })

  it('uses radiogroup ARIA pattern with label', async () => {
    const wrapper = await mountSuspended(WineTypeSelector)
    const group = wrapper.find('[role="radiogroup"]')
    expect(group.exists()).toBe(true)
    expect(group.attributes('aria-label')).toBe('Wine type')
  })

  it('renders fieldset with legend', async () => {
    const wrapper = await mountSuspended(WineTypeSelector)
    expect(wrapper.find('fieldset').exists()).toBe(true)
    expect(wrapper.find('legend').text()).toBe('Wine Type')
  })
})
