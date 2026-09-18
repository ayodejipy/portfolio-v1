import type { Project } from '~/data/projects'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { projects } from '~/data/projects'
import SelectedWork from './SelectedWork.vue'
import SelectedWorkRow from './SelectedWorkRow.vue'

describe('selected work', () => {
  it('renders one row per project inside an ordered list', async () => {
    const wrapper = await mountSuspended(SelectedWork)

    expect(wrapper.findAll('ol > .selected-work-row')).toHaveLength(projects.length)
  })

  it('labels the section with its numbered heading', async () => {
    const wrapper = await mountSuspended(SelectedWork)

    expect(wrapper.get('section').attributes('aria-labelledby')).toBe('selected-work-heading')
    expect(wrapper.get('#selected-work-heading').text()).toBe('Selected Work')
    expect(wrapper.get('.base-section-heading-index').text()).toBe('01')
  })

  it('shows a zero-padded index, the stack, and the year on each row', async () => {
    const wrapper = await mountSuspended(SelectedWork)
    const firstMeta = wrapper.findAll('.selected-work-row-meta')[0]?.text()

    expect(firstMeta).toContain('01')
    expect(firstMeta).toContain(projects[0]?.stack)
    expect(firstMeta).toContain(String(projects[0]?.year))
  })
})

describe('selected work row', () => {
  const base: Project = {
    slug: 'example',
    title: 'Example',
    summary: '',
    year: 2026,
    role: '',
    stack: 'Vue',
  }

  it('gives screen readers separated text rather than one run-on string', async () => {
    const row = await mountSuspended(SelectedWorkRow, { props: { project: base, position: 0 } })
    const spoken = row.element.cloneNode(true) as Element

    spoken.querySelectorAll('[aria-hidden="true"]').forEach(node => node.remove())

    expect(spoken.textContent?.replace(/\s+/g, ' ').trim()).toBe('Example, Vue, 2026')
  })

  it('is not a link when the project has nowhere to go', async () => {
    const row = await mountSuspended(SelectedWorkRow, { props: { project: base, position: 0 } })

    expect(row.find('a').exists()).toBe(false)
  })

  it('becomes a link when the project has an href', async () => {
    const project = { ...base, href: 'https://example.com' }
    const row = await mountSuspended(SelectedWorkRow, { props: { project, position: 0 } })

    expect(row.get('a').attributes('href')).toBe('https://example.com')
  })
})
