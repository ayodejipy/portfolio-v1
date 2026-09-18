import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { useShortcutHint } from './useShortcutHint'

function mountWithUserAgent(userAgent: string) {
  vi.stubGlobal('navigator', { ...globalThis.navigator, userAgent })

  const host = defineComponent({
    setup() {
      const hint = useShortcutHint()

      return () => h('span', hint.value)
    },
  })

  return mountSuspended(host)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('use shortcut hint', () => {
  it('shows the command symbol on Apple platforms', async () => {
    const host = await mountWithUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')

    expect(host.text()).toBe('⌘K')
  })

  it('shows the control form elsewhere', async () => {
    const host = await mountWithUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')

    expect(host.text()).toBe('Ctrl K')
  })
})
