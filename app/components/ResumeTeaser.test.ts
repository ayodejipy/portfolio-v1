import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { resumeEntries, resumeHeadline } from '~/data/resume'
import { timelineYears } from '~/utils/timelineYears'
import ResumeTeaser from './ResumeTeaser.vue'

describe('resume teaser', () => {
  it('sits under a numbered heading that labels the section', async () => {
    const wrapper = await mountSuspended(ResumeTeaser)

    expect(wrapper.get('section').attributes('aria-labelledby')).toBe('resume-teaser-heading')
    expect(wrapper.get('#resume-teaser-heading').text()).toBe('Résumé')
    expect(wrapper.get('.base-section-heading-index').text()).toBe('02')
  })

  it('shows the headline and the years derived from the résumé entries', async () => {
    const wrapper = await mountSuspended(ResumeTeaser)
    const years = wrapper.findAll('.resume-teaser-year').map(year => Number(year.text()))

    expect(wrapper.get('.resume-teaser-headline').text()).toBe(resumeHeadline)
    expect(years).toEqual(timelineYears(resumeEntries, new Date().getFullYear()))
  })

  it('links through to the full timeline', async () => {
    const wrapper = await mountSuspended(ResumeTeaser)
    const link = wrapper.get('.resume-teaser-link')

    expect(link.attributes('href')).toBe('/resume')
    expect(link.text()).toContain('View full timeline')
  })
})
