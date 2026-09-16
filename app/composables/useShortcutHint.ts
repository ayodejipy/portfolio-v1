import type { Ref } from 'vue'

/**
 * Label for the command palette's keyboard shortcut. It renders the Apple
 * form on the server and corrects itself once mounted, where the platform is
 * actually known, so the server and client markup still agree on first paint.
 */
export function useShortcutHint(): Ref<string> {
  const hint = ref('⌘K')

  onMounted(() => {
    const isApplePlatform = /mac|iphone|ipad|ipod/i.test(navigator.userAgent)

    hint.value = isApplePlatform ? '⌘K' : 'Ctrl K'
  })

  return hint
}
