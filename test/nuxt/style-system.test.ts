import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h } from 'vue'

const StyleFixture = defineComponent({
  setup() {
    return () =>
      h('div', { 'data-testid': 'style-fixture' }, [
        h('h1', { 'data-testid': 'heading', class: 'font-editorial' }, 'Tasting Notes'),
        h('p', { 'data-testid': 'body-text', class: 'font-interface text-foreground' }, 'Interface text.'),
        h('p', { 'data-testid': 'muted-text', class: 'text-muted' }, 'Muted text.'),
        h('div', { 'data-testid': 'surface-card', class: 'bg-surface border-border rounded-card shadow-card p-md' }, 'Card.'),
        h('span', { 'data-testid': 'status-success', class: 'text-success' }, 'Success'),
        h('span', { 'data-testid': 'status-warning', class: 'text-warning' }, 'Warning'),
        h('span', { 'data-testid': 'status-danger', class: 'text-danger' }, 'Danger'),
        h('span', { 'data-testid': 'status-info', class: 'text-information' }, 'Information'),
        h('button', { 'data-testid': 'control-button', type: 'button', class: 'bg-action text-on-action px-md py-sm rounded-control' }, 'Action'),
        h('span', { 'data-testid': 'visually-hidden', class: 'visually-hidden' }, 'Hidden content'),
      ])
  },
})

describe('style system', () => {
  it('renders semantic headings and body markup', async () => {
    const { getByTestId } = await renderSuspended(StyleFixture)

    expect(getByTestId('heading')).toBeTruthy()
    expect(getByTestId('body-text')).toBeTruthy()
    expect(getByTestId('muted-text')).toBeTruthy()
  })

  it('applies font tokens', async () => {
    const { getByTestId } = await renderSuspended(StyleFixture)

    expect(getByTestId('heading').classList.contains('font-editorial')).toBe(true)
    expect(getByTestId('body-text').classList.contains('font-interface')).toBe(true)
  })

  it('applies semantic color tokens', async () => {
    const { getByTestId } = await renderSuspended(StyleFixture)

    expect(getByTestId('body-text').classList.contains('text-foreground')).toBe(true)
    expect(getByTestId('muted-text').classList.contains('text-muted')).toBe(true)
    expect(getByTestId('status-success').classList.contains('text-success')).toBe(true)
    expect(getByTestId('status-warning').classList.contains('text-warning')).toBe(true)
    expect(getByTestId('status-danger').classList.contains('text-danger')).toBe(true)
    expect(getByTestId('status-info').classList.contains('text-information')).toBe(true)
  })

  it('applies surface, border, and shadow tokens', async () => {
    const { getByTestId } = await renderSuspended(StyleFixture)

    const card = getByTestId('surface-card')
    expect(card.classList.contains('bg-surface')).toBe(true)
    expect(card.classList.contains('border-border')).toBe(true)
    expect(card.classList.contains('rounded-card')).toBe(true)
    expect(card.classList.contains('shadow-card')).toBe(true)
  })

  it('applies control tokens', async () => {
    const { getByTestId } = await renderSuspended(StyleFixture)

    const btn = getByTestId('control-button')
    expect(btn.classList.contains('bg-action')).toBe(true)
    expect(btn.classList.contains('text-on-action')).toBe(true)
    expect(btn.classList.contains('rounded-control')).toBe(true)
  })

  it('renders visually hidden content', async () => {
    const { getByTestId } = await renderSuspended(StyleFixture)

    const hidden = getByTestId('visually-hidden')
    expect(hidden.classList.contains('visually-hidden')).toBe(true)
    expect(hidden.textContent).toBe('Hidden content')
  })
})
