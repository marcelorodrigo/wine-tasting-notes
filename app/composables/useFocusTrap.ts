const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter((el) => !el.hidden && el.offsetParent !== null)
}

export function useFocusTrap() {
  let triggerElement: HTMLElement | null = null
  let containerElement: HTMLElement | null = null
  let handler: ((event: KeyboardEvent) => void) | null = null

  function activate(container: HTMLElement, trigger?: HTMLElement | null) {
    containerElement = container
    triggerElement = trigger ?? (document.activeElement as HTMLElement | null)
    handler = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !containerElement) return
      const focusable = getFocusableElements(containerElement)
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    container.addEventListener('keydown', handler)
    const autofocus = container.querySelector<HTMLElement>('[autofocus]')
    if (autofocus) {
      autofocus.focus()
    } else if (focusable.length > 0) {
      focusable[0].focus()
    } else {
      container.setAttribute('tabindex', '-1')
      container.focus()
    }
  }

  function deactivate() {
    if (handler && containerElement) {
      containerElement.removeEventListener('keydown', handler)
    }
    handler = null
    containerElement = null
  }

  function restoreFocus() {
    if (triggerElement && triggerElement.isConnected && !triggerElement.hasAttribute('disabled')) {
      triggerElement.focus()
    }
  }

  function focusElement(container: HTMLElement, selector: string): boolean {
    const target = container.querySelector<HTMLElement>(selector)
    if (target) {
      target.focus()
      return true
    }
    return false
  }

  return { activate, deactivate, restoreFocus, focusElement }
}
