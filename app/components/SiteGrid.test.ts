import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import SiteGrid from './SiteGrid.vue'

describe('site grid', () => {
  it('is decoration, so it is hidden from assistive tech', async () => {
    const wrapper = await mountSuspended(SiteGrid)

    expect(wrapper.get('.site-grid').attributes('aria-hidden')).toBe('true')
    expect(wrapper.text()).toBe('')
  })
})
