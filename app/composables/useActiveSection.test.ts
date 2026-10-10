import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { useActiveSection } from './useActiveSection'

const ids = ['index', 'work', 'resume', 'contact']

const Host = defineComponent({
  setup() {
    const activeId = useActiveSection(ids)
    return () => h('p', { class: 'active' }, activeId.value)
  },
})

/**
 * Nothing in a test environment scrolls, so the observer never fires on its
 * own. This stands in for it and keeps the callback, so a test can say that
 * a section crossed the reading line.
 */
let observeSpy: ReturnType<typeof vi.fn>
let disconnectSpy: ReturnType<typeof vi.fn>
let notify: (id: string) => void

function stubObserver() {
  vi.stubGlobal('IntersectionObserver', class {
    observe = observeSpy
    disconnect = disconnectSpy
    unobserve = vi.fn()
    takeRecords = vi.fn()

    constructor(callback: IntersectionObserverCallback) {
      notify = (id: string) => callback(
        [{ isIntersecting: true, target: { id } } as unknown as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
      )
    }
  })
}

beforeEach(() => {
  observeSpy = vi.fn()
  disconnectSpy = vi.fn()
  stubObserver()

  for (const id of ids) {
    const section = document.createElement('section')
    section.id = id
    document.body.appendChild(section)
  }
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('useActiveSection', () => {
  it('starts on the first section', async () => {
    const wrapper = await mountSuspended(Host)

    expect(wrapper.get('.active').text()).toBe('index')
  })

  it('watches every section that is on the page', async () => {
    await mountSuspended(Host)

    expect(observeSpy).toHaveBeenCalledTimes(4)
  })

  it('follows the section that crosses the reading line', async () => {
    const wrapper = await mountSuspended(Host)

    notify('resume')
    await wrapper.vm.$nextTick()

    expect(wrapper.get('.active').text()).toBe('resume')
  })

  it('stops observing once the component is gone', async () => {
    const wrapper = await mountSuspended(Host)
    wrapper.unmount()

    expect(disconnectSpy).toHaveBeenCalled()
  })

  it('still renders where IntersectionObserver is missing', async () => {
    vi.stubGlobal('IntersectionObserver', undefined)

    const wrapper = await mountSuspended(Host)

    expect(wrapper.get('.active').text()).toBe('index')
  })
})
