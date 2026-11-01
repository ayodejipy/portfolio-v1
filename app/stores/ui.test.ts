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

  describe('surfaces that close in two steps', () => {
    it('opens the nav straight to open', () => {
      const ui = useUiStore()

      ui.openNav()

      expect(ui.navStatus).toBe('open')
      expect(ui.navOpen).toBe(true)
      expect(ui.navVisible).toBe(true)
    })

    /* Still painted, so an exit has something to animate, but no longer
       interactive, so focus and Escape have already moved on. */
    it('keeps the nav visible but not open while it leaves', () => {
      const ui = useUiStore()

      ui.openNav()
      ui.closeNav()

      expect(ui.navStatus).toBe('closing')
      expect(ui.navOpen).toBe(false)
      expect(ui.navVisible).toBe(true)
    })

    it('is gone once the exit finishes it', () => {
      const ui = useUiStore()

      ui.openNav()
      ui.closeNav()
      ui.finishCloseNav()

      expect(ui.navStatus).toBe('closed')
      expect(ui.navVisible).toBe(false)
    })

    it('does not start a second exit for a surface already leaving', () => {
      const ui = useUiStore()

      ui.openNav()
      ui.closeNav()
      ui.closeNav()

      expect(ui.navStatus).toBe('closing')
    })

    it('toggles from open to leaving and back to open', () => {
      const ui = useUiStore()

      ui.toggleNav()
      expect(ui.navStatus).toBe('open')

      ui.toggleNav()
      expect(ui.navStatus).toBe('closing')

      ui.toggleNav()
      expect(ui.navStatus).toBe('open')
    })

    it('runs the palette through the same three steps', () => {
      const ui = useUiStore()

      ui.openPalette()
      expect(ui.paletteOpen).toBe(true)

      ui.closePalette()
      expect(ui.paletteStatus).toBe('closing')
      expect(ui.paletteOpen).toBe(false)
      expect(ui.paletteVisible).toBe(true)

      ui.finishClosePalette()
      expect(ui.paletteVisible).toBe(false)
    })
  })
})
