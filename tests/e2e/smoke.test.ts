import { createPage, setup, url } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

/**
 * Drives a real browser against a built server, so it covers what the
 * component tests cannot: hydration, routing, and the keyboard paths working
 * together.
 *
 * It launches the system Chrome rather than a downloaded Playwright build,
 * because the project depends on playwright-core, which ships no browsers. CI
 * will need either Chrome on the runner or `playwright install chromium`.
 *
 * Run it with `pnpm test:e2e`; `pnpm test` leaves it out because setup builds
 * the whole app.
 */
await setup({
  browser: true,
  browserOptions: {
    type: 'chromium',
    launch: { channel: 'chrome' },
  },
})

describe('site smoke test', () => {
  it('finds the résumé through the command palette', async () => {
    const page = await createPage('/')
    await page.waitForLoadState('networkidle')

    await page.locator('.site-header-command').click()
    await page.locator('.site-palette-input').fill('res')
    await page.keyboard.press('Enter')
    await page.waitForURL('**/resume')

    expect(await page.locator('h1').textContent()).toContain('Placeholder résumé headline')

    await page.close()
  })

  /**
   * A hash link across a route change is the one navigation the component
   * tests cannot cover, and it is the one that broke: Nuxt's own scroll
   * behaviour waits on the view transition's promise, which never settles
   * while `experimental.viewTransition` is on, so the page arrived at the
   * top instead of at the section. See app/router.options.ts.
   */
  it('reaches the contact section from the résumé page', async () => {
    const page = await createPage('/resume')
    await page.waitForLoadState('networkidle')

    await page.locator('.site-header-command').click()
    await page.locator('.site-palette-input').fill('contact')
    await page.keyboard.press('Enter')
    await page.waitForURL('**/#contact')

    const contact = page.locator('#contact')
    await contact.waitFor({ state: 'visible' })
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)

    // In the viewport, not merely scrolled somewhere.
    const top = await contact.evaluate(element => element.getBoundingClientRect().top)
    const height = await page.evaluate(() => window.innerHeight)
    expect(top).toBeLessThan(height)

    await page.close()
  })

  it('opens and closes the nav overlay with the keyboard', async () => {
    const page = await createPage('/')
    await page.waitForLoadState('networkidle')

    const toggle = page.locator('.site-header-nav-toggle')
    const overlay = page.locator('#site-nav-overlay')

    await toggle.click()
    await overlay.waitFor({ state: 'visible' })
    expect(await toggle.getAttribute('aria-expanded')).toBe('true')

    await page.keyboard.press('Escape')
    await overlay.waitFor({ state: 'hidden' })
    expect(await toggle.getAttribute('aria-expanded')).toBe('false')

    await page.close()
  })

  it('answers a missing page with a real 404 and the error page', async () => {
    const page = await createPage()
    const response = await page.goto(url('/no-such-page'))

    expect(response?.status()).toBe(404)
    expect(await page.locator('h1').textContent()).toBe('Page not found')

    await page.close()
  })
})
