import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { useInView } from './useInView'

const ids = ['one', 'two', 'three']

const Host = defineComponent({
  setup() {
    const inView = useInView(ids)
    return () => h('p', { class: 'seen' }, [...inView.value].join(' '))
  },
})

/**
 * Nothing in a test environment scrolls, so the observer never fires on its
 * own. This keeps the callback, so a test can say that something entered or
 * left the reading area.
 */
let observeSpy: ReturnType<typeof vi.fn>
let disconnectSpy: ReturnType<typeof vi.fn>
let notify: (changes: Record<string, boolean>) => void
let margin: string | undefined

function stubObserver() {
  vi.stubGlobal('IntersectionObserver', class {
    observe = observeSpy
    disconnect = disconnectSpy
    unobserve = vi.fn()
    takeRecords = vi.fn()

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      margin = options?.rootMargin
      notify = (changes: Record<string, boolean>) => callback(
        Object.entries(changes).map(([id, isIntersecting]) => ({
          isIntersecting,
          target: { id },
        }) as unknown as IntersectionObserverEntry),
        this as unknown as IntersectionObserver,
      )
    }
  })
}

beforeEach(() => {
  observeSpy = vi.fn()
  disconnectSpy = vi.fn()
  margin = undefined
  stubObserver()

  for (const id of ids) {
    const element = document.createElement('div')
    element.id = id
    document.body.appendChild(element)
  }
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('useInView', () => {
  it('starts with nothing in view', async () => {
    const wrapper = await mountSuspended(Host)

    expect(wrapper.get('.seen').text()).toBe('')
  })

  /* The difference from useActiveSection: more than one thing at a time. */
  it('holds everything that is in the reading area at once', async () => {
    const wrapper = await mountSuspended(Host)

    notify({ one: true, two: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.get('.seen').text()).toBe('one two')
  })

  it('drops what has left again', async () => {
    const wrapper = await mountSuspended(Host)

    notify({ one: true, two: true })
    await wrapper.vm.$nextTick()
    notify({ one: false })
    await wrapper.vm.$nextTick()

    expect(wrapper.get('.seen').text()).toBe('two')
  })

  it('trims the viewport rather than counting an edge as in view', async () => {
    await mountSuspended(Host)

    expect(margin).toBe('-20% 0px -20% 0px')
  })

  it('watches every element that is on the page', async () => {
    await mountSuspended(Host)

    expect(observeSpy).toHaveBeenCalledTimes(3)
  })

  it('stops observing once the component is gone', async () => {
    const wrapper = await mountSuspended(Host)
    wrapper.unmount()

    expect(disconnectSpy).toHaveBeenCalled()
  })

  it('still renders where IntersectionObserver is missing', async () => {
    vi.stubGlobal('IntersectionObserver', undefined)

    const wrapper = await mountSuspended(Host)

    expect(wrapper.get('.seen').text()).toBe('')
  })
})
