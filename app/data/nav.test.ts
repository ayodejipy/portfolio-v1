import { describe, expect, it } from 'vitest'
import { navLinks } from '~/data/nav'
import { homeSections } from '~/data/sections'

describe('nav links', () => {
  /**
   * Contact is a section rather than a route, so its link is a hash. If the
   * section's id ever changes, the link has to change with it, and nothing
   * else would catch that: a hash pointing at nothing fails silently.
   */
  it('points every hash link at a section that exists', () => {
    const hashLinks = navLinks.filter(link => link.to.includes('#'))
    const ids = homeSections.map(section => section.id)

    expect(hashLinks.length).toBeGreaterThan(0)

    for (const link of hashLinks) {
      expect(ids).toContain(link.to.split('#')[1])
    }
  })

  it('offers contact alongside the routes', () => {
    expect(navLinks.map(link => link.label)).toEqual(['Home', 'Résumé', 'Contact'])
  })
})
