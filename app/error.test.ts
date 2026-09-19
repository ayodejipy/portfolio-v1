import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ErrorPage from './error.vue'

const { clearErrorMock } = vi.hoisted(() => ({ clearErrorMock: vi.fn() }))

mockNuxtImport('clearError', () => clearErrorMock)

describe('error page', () => {
  beforeEach(() => {
    clearErrorMock.mockClear()
  })

  it('says the page was not found for a 404', async () => {
    const page = await mountSuspended(ErrorPage, { props: { error: { statusCode: 404, message: 'Page not found: /nope' } } })

    expect(page.get('h1').text()).toBe('Page not found')
    expect(page.get('.error-page-eyebrow').text()).toBe('Error 404')
  })

  it('stays generic for other errors and never shows the raw message', async () => {
    const page = await mountSuspended(ErrorPage, { props: { error: { statusCode: 500, message: 'db connection refused at 10.0.0.4' } } })

    expect(page.get('h1').text()).toBe('Something went wrong')
    expect(page.text()).not.toContain('db connection refused')
  })

  it('clears the error and returns home', async () => {
    const page = await mountSuspended(ErrorPage, { props: { error: { statusCode: 404 } } })

    await page.get('.error-page-home').trigger('click')

    expect(clearErrorMock).toHaveBeenCalledWith({ redirect: '/' })
  })
})
