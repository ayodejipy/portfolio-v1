import type { RailIntroControls } from './useRailIntro'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { useUiStore } from '~/stores/ui'
import { resetRailIntroForTests, useRailIntro } from './useRailIntro'

const prefersReducedMotion = ref(false)
const currentHash = ref('')

mockNuxtImport('useReducedMotion', () => () => computed(() => prefersReducedMotion.value))
mockNuxtImport('useRoute', () => () => ({ hash: currentHash.value }))

function mountWith(timeline: (controls: RailIntroControls) => void) {
  const Host = defineComponent({
    setup() {
      useRailIntro(timeline)
      return () => h('div')
    },
  })

  return mountSuspended(Host)
}

beforeEach(() => {
  setActivePinia(createPinia())
  resetRailIntroForTests()
  prefersReducedMotion.value = false
  currentHash.value = ''
  vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useRailIntro', () => {
  it('hands the rail to the timeline and takes it back on done', async () => {
    let controls: RailIntroControls | null = null
    await mountWith((given) => {
      controls = given
    })

    const ui = useUiStore()

    expect(ui.booting).toBe(true)
    expect(controls).not.toBeNull()

    controls!.done()
    expect(ui.booting).toBe(false)
  })

  it('does not run for a visitor who prefers reduced motion', async () => {
    prefersReducedMotion.value = true
    const timeline = vi.fn()

    await mountWith(timeline)

    expect(timeline).not.toHaveBeenCalled()
    expect(useUiStore().booting).toBe(false)
  })

  /* A hash means they asked for a section, so filling 0 to 100 and snapping
     to that section would read as a glitch. */
  it('does not run when the url points at a section', async () => {
    currentHash.value = '#contact'
    const timeline = vi.fn()

    await mountWith(timeline)

    expect(timeline).not.toHaveBeenCalled()
  })

  it('does not run when the page is already scrolled', async () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(1200)
    const timeline = vi.fn()

    await mountWith(timeline)

    expect(timeline).not.toHaveBeenCalled()
  })

  it('runs once per page load, not on every return to the home page', async () => {
    const timeline = vi.fn()

    await mountWith(timeline)
    await mountWith(timeline)

    expect(timeline).toHaveBeenCalledTimes(1)
  })
})
