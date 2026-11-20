import type { Page } from 'playwright-core'
import { createPage, setup, url } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

/**
 * Smooth scrolling, in a real browser.
 *
 * Lenis is mounted with its own requestAnimationFrame loop switched off, so
 * that GSAP's ticker is the single clock the page animates on. The cost of
 * that arrangement is a failure mode no unit test can see: if nothing calls
 * `raf`, Lenis still swallows the wheel and the page simply never moves.
 * These tests use a real wheel gesture because that is the only path that
 * goes through Lenis at all; `window.scrollTo` would pass straight by it.
 */
await setup({
  browser: true,
  browserOptions: {
    type: 'chromium',
    launch: { channel: 'chrome' },
  },
})

const WHEEL = 800

/** Records scrollY every frame, so the shape of a scroll can be read back. */
async function recordScroll(page: Page): Promise<void> {
  await page.evaluate(() => {
    const state = window as unknown as { __scrollTrail: number[] }
    state.__scrollTrail = []

    const sample = () => {
      state.__scrollTrail.push(Math.round(window.scrollY))
      requestAnimationFrame(sample)
    }

    requestAnimationFrame(sample)
  })
}

function trail(page: Page): Promise<number[]> {
  return page.evaluate(() => (window as unknown as { __scrollTrail: number[] }).__scrollTrail)
}

/** A wheel gesture over the middle of the page, as a pointer would send it. */
async function wheel(page: Page, by = WHEEL): Promise<void> {
  await page.mouse.move(700, 450)
  await page.mouse.wheel(0, by)
}

async function ready(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle')
  // Past the hero reveal and the rail's intro, so neither is still moving.
  await page.waitForTimeout(1800)
}

describe('page scroll', () => {
  /* The dead-page guard. Everything else here is detail by comparison. */
  it('moves the page when the wheel is turned', async () => {
    const page = await createPage('/')
    await ready(page)

    await wheel(page)
    await expect.poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 4000 })
      .toBeGreaterThan(WHEEL * 0.9)

    await page.close()
  })

  it('eases to the new position instead of jumping to it', async () => {
    const page = await createPage('/')
    await ready(page)
    await recordScroll(page)

    await wheel(page)
    await page.waitForTimeout(1200)

    const positions = await trail(page)
    const partway = positions.filter(y => y > 10 && y < WHEEL * 0.9)

    /* An instant scroll shows 0 and then the destination, and nothing in
       between. Easing leaves a trail of frames partway there. */
    expect(new Set(partway).size).toBeGreaterThan(4)
    expect(positions[positions.length - 1]).toBeGreaterThan(WHEEL * 0.9)

    await page.close()
  })

  it('holds the page still while the nav overlay is open, and lets go after', async () => {
    const page = await createPage('/')
    await ready(page)

    await page.locator('.site-header-nav-toggle').click()
    await page.locator('#site-nav-overlay').waitFor({ state: 'visible' })
    await page.waitForTimeout(400)

    await wheel(page)
    await page.waitForTimeout(700)
    expect(await page.evaluate(() => Math.round(window.scrollY))).toBe(0)

    await page.keyboard.press('Escape')
    await page.locator('#site-nav-overlay').waitFor({ state: 'hidden' })

    await wheel(page)
    await expect.poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 4000 })
      .toBeGreaterThan(WHEEL * 0.9)

    await page.close()
  })

  /* Reduced motion keeps Lenis mounted, for the scroll lock, but hands the
     wheel back to the browser. The trail is the proof: no frames partway. */
  it('scrolls instantly for a visitor who prefers reduced motion', async () => {
    const page = await createPage(undefined, { reducedMotion: 'reduce' })
    await page.goto(url('/'))
    await ready(page)
    await recordScroll(page)

    await wheel(page, 500)
    await page.waitForTimeout(400)

    const positions = await trail(page)
    const partway = positions.filter(y => y > 10 && y < 500 * 0.9)

    expect(partway).toHaveLength(0)
    expect(positions[positions.length - 1]).toBe(500)

    await page.close()
  })
})
