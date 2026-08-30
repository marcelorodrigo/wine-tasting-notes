import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { useFocusTrap } from '~/composables/useFocusTrap'

function createContainer(html: string): HTMLElement {
  const el = document.createElement('div')
  el.innerHTML = html
  document.body.appendChild(el)
  return el
}

describe('useFocusTrap', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = createContainer(`
      <button id="btn1">First</button>
      <input id="input1" />
      <a id="link1" href="#">Link</a>
    `)
  })

  afterEach(() => {
    container.remove()
  })

  it('focuses first focusable element on activate', () => {
    const { activate } = useFocusTrap()
    activate(container)
    expect(document.activeElement?.id).toBe('btn1')
  })

  it('focuses autofocus element when present', () => {
    container.innerHTML = `
      <button id="btn1">First</button>
      <input id="autofocus-input" autofocus />
    `
    const { activate } = useFocusTrap()
    activate(container)
    expect(document.activeElement?.id).toBe('autofocus-input')
  })

  it('focuses container when no focusable elements exist', () => {
    container.innerHTML = '<p>No focusable elements</p>'
    const { activate } = useFocusTrap()
    activate(container)
    expect(container.getAttribute('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(container)
  })

  it('traps Tab key from last to first element', () => {
    const { activate } = useFocusTrap()
    activate(container)
    const last = container.querySelector('#link1')!
    last.focus()
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    const preventSpy = vi.spyOn(event, 'preventDefault')
    container.dispatchEvent(event)
    expect(preventSpy).toHaveBeenCalled()
  })

  it('traps Shift+Tab from first to last element', () => {
    const { activate } = useFocusTrap()
    activate(container)
    const first = container.querySelector('#btn1')!
    first.focus()
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })
    const preventSpy = vi.spyOn(event, 'preventDefault')
    container.dispatchEvent(event)
    expect(preventSpy).toHaveBeenCalled()
  })

  it('does nothing on non-Tab keydown', () => {
    const { activate } = useFocusTrap()
    activate(container)
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    container.dispatchEvent(event)
    expect(document.activeElement?.id).toBe('btn1')
  })

  it('prevents default when no focusable elements and Tab pressed', () => {
    container.innerHTML = '<p>Nothing</p>'
    const { activate } = useFocusTrap()
    activate(container)
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    const preventSpy = vi.spyOn(event, 'preventDefault')
    container.dispatchEvent(event)
    expect(preventSpy).toHaveBeenCalled()
  })

  it('removes keydown listener on deactivate', () => {
    const { activate, deactivate } = useFocusTrap()
    activate(container)
    deactivate()
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    const preventSpy = vi.spyOn(event, 'preventDefault')
    container.dispatchEvent(event)
    expect(preventSpy).not.toHaveBeenCalled()
  })

  it('restores focus to trigger element', () => {
    const trigger = document.createElement('button')
    trigger.id = 'trigger'
    document.body.appendChild(trigger)
    // @ts-expect-error -- focus exists at runtime but not in happy-dom types
    const focusSpy = vi.spyOn(trigger, 'focus')

    const { activate, restoreFocus } = useFocusTrap()
    activate(container, trigger)
    restoreFocus()
    expect(focusSpy).toHaveBeenCalled()
    trigger.remove()
  })

  it('does not restore focus when trigger is disconnected', () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    const { activate, restoreFocus } = useFocusTrap()
    activate(container)
    trigger.remove()
    restoreFocus()
    expect(document.activeElement).not.toBe(trigger)
  })

  it('does not restore focus when trigger is disabled', () => {
    const trigger = document.createElement('button')
    trigger.disabled = true
    document.body.appendChild(trigger)

    const { activate, restoreFocus } = useFocusTrap()
    activate(container)
    restoreFocus()
    expect(document.activeElement).not.toBe(trigger)
    trigger.remove()
  })

  it('focusElement focuses matching element and returns true', () => {
    const input = container.querySelector('#input1')!
    // @ts-expect-error -- focus exists at runtime but not in happy-dom types
    const focusSpy = vi.spyOn(input, 'focus')
    const { focusElement } = useFocusTrap()
    const result = focusElement(container, '#input1')
    expect(result).toBe(true)
    expect(focusSpy).toHaveBeenCalled()
  })

  it('focusElement returns false when no match', () => {
    const { focusElement } = useFocusTrap()
    const result = focusElement(container, '#nonexistent')
    expect(result).toBe(false)
  })

  it('uses passed trigger element for restoreFocus', () => {
    const trigger = document.createElement('button')
    trigger.id = 'custom-trigger'
    document.body.appendChild(trigger)
    // @ts-expect-error -- focus exists at runtime but not in happy-dom types
    const focusSpy = vi.spyOn(trigger, 'focus')

    const { activate, restoreFocus } = useFocusTrap()
    activate(container, trigger)
    restoreFocus()
    expect(focusSpy).toHaveBeenCalled()
    trigger.remove()
  })
})
