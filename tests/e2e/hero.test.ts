import type { Page } from 'playwright-core'
import { createPage, setup, url } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

/**
 * The hero's reveal, in a real browser.
 *
 * Unit tests cannot see this one at all: it is a CSS animation, and happy-dom
 * neither runs keyframes nor computes a transform matrix. Both failures this
 * suite exists for shipped past a green unit run during the pairing session
 * that wrote it. The headline ended its rise 120% below its own window,
 * because GSAP had folded the CSS hold into the transform it was building;
 * and before that, a JavaScript-driven version painted the finished hero and
 * snatched it back a frame later.
 */
await setup({
  browser: true,
  browserOptions: {
    type: 'chromium',
    launch: { channel: 'chrome' },
  },
})

/** Where each headline line is sitting, in px below its resting place. */
function lineOffsets(page: Page): Promise<number[]> {
  return page.evaluate(() => Array.from(
    document.querySelectorAll('.home-hero-line-inner'),
    element => Math.round(new DOMMatrix(getComputedStyle(element).transform).m42),
  ))
}

/**
 * Records where the headline was on the first frame it existed. Installed
 * before the page's own scripts, because by load the answer has changed.
 */
async function recordFirstFrame(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const state = window as unknown as { __heroStart: number | null }
    state.__heroStart = null

    const sample = () => {
      const inner = document.querySelector('.home-hero-line-inner')

      if (inner && state.__heroStart === null) {
        state.__heroStart = Math.round(new DOMMatrix(getComputedStyle(inner).transform).m42)
      }

      requestAnimationFrame(sample)
    }

    requestAnimationFrame(sample)
  })
}

function firstFrame(page: Page): Promise<number | null> {
  return page.evaluate(() => (window as unknown as { __heroStart: number | null }).__heroStart)
}

describe('hero reveal', () => {
  it('holds the headline below its window from the very first frame', async () => {
    const page = await createPage()
    await recordFirstFrame(page)

    await page.goto(url('/'))
    await page.waitForLoadState('networkidle')

    /* Not a number this test should pin: what matters is that the headline
       was already out of sight the first time anything could see it. */
    expect(await firstFrame(page)).toBeGreaterThan(40)

    await page.close()
  })

  it('lands every line flush in its window', async () => {
    const page = await createPage('/')
    await page.waitForLoadState('networkidle')

    await expect
      .poll(async () => (await lineOffsets(page)).every(offset => offset === 0), { timeout: 6000 })
      .toBe(true)

    expect(await lineOffsets(page)).toHaveLength(3)

    await page.close()
  })

  it('does not move the headline for a visitor who prefers reduced motion', async () => {
    const page = await createPage(undefined, { reducedMotion: 'reduce' })
    await recordFirstFrame(page)

    await page.goto(url('/'))
    await page.waitForLoadState('networkidle')

    expect(await firstFrame(page)).toBe(0)
    expect(await lineOffsets(page)).toEqual([0, 0, 0])

    await page.close()
  })
})
