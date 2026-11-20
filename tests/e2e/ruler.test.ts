import type { Page } from 'playwright-core'
import { createPage, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

/**
 * The résumé ruler, in a real browser.
 *
 * Three things move together here and the point of this suite is that they
 * agree: the marker, which is scrubbed by a ScrollTrigger; the lit year,
 * which comes from an IntersectionObserver at the same reading line; and the
 * coordinate readout, written straight to the DOM on every scroll frame.
 * Each is driven by a different mechanism, so each can drift from the other
 * two without anything throwing.
 *
 * The ruler and the readout only render above 1360px, so every page here is
 * given a viewport wide enough for them.
 */
await setup({
  browser: true,
  browserOptions: {
    type: 'chromium',
    launch: { channel: 'chrome' },
  },
})

const WIDE = { width: 1440, height: 900 }

/** Where the reading line sits in the viewport: 40% down, as the rail has it. */
function readingLine(page: Page): Promise<number> {
  return page.evaluate(() => Math.round(window.innerHeight * 0.4))
}

/** The ruler's page position and height, which the scrolling below is in terms of. */
function rulerBox(page: Page): Promise<{ top: number, height: number }> {
  return page.evaluate(() => {
    const box = document.querySelector('.resume-timeline-ruler')!.getBoundingClientRect()

    return { top: Math.round(window.scrollY + box.top), height: Math.round(box.height) }
  })
}

/** Scrolls so that the given fraction of the ruler has passed the reading line. */
async function scrollThroughRuler(page: Page, fraction: number): Promise<void> {
  const { top, height } = await rulerBox(page)
  const line = await readingLine(page)

  await page.evaluate(y => window.scrollTo(0, y), Math.round(top - line + height * fraction))
  await page.waitForTimeout(900)
}

function markerProgress(page: Page): Promise<number> {
  return page.evaluate(() => Number.parseFloat(
    (document.querySelector('.resume-timeline-ruler') as HTMLElement)
      .style.getPropertyValue('--marker-progress'),
  ) || 0)
}

function state(page: Page) {
  return page.evaluate(() => {
    const entries = Array.from(document.querySelectorAll('.resume-timeline-entry'))
    const readout = document.querySelector('.resume-timeline-readout')!

    return {
      markerTop: Math.round(document.querySelector('.resume-timeline-marker')!.getBoundingClientRect().top),
      active: entries.filter(entry => entry.classList.contains('is-active')).length,
      activeIndex: entries.findIndex(entry => entry.classList.contains('is-active')),
      inView: entries.filter(entry => entry.classList.contains('is-in-view')).length,
      readout: readout.textContent!.trim(),
      readoutOpacity: Number(getComputedStyle(readout).opacity),
    }
  })
}

describe('résumé ruler', () => {
  it('keeps the marker on the reading line as the ruler passes it', async () => {
    const page = await createPage('/resume', { viewport: WIDE })
    await page.waitForLoadState('networkidle')

    const line = await readingLine(page)

    for (const fraction of [0.25, 0.5, 0.75]) {
      await scrollThroughRuler(page, fraction)

      /* The marker measures what is in front of the reader, so it holds the
         reading line while the ruler slides past underneath it. */
      expect(Math.abs((await state(page)).markerTop - line)).toBeLessThan(4)
      expect(await markerProgress(page)).toBeGreaterThan(fraction * 100 - 8)
      expect(await markerProgress(page)).toBeLessThan(fraction * 100 + 8)
    }

    await page.close()
  })

  /* The failure the rail had: a scrub built from a `to` tween captures
     whatever the element holds when it is created, and then never moves. */
  it('moves the marker further down the ruler the further you read', async () => {
    const page = await createPage('/resume', { viewport: WIDE })
    await page.waitForLoadState('networkidle')

    await scrollThroughRuler(page, 0.2)
    const early = await markerProgress(page)

    await scrollThroughRuler(page, 0.8)
    const late = await markerProgress(page)

    expect(late).toBeGreaterThan(early + 30)

    await page.close()
  })

  it('lights exactly one year, and the entry it belongs to is in view', async () => {
    const page = await createPage('/resume', { viewport: WIDE })
    await page.waitForLoadState('networkidle')

    await scrollThroughRuler(page, 0.5)
    const middle = await state(page)

    expect(middle.active).toBe(1)
    expect(middle.inView).toBeGreaterThanOrEqual(1)

    await scrollThroughRuler(page, 1)
    const end = await state(page)

    expect(end.active).toBe(1)
    expect(end.activeIndex).toBeGreaterThan(middle.activeIndex - 1)

    await page.close()
  })

  /* A resize makes ScrollTrigger recompute every start and end it holds.
     The marker is positioned as a percentage of a ruler whose height just
     changed, so this is where it would quietly come off the reading line. */
  it('stays on the reading line through a resize', async () => {
    const page = await createPage('/resume', { viewport: WIDE })
    await page.waitForLoadState('networkidle')

    await scrollThroughRuler(page, 0.5)

    await page.setViewportSize({ width: 1600, height: 1000 })
    await page.waitForTimeout(900)
    await scrollThroughRuler(page, 0.5)

    expect(Math.abs((await state(page)).markerTop - await readingLine(page))).toBeLessThan(4)

    await page.close()
  })

  it('reads out the page coordinate while the ruler is passing, and hides it either side', async () => {
    const page = await createPage('/resume', { viewport: WIDE })
    await page.waitForLoadState('networkidle')

    await scrollThroughRuler(page, 0.5)
    const passing = await state(page)

    expect(passing.readoutOpacity).toBe(1)
    expect(passing.readout).toMatch(/^Y \d{4,}$/)
    expect(Number(passing.readout.slice(2))).toBe(await page.evaluate(() => Math.round(window.scrollY)))

    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(900)
    expect((await state(page)).readoutOpacity).toBe(0)

    await page.close()
  })
})
