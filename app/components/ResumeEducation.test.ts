import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { education } from '~/data/resume'
import ResumeEducation from './ResumeEducation.vue'

function spoken(element: Element): string {
  const clone = element.cloneNode(true) as Element

  clone.querySelectorAll('[aria-hidden="true"]').forEach(node => node.remove())

  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim()
}

describe('resume education', () => {
  it('renders one row per entry', async () => {
    const wrapper = await mountSuspended(ResumeEducation)

    expect(wrapper.findAll('.resume-education-row')).toHaveLength(education.length)
  })

  it('reads each row as title, institution, and years', async () => {
    const wrapper = await mountSuspended(ResumeEducation)
    const rows = wrapper.findAll('.resume-education-row')
    const degree = education[0]!
    const certificate = education[1]!

    expect(spoken(rows[0]!.element)).toBe(`${degree.title}, ${degree.institution}, ${degree.start} to ${degree.end}`)
    expect(spoken(rows[1]!.element)).toBe(`${certificate.title}, ${certificate.institution}, ${certificate.start}`)
  })
})
