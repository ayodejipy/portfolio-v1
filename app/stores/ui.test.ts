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
    expect(ui.bootProgress).toBe(0)
  })

  it('hands the fill to the intro and takes it back again', () => {
    const ui = useUiStore()

    ui.startBoot()
    expect(ui.booting).toBe(true)

    ui.setBootProgress(0.5)
    expect(ui.bootProgress).toBe(0.5)

    ui.finishBoot()
    expect(ui.booting).toBe(false)
    expect(ui.bootProgress).toBe(1)
  })

  it('clamps progress to the 0 to 1 range a timeline might overshoot', () => {
    const ui = useUiStore()

    ui.setBootProgress(1.4)
    expect(ui.bootProgress).toBe(1)

    ui.setBootProgress(-0.2)
    expect(ui.bootProgress).toBe(0)
  })

  it('restarts from zero when the intro runs again', () => {
    const ui = useUiStore()

    ui.setBootProgress(0.8)
    ui.startBoot()

    expect(ui.bootProgress).toBe(0)
  })
})
