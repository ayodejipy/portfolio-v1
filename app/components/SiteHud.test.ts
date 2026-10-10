import type { PageSection } from '~/data/sections'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import SiteHud from './SiteHud.vue'

const sections: PageSection[] = [
  { id: 'index', label: 'Index' },
  { id: 'work', label: 'Work' },
  { id: 'resume', label: 'Résumé' },
  { id: 'contact', label: 'Contact' },
]

function mountHud(activeId: string) {
  return mountSuspended(SiteHud, { props: { sections, activeId } })
}

describe('site hud', () => {
  it('reads out the current section and its number', async () => {
    const wrapper = await mountHud('resume')

    expect(wrapper.text().replace(/\s+/g, ' ')).toBe('02 / Résumé')
  })

  it('is hidden from assistive tech, because the rail already says this', async () => {
    const wrapper = await mountHud('index')

    expect(wrapper.get('.site-hud').attributes('aria-hidden')).toBe('true')
  })

  it('falls back to the first section when given an id it does not know', async () => {
    const wrapper = await mountHud('nonsense')

    expect(wrapper.text().replace(/\s+/g, ' ')).toBe('00 / Index')
  })
})
