import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ProfileSelector from '~/components/results/ProfileSelector.vue'

describe('ProfileSelector', () => {

  it('renders all 4 profile options', async () => {
    const wrapper = await mountSuspended(ProfileSelector)
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios).toHaveLength(4)
  })

  it('renders profile labels', async () => {
    const wrapper = await mountSuspended(ProfileSelector)
    expect(wrapper.text()).toContain('Professional')
    expect(wrapper.text()).toContain('Casual')
    expect(wrapper.text()).toContain('Bar Talk')
    expect(wrapper.text()).toContain('Playful')
  })

  it('defaults to professional profile', async () => {
    const wrapper = await mountSuspended(ProfileSelector)
    const professional = wrapper.find('[data-testid="profile-professional"]')
    expect(professional.attributes('aria-checked')).toBe('true')
  })

  it('respects initial modelValue', async () => {
    const wrapper = await mountSuspended(ProfileSelector, {
      props: { modelValue: 'playful' }
    })
    const playful = wrapper.find('[data-testid="profile-playful"]')
    expect(playful.attributes('aria-checked')).toBe('true')
    const professional = wrapper.find('[data-testid="profile-professional"]')
    expect(professional.attributes('aria-checked')).toBe('false')
  })

  it('emits update:modelValue when a profile is clicked', async () => {
    const wrapper = await mountSuspended(ProfileSelector)
    const casual = wrapper.find('[data-testid="profile-casual"]')
    await casual.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['casual'])
  })

  it.each(['casual', 'bartalk', 'playful'])('can select %s profile', async (profile) => {
    const wrapper = await mountSuspended(ProfileSelector)
    const option = wrapper.find(`[data-testid="profile-${profile}"]`)
    await option.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([profile])
  })

  it('clicking already-selected profile does not re-emit', async () => {
    const wrapper = await mountSuspended(ProfileSelector)
    const professional = wrapper.find('[data-testid="profile-professional"]')
    await professional.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('has proper radiogroup role on container', async () => {
    const wrapper = await mountSuspended(ProfileSelector)
    const group = wrapper.find('[role="radiogroup"]')
    expect(group.exists()).toBe(true)
    expect(group.attributes('aria-label')).toBe('Tasting note style')
  })

  it('shows fieldset legend', async () => {
    const wrapper = await mountSuspended(ProfileSelector)
    const legend = wrapper.find('legend')
    expect(legend.text()).toBe('Tasting Note Style')
  })

  it('navigates with ArrowRight key', async () => {
    const wrapper = await mountSuspended(ProfileSelector)
    const professional = wrapper.find('[data-testid="profile-professional"]')
    await professional.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['casual'])
  })

  it('wraps around with ArrowRight from last item', async () => {
    const wrapper = await mountSuspended(ProfileSelector, {
      props: { modelValue: 'playful' }
    })
    const playful = wrapper.find('[data-testid="profile-playful"]')
    await playful.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['professional'])
  })

  it('navigates with ArrowLeft key', async () => {
    const wrapper = await mountSuspended(ProfileSelector, {
      props: { modelValue: 'casual' }
    })
    const casual = wrapper.find('[data-testid="profile-casual"]')
    await casual.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['professional'])
  })

  it('sets correct tabindex for selected item', async () => {
    const wrapper = await mountSuspended(ProfileSelector, {
      props: { modelValue: 'bartalk' }
    })
    const bartalk = wrapper.find('[data-testid="profile-bartalk"]')
    expect(bartalk.attributes('tabindex')).toBe('0')
    const professional = wrapper.find('[data-testid="profile-professional"]')
    expect(professional.attributes('tabindex')).toBe('-1')
  })

  it('selects on Enter key', async () => {
    const wrapper = await mountSuspended(ProfileSelector)
    const casual = wrapper.find('[data-testid="profile-casual"]')
    await casual.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['casual'])
  })

  it('selects on Space key', async () => {
    const wrapper = await mountSuspended(ProfileSelector)
    const bartalk = wrapper.find('[data-testid="profile-bartalk"]')
    await bartalk.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['bartalk'])
  })
})
