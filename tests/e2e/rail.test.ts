import type { Page } from 'playwright-core'
import { createPage, setup, url } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

/**
 * The rail's fill, in a real browser.
 *
 * Unit tests cannot see this: the fill is a CSS custom property written by
 * GSAP, and a ScrollTrigger needs a page with a real height, a real scrollbar
 * and real frames. The one bug this suite exists to catch shipped green
 * through 101 unit tests: the scroll sync was created while the element sat
 * at 100%, so it tweened 100% to 100% and the fill never moved again.
 *
 * The rail only renders above 1360px, so every page here is given a viewport
 * wide enough for it.
 */
await setup({
  browser: true,
  browserOptions: {
    type: 'chromium',
    launch: { channel: 'chrome' },
  },
})

const WIDE = { width: 1440, height: 900 }

/** The fill, as a number, read from the property the timelines write. */
async function fillPercent(page: Page): Promise<number> {
  const value = await page.locator('.site-rail').evaluate(
    element => (element as HTMLElement).style.getPropertyValue('--rail-progress'),
  )

  return Number.parseFloat(value) || 0
}

/** Scrolls to a fraction of the page and lets the scrub catch up. */
async function scrollTo(page: Page, fraction: number): Promise<void> {
  await page.evaluate((f) => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo(0, Math.round(scrollable * f))
  }, fraction)

  await page.waitForTimeout(900)
}

describe('rail fill', () => {
  it('sweeps on first paint, then settles to the top of the page', async () => {
    const page = await createPage(undefined, { viewport: WIDE })

    /*
      The recorder is installed before the page's own scripts, because the
      sweep is over in 0.8s and anything that starts sampling after the load
      has already missed it. Two earlier versions of this test read 85% and
      then 71%: both were watching the drain, not the sweep.
    */
    await page.addInitScript(() => {
      const state = window as unknown as { __railPeak: number }
      state.__railPeak = 0

      const sample = () => {
        const rail = document.querySelector('.site-rail') as HTMLElement | null

        if (rail) {
          const value = Number.parseFloat(rail.style.getPropertyValue('--rail-progress')) || 0
          state.__railPeak = Math.max(state.__railPeak, value)
        }

        requestAnimationFrame(sample)
      }

      requestAnimationFrame(sample)
    })

    await page.goto(url('/'))
    await page.waitForLoadState('networkidle')

    const peak = () => page.evaluate(() => (window as unknown as { __railPeak: number }).__railPeak)
    await expect.poll(peak, { timeout: 6000 }).toBeGreaterThan(90)

    // Then it drains to the reader's position, which here is the top.
    await expect.poll(() => fillPercent(page), { timeout: 6000 }).toBeLessThan(2)

    await page.close()
  })

  /* The case that broke: after the intro hands over, does scroll still move
     the fill? A tween created at 100% would pass every test above and fail
     this one. */
  it('tracks scroll position after the intro has handed over', async () => {
    const page = await createPage('/', { viewport: WIDE })
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1600)

    await scrollTo(page, 0.25)
    expect(await fillPercent(page)).toBeGreaterThan(20)
    expect(await fillPercent(page)).toBeLessThan(30)

    await scrollTo(page, 0.75)
    expect(await fillPercent(page)).toBeGreaterThan(70)
    expect(await fillPercent(page)).toBeLessThan(80)

    await scrollTo(page, 0)
    expect(await fillPercent(page)).toBeLessThan(5)

    await page.close()
  })

  /* A hash skips the intro, so nothing hands over and the scroll sync has to
     start on its own. Forgetting that path leaves a dead rail. */
  it('tracks scroll when the intro is skipped by a deep link', async () => {
    const page = await createPage('/#contact', { viewport: WIDE })
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1200)

    await scrollTo(page, 0.3)
    expect(await fillPercent(page)).toBeGreaterThan(25)
    expect(await fillPercent(page)).toBeLessThan(35)

    await page.close()
  })
})
