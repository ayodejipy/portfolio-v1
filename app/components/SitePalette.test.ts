import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { paletteCommands } from '~/data/commands'
import { useUiStore } from '~/stores/ui'
import SitePalette from './SitePalette.vue'

const { navigateToMock } = vi.hoisted(() => ({ navigateToMock: vi.fn() }))

mockNuxtImport('navigateTo', () => navigateToMock)

/**
 * Each palette listens on document for the shortcut keys, so an instance left
 * mounted keeps reacting to later tests' key events. Every mount is tracked
 * and torn down between tests.
 */
const mounted: { unmount: () => void }[] = []

async function mountPalette() {
  const palette = await mountSuspended(SitePalette)

  mounted.push(palette)

  return palette
}

beforeEach(() => {
  navigateToMock.mockClear()
})

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  useUiStore().closePalette()
})

describe('site palette', () => {
  it('lists every command when the query is empty', async () => {
    const palette = await mountPalette()

    expect(palette.findAll('.site-palette-item')).toHaveLength(paletteCommands.length)
  })

  it('filters the list as the query is typed', async () => {
    const palette = await mountPalette()

    await palette.get('.site-palette-input').setValue('résumé')
    await flushPromises()

    const labels = palette.findAll('.site-palette-item-label').map(item => item.text())

    expect(labels).toEqual(['Résumé'])
  })

  it('matches an accented label from a query typed without accents', async () => {
    const palette = await mountPalette()

    await palette.get('.site-palette-input').setValue('resume')
    await flushPromises()

    const labels = palette.findAll('.site-palette-item-label').map(item => item.text())

    expect(labels).toEqual(['Résumé'])
  })

  it('reports no matches for a query that matches nothing', async () => {
    const palette = await mountPalette()

    await palette.get('.site-palette-input').setValue('nothing matches this')
    await flushPromises()

    expect(palette.findAll('.site-palette-item')).toHaveLength(0)
    expect(palette.get('.site-palette-empty').text()).toBe('No matches')
  })

  it('opens and closes on the command shortcut', async () => {
    await mountPalette()
    const ui = useUiStore()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    await flushPromises()
    expect(ui.paletteOpen).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
    await flushPromises()
    expect(ui.paletteOpen).toBe(false)
  })

  it('moves the selection with the arrow keys and wraps at the ends', async () => {
    const palette = await mountPalette()
    const ui = useUiStore()

    ui.openPalette()
    await flushPromises()

    const selectedLabel = (): string =>
      palette.get('.site-palette-item.is-selected .site-palette-item-label').text()

    expect(selectedLabel()).toBe(paletteCommands[0]?.label)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    await flushPromises()
    expect(selectedLabel()).toBe(paletteCommands[1]?.label)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    await flushPromises()
    expect(selectedLabel()).toBe(paletteCommands[0]?.label)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    await flushPromises()
    expect(selectedLabel()).toBe(paletteCommands[paletteCommands.length - 1]?.label)
  })

  it('runs the selected command on Enter and closes', async () => {
    await mountPalette()
    const ui = useUiStore()

    ui.openPalette()
    await flushPromises()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    await flushPromises()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    await flushPromises()

    expect(navigateToMock).toHaveBeenCalledWith(paletteCommands[1]?.to)
    expect(ui.paletteOpen).toBe(false)
  })

  it('closes on Escape', async () => {
    await mountPalette()
    const ui = useUiStore()

    ui.openPalette()
    await flushPromises()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()

    expect(ui.paletteOpen).toBe(false)
  })
})
