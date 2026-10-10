import type { PageSection } from '~/data/sections'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import SiteRail from './SiteRail.vue'

const sections: PageSection[] = [
  { id: 'index', label: 'Index' },
  { id: 'work', label: 'Work' },
  { id: 'resume', label: 'Résumé' },
  { id: 'contact', label: 'Contact' },
]

function mountRail(activeId = 'index') {
  return mountSuspended(SiteRail, { props: { sections, activeId } })
}

describe('site rail', () => {
  it('lists every section as a numbered link to it', async () => {
    const wrapper = await mountRail()
    const links = wrapper.findAll('.site-rail-link')

    expect(links).toHaveLength(4)
    expect(links.map(link => link.attributes('href'))).toEqual([
      '#index',
      '#work',
      '#resume',
      '#contact',
    ])
  })

  it('keeps the number and the label separate words for a screen reader', async () => {
    const wrapper = await mountRail()

    expect(wrapper.findAll('.site-rail-link')[3]?.text()).toBe('03 Contact')
  })

  it('spaces the ticks evenly along the track', async () => {
    const wrapper = await mountRail()
    const offsets = wrapper.findAll('.site-rail-tick').map(tick => tick.attributes('style'))

    expect(offsets).toEqual([
      'top: 0%;',
      'top: 33.33%;',
      'top: 66.67%;',
      'top: 100%;',
    ])
  })

  it('marks the section it is given as current', async () => {
    const wrapper = await mountRail('resume')

    expect(wrapper.get('.site-rail-tick.is-active .site-rail-link').text()).toBe('02 Résumé')
    expect(wrapper.get('[aria-current="true"]').attributes('href')).toBe('#resume')
  })

  it('fills the track as far as the current section', async () => {
    expect((await mountRail('index')).get('.site-rail').attributes('style')).toBe('--rail-progress: 0%;')
    expect((await mountRail('resume')).get('.site-rail').attributes('style')).toBe('--rail-progress: 66.67%;')
    expect((await mountRail('contact')).get('.site-rail').attributes('style')).toBe('--rail-progress: 100%;')
  })

  it('falls back to the first section when given an id it does not know', async () => {
    const wrapper = await mountRail('nonsense')

    expect(wrapper.get('.site-rail-tick.is-active .site-rail-link').text()).toBe('00 Index')
  })
})
