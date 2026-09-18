import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useUiStore } from './ui'

describe('ui store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with the nav overlay and the palette closed', () => {
    const ui = useUiStore()

    expect(ui.navOpen).toBe(false)
    expect(ui.paletteOpen).toBe(false)
  })

  it('toggles the nav overlay open and closed', () => {
    const ui = useUiStore()

    ui.toggleNav()
    expect(ui.navOpen).toBe(true)

    ui.toggleNav()
    expect(ui.navOpen).toBe(false)
  })

  it('opens and closes the nav overlay through its actions', () => {
    const ui = useUiStore()

    ui.openNav()
    expect(ui.navOpen).toBe(true)

    ui.closeNav()
    expect(ui.navOpen).toBe(false)
  })

  it('opens and closes the palette through its actions', () => {
    const ui = useUiStore()

    ui.openPalette()
    expect(ui.paletteOpen).toBe(true)

    ui.closePalette()
    expect(ui.paletteOpen).toBe(false)
  })
})
