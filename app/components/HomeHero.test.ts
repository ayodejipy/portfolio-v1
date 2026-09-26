import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { hero } from '~/data/hero'
import HomeHero from './HomeHero.vue'

describe('home hero', () => {
  it('reads the headline as one sentence despite rendering it on separate lines', async () => {
    const wrapper = await mountSuspended(HomeHero)
    const headline = wrapper.get('h1').text().replace(/\s+/g, ' ').trim()

    expect(headline).toBe(hero.headline.map(line => line.text).join(' '))
  })

  it('marks only the accent lines with the accent class', async () => {
    const wrapper = await mountSuspended(HomeHero)
    const accentLines = wrapper.findAll('.home-hero-line.is-accent').map(line => line.text())

    expect(accentLines).toEqual(hero.headline.filter(line => line.accent).map(line => line.text))
  })

  it('labels the section with its headline and hides the decorative layers', async () => {
    const wrapper = await mountSuspended(HomeHero)

    expect(wrapper.get('section').attributes('aria-labelledby')).toBe('home-hero-heading')
    expect(wrapper.get('.home-hero-scroll-line').attributes('aria-hidden')).toBe('true')
  })

  it('carries the id the rail points at', async () => {
    const wrapper = await mountSuspended(HomeHero)

    expect(wrapper.get('section').attributes('id')).toBe('index')
  })
})
