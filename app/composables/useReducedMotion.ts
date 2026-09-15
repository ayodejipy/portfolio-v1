import { usePreferredReducedMotion } from '@vueuse/core'

/**
 * Gate any non-essential animation behind this. Per Phase 12: every
 * animated pattern (overlay, palette, cursor-follow, ruler marker,
 * hero reveal) should have a reduced-motion fallback.
 */
export function useReducedMotion() {
  const preference = usePreferredReducedMotion()
  return computed(() => preference.value === 'reduce')
}
