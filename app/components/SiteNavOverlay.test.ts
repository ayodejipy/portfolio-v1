import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { navLinks } from '~/data/nav'
import { useUiStore } from '~/stores/ui'
import SiteNavOverlay from './SiteNavOverlay.vue'

describe('site nav overlay', () => {
  it('renders one link per nav entry, numbered from zero', async () => {
    const overlay = await mountSuspended(SiteNavOverlay)
    const links = overlay.findAll('.site-nav-overlay-link')

    expect(links).toHaveLength(navLinks.length)
    expect(links[0]?.text()).toContain('00')
    expect(links[0]?.text()).toContain(navLinks[0]?.label)
  })

  it('stays hidden until the store opens it', async () => {
    const overlay = await mountSuspended(SiteNavOverlay)
    const ui = useUiStore()

    ui.closeNav()
    await flushPromises()
    expect((overlay.element as HTMLElement).style.display).toBe('none')

    ui.openNav()
    await flushPromises()
    expect((overlay.element as HTMLElement).style.display).not.toBe('none')
  })

  it('closes on Escape', async () => {
    await mountSuspended(SiteNavOverlay)
    const ui = useUiStore()

    ui.openNav()
    await flushPromises()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()

    expect(ui.navOpen).toBe(false)
  })

  it('closes when a link is chosen', async () => {
    const overlay = await mountSuspended(SiteNavOverlay)
    const ui = useUiStore()

    ui.openNav()
    await flushPromises()

    await overlay.findAll('.site-nav-overlay-link')[0]?.trigger('click')
    await flushPromises()

    expect(ui.navOpen).toBe(false)
  })

  it('traps focus while open and hands it back on close', async () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    const overlay = await mountSuspended(SiteNavOverlay, { attachTo: document.body })
    const ui = useUiStore()

    ui.openNav()
    await flushPromises()
    expect(overlay.element.contains(document.activeElement)).toBe(true)

    ui.closeNav()
    await flushPromises()
    expect(document.activeElement).toBe(trigger)

    trigger.remove()
  })
})
