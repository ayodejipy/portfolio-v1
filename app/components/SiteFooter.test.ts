import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { site } from '~/data/site'
import SiteFooter from './SiteFooter.vue'

describe('site footer', () => {
  it('is the page footer landmark', async () => {
    const wrapper = await mountSuspended(SiteFooter)

    expect(wrapper.element.tagName).toBe('FOOTER')
  })

  it('credits the site owner for the current year', async () => {
    const wrapper = await mountSuspended(SiteFooter)

    expect(wrapper.text()).toContain(`© ${new Date().getFullYear()} ${site.name}`)
  })

  it('points visitors to the command palette shortcut', async () => {
    const wrapper = await mountSuspended(SiteFooter)

    expect(wrapper.get('kbd').text()).toMatch(/⌘K|Ctrl K/)
    expect(wrapper.text()).toContain('to navigate')
  })
})
