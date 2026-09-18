import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import BaseYearRange from './BaseYearRange.vue'

function spoken(element: Element): string {
  const clone = element.cloneNode(true) as Element

  clone.querySelectorAll('[aria-hidden="true"]').forEach(node => node.remove())

  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim()
}

describe('base year range', () => {
  it('draws an arrow between the years but reads it as "to"', async () => {
    const range = await mountSuspended(BaseYearRange, { props: { start: '2021-06', end: '2023-12' } })

    expect(range.get('[aria-hidden="true"]').text()).toBe('→')
    expect(spoken(range.element)).toBe('2021 to 2023')
  })

  it('reads an ongoing range as running to Present', async () => {
    const range = await mountSuspended(BaseYearRange, { props: { start: '2024-01', end: null } })

    expect(spoken(range.element)).toBe('2024 to Present')
  })

  it('collapses to a single year when the range starts and ends in it', async () => {
    const range = await mountSuspended(BaseYearRange, { props: { start: '2020', end: '2020' } })

    expect(spoken(range.element)).toBe('2020')
    expect(range.find('[aria-hidden="true"]').exists()).toBe(false)
  })
})
