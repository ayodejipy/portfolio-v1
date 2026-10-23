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

  /*
    The intro seam. With no animation written, nothing calls these and the
    rail reports sections as usual, which is what the first test pins.
  */
  it('leaves the intro off until something starts it', () => {
    const ui = useUiStore()

    expect(ui.booting).toBe(false)
  })

  it('raises and lowers the flag that says an intro owns the rail', () => {
    const ui = useUiStore()

    ui.startBoot()
    expect(ui.booting).toBe(true)

    ui.finishBoot()
    expect(ui.booting).toBe(false)
  })
})
