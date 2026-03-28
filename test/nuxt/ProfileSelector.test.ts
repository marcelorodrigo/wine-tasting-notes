import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ProfileSelector from '~/components/results/ProfileSelector.vue'

describe('ProfileSelector', () => {
  it('renders all 4 profile options', async () => {
    const wrapper = await mountSuspended(ProfileSelector)
    expect(wrapper.text()).toContain('Professional')
    expect(wrapper.text()).toContain('Casual')
    expect(wrapper.text()).toContain('Bar Talk')
    expect(wrapper.text()).toContain('Playful')
  })

  it('respects initial modelValue', async () => {
    const wrapper = await mountSuspended(ProfileSelector, {
      props: { modelValue: 'playful' }
    })
    const playful = wrapper.find('[data-testid="profile-playful"]')
    const icon = playful.find('.size-6')
    expect(icon.classes()).toContain('text-primary-500') // icon color when selected
  })

  it('emits update:modelValue when an option is clicked', async () => {
    const wrapper = await mountSuspended(ProfileSelector)
    const casual = wrapper.find('[data-testid="profile-casual"]')
    await casual.trigger('click')

    // Nuxt UI might handle the click, we'll just check if update:modelValue is emitted
    // or we might need to trigger click on the actual input
    const input = wrapper.find('input[value="casual"]')
    if (input.exists()) {
      await input.setValue()
    }
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('shows fieldset legend', async () => {
    const wrapper = await mountSuspended(ProfileSelector)
    expect(wrapper.text()).toContain('Tasting Note Style')
  })
})
