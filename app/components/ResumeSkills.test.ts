import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { skills } from '~/data/resume'
import ResumeSkills from './ResumeSkills.vue'
import ResumeSkillsRow from './ResumeSkillsRow.vue'

function spoken(element: Element): string {
  const clone = element.cloneNode(true) as Element

  clone.querySelectorAll('[aria-hidden="true"]').forEach(node => node.remove())

  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim()
}

describe('resume skills', () => {
  it('renders one row per skill', async () => {
    const wrapper = await mountSuspended(ResumeSkills)

    expect(wrapper.findAll('.resume-skills-row')).toHaveLength(skills.length)
  })
})

describe('resume skills row', () => {
  const skill = { name: 'Vue', value: 72 }

  it('reads the value as "out of 100" rather than a slash', async () => {
    const row = await mountSuspended(ResumeSkillsRow, { props: { skill } })

    expect(spoken(row.element)).toBe('Vue, 72 out of 100')
  })

  it('draws the fill and the cursor at the skill value', async () => {
    const row = await mountSuspended(ResumeSkillsRow, { props: { skill } })

    expect(row.get('.resume-skills-row-fill').attributes('style')).toContain('width: 72%')
    expect(row.get('.resume-skills-row-cursor').attributes('style')).toContain('left: 72%')
  })

  it('draws 21 ticks with every fifth one major, hidden from screen readers', async () => {
    const row = await mountSuspended(ResumeSkillsRow, { props: { skill } })

    expect(row.findAll('.resume-skills-row-tick')).toHaveLength(21)
    expect(row.findAll('.resume-skills-row-tick.is-major')).toHaveLength(5)
    expect(row.get('.resume-skills-row-scale').attributes('aria-hidden')).toBe('true')
  })
})
