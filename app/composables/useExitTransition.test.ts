import type { Ref } from 'vue'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, h, ref } from 'vue'
import { useExitTransition } from './useExitTransition'

const prefersReducedMotion = ref(false)

mockNuxtImport('useReducedMotion', () => () => computed(() => prefersReducedMotion.value))

function mountWith(closing: Ref<boolean>, finish: () => void, play?: (done: () => void) => void) {
  const Host = defineComponent({
    setup() {
      useExitTransition(closing, finish, play)
      return () => h('div')
    },
  })

  return mountSuspended(Host)
}

beforeEach(() => {
  prefersReducedMotion.value = false
})

describe('useExitTransition', () => {
  /* The failure that matters: a surface asked to leave, nothing to animate
     it, and no one to finish it, sitting there with the scroll locked. */
  it('finishes straight away when there is no timeline', async () => {
    const closing = ref(false)
    const finish = vi.fn()

    await mountWith(closing, finish)

    closing.value = true
    await flushPromises()

    expect(finish).toHaveBeenCalledTimes(1)
  })

  it('hands the timeline a done it can call when it lands', async () => {
    const closing = ref(false)
    const finish = vi.fn()
    let done: (() => void) | null = null

    await mountWith(closing, finish, (given) => {
      done = given
    })

    closing.value = true
    await flushPromises()

    expect(finish).not.toHaveBeenCalled()

    done!()
    expect(finish).toHaveBeenCalledTimes(1)
  })

  it('ignores a timeline that calls done more than once', async () => {
    const closing = ref(false)
    const finish = vi.fn()

    await mountWith(closing, finish, (done) => {
      done()
      done()
      done()
    })

    closing.value = true
    await flushPromises()

    expect(finish).toHaveBeenCalledTimes(1)
  })

  it('skips the timeline for a visitor who prefers reduced motion', async () => {
    prefersReducedMotion.value = true
    const closing = ref(false)
    const finish = vi.fn()
    const play = vi.fn()

    await mountWith(closing, finish, play)

    closing.value = true
    await flushPromises()

    expect(play).not.toHaveBeenCalled()
    expect(finish).toHaveBeenCalledTimes(1)
  })

  it('does nothing while the surface is not leaving', async () => {
    const closing = ref(true)
    const finish = vi.fn()

    await mountWith(closing, finish)
    await flushPromises()

    expect(finish).not.toHaveBeenCalled()
  })
})
