import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { useUiStore } from '~/stores/ui'
import SiteHeader from './SiteHeader.vue'

describe('site header', () => {
  it('toggles the nav overlay from its trigger', async () => {
    const header = await mountSuspended(SiteHeader)
    const toggle = header.get('.site-header-nav-toggle')

    expect(toggle.attributes('aria-expanded')).toBe('false')

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('false')
  })

  it('opens the command palette from its trigger', async () => {
    const header = await mountSuspended(SiteHeader)
    const ui = useUiStore()

    ui.closePalette()
    expect(ui.paletteOpen).toBe(false)

    await header.get('.site-header-command').trigger('click')
    expect(ui.paletteOpen).toBe(true)
  })
})
