import type { Ref } from 'vue'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Holds keyboard focus inside `container` while `active` is true, then hands
 * focus back to whatever held it before. Tab and Shift+Tab wrap at the ends
 * rather than escaping to the page behind.
 */
export function useFocusTrap(container: Ref<HTMLElement | null>, active: Ref<boolean>): void {
  let previouslyFocused: HTMLElement | null = null

  function focusableItems(): HTMLElement[] {
    const root = container.value

    if (!root) {
      return []
    }

    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
  }

  function onKeydown(event: KeyboardEvent): void {
    if (!active.value || event.key !== 'Tab') {
      return
    }

    const items = focusableItems()
    const first = items[0]
    const last = items[items.length - 1]

    if (!first || !last) {
      return
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    }
    else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  watch(active, async (isActive) => {
    if (isActive) {
      previouslyFocused = document.activeElement as HTMLElement | null
      await nextTick()
      focusableItems()[0]?.focus()
      return
    }

    previouslyFocused?.focus()
    previouslyFocused = null
  })

  onMounted(() => {
    document.addEventListener('keydown', onKeydown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
  })
}
