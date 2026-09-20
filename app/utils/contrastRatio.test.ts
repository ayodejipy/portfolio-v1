import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { contrastRatio } from './contrastRatio'

const AA_NORMAL_TEXT = 4.5

/**
 * Reads the real tokens, so a palette edit cannot quietly fail AA. Resolved
 * from the project root: in this test environment import.meta.url is an http
 * URL, not a file path.
 */
function paletteTokens(): Record<string, string> {
  const css = readFileSync(resolve(process.cwd(), 'app/assets/css/main.css'), 'utf8')
  const found: Record<string, string> = {}

  for (const match of css.matchAll(/(--[a-z-]+):\s*(#[0-9a-f]{6})/gi)) {
    found[match[1]!] = match[2]!
  }

  return found
}

describe('contrast ratio', () => {
  it('is 21 for black against white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBe(21)
  })

  it('is 1 for a colour against itself', () => {
    expect(contrastRatio('#a8321f', '#a8321f')).toBe(1)
  })

  it('does not depend on the order of the arguments', () => {
    expect(contrastRatio('#1c1a17', '#f3f0ea')).toBe(contrastRatio('#f3f0ea', '#1c1a17'))
  })
})

describe('palette tokens clear WCAG AA for normal text', () => {
  const token = paletteTokens()

  it('body text on the page', () => {
    expect(contrastRatio(token['--ink']!, token['--bg']!)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT)
  })

  it('secondary text on the page', () => {
    expect(contrastRatio(token['--ink-soft']!, token['--bg']!)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT)
  })

  it('accent text on the page', () => {
    expect(contrastRatio(token['--accent']!, token['--bg']!)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT)
  })

  it('links on the nav overlay', () => {
    expect(contrastRatio(token['--bg']!, token['--overlay']!)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT)
  })

  it('numerals on the nav overlay', () => {
    expect(contrastRatio(token['--accent-on-dark']!, token['--overlay']!)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT)
  })
})
