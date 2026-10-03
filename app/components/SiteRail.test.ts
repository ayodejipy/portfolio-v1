import type { PageSection } from '~/data/sections'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SiteRail from './SiteRail.vue'

const sections: PageSection[] = [
  { id: 'index', label: 'Index' },
  { id: 'work', label: 'Work' },
  { id: 'resume', label: 'Résumé' },
  { id: 'contact', label: 'Contact' },
]

/**
 * The rail's active state comes from an IntersectionObserver, which nothing
 * in a test environment will fire on its own. This stands in for it, keeping
 * the callback so a test can say a section crossed the reading line.
 */
let observeSpy: ReturnType<typeof vi.fn>
let disconnectSpy: ReturnType<typeof vi.fn>
let notify: (id: string) => void

beforeEach(() => {
  observeSpy = vi.fn()
  disconnectSpy = vi.fn()

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

  for (const section of sections) {
    const element = document.createElement('section')
    element.id = section.id
    document.body.appendChild(element)
  }
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('site rail', () => {
  it('lists every section as a numbered link to it', async () => {
    const wrapper = await mountSuspended(SiteRail, { props: { sections } })
    const links = wrapper.findAll('.site-rail-link')

    expect(links).toHaveLength(4)
    expect(links.map(link => link.attributes('href'))).toEqual([
      '#index',
      '#work',
      '#resume',
      '#contact',
    ])
  })

  it('keeps the number and the label separate words for a screen reader', async () => {
    const wrapper = await mountSuspended(SiteRail, { props: { sections } })

    expect(wrapper.findAll('.site-rail-link')[3]?.text()).toBe('03 Contact')
  })

  it('spaces the ticks evenly along the track', async () => {
    const wrapper = await mountSuspended(SiteRail, { props: { sections } })
    const offsets = wrapper.findAll('.site-rail-tick').map(tick => tick.attributes('style'))

    expect(offsets).toEqual([
      'top: 0%;',
      'top: 33.33%;',
      'top: 66.67%;',
      'top: 100%;',
    ])
  })

  it('starts on the first section and marks it as current', async () => {
    const wrapper = await mountSuspended(SiteRail, { props: { sections } })

    expect(wrapper.get('.site-rail-tick.is-active .site-rail-link').text()).toBe('00 Index')
    expect(wrapper.get('[aria-current="true"]').attributes('href')).toBe('#index')
    expect(wrapper.get('.site-rail').attributes('style')).toBe('--rail-progress: 0%;')
  })

  it('watches every section that is on the page', async () => {
    await mountSuspended(SiteRail, { props: { sections } })

    expect(observeSpy).toHaveBeenCalledTimes(4)
  })

  it('follows the section that crosses the reading line', async () => {
    const wrapper = await mountSuspended(SiteRail, { props: { sections } })

    notify('resume')
    await wrapper.vm.$nextTick()

    expect(wrapper.get('.site-rail-tick.is-active .site-rail-link').text()).toBe('02 Résumé')
    expect(wrapper.get('[aria-current="true"]').attributes('href')).toBe('#resume')
    expect(wrapper.get('.site-rail').attributes('style')).toBe('--rail-progress: 66.67%;')
  })

  it('stops observing once it is gone', async () => {
    const wrapper = await mountSuspended(SiteRail, { props: { sections } })
    wrapper.unmount()

    expect(disconnectSpy).toHaveBeenCalled()
  })
})
