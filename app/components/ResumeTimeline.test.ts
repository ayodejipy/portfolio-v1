import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { resumeEntries } from '~/data/resume'
import ResumeTimeline from './ResumeTimeline.vue'

describe('resume timeline', () => {
  it('renders one entry per role in an ordered list', async () => {
    const wrapper = await mountSuspended(ResumeTimeline)

    expect(wrapper.findAll('ol > .resume-timeline-entry')).toHaveLength(resumeEntries.length)
  })

  it('shows each role with its company, highlights, and stack', async () => {
    const wrapper = await mountSuspended(ResumeTimeline)
    const first = wrapper.findAll('.resume-timeline-entry')[0]!
    const entry = resumeEntries[0]!

    expect(first.get('h3').text()).toBe(entry.role)
    expect(first.get('.resume-timeline-entry-company').text()).toBe(`${entry.company}, ${entry.location}`)
    expect(first.findAll('.resume-timeline-entry-highlights li')).toHaveLength(entry.highlights.length)
    expect(first.findAll('.resume-timeline-entry-stack li').map(item => item.text())).toEqual(entry.stack)
  })

  it('leaves off the location separator for an entry without a location', async () => {
    const wrapper = await mountSuspended(ResumeTimeline)
    const index = resumeEntries.findIndex(entry => !entry.location)
    const company = wrapper.findAll('.resume-timeline-entry-company')[index]!

    expect(company.text()).toBe(resumeEntries[index]!.company)
  })

  it('marks every entry on the ruler with its start year, hidden from screen readers', async () => {
    const wrapper = await mountSuspended(ResumeTimeline)
    const marks = wrapper.findAll('.resume-timeline-entry-mark')

    expect(marks.map(mark => mark.text())).toEqual(resumeEntries.map(entry => entry.start.slice(0, 4)))
    marks.forEach(mark => expect(mark.attributes('aria-hidden')).toBe('true'))
    expect(wrapper.get('.resume-timeline-ruler').attributes('aria-hidden')).toBe('true')
  })
})
