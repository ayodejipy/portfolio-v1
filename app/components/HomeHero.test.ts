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

  it('renders the headline as its separate lines', async () => {
    const wrapper = await mountSuspended(HomeHero)
    const lines = wrapper.findAll('.home-hero-line').map(line => line.text())

    expect(lines).toEqual(hero.headline.map(line => line.text))
  })

  /*
    The window and the thing that rises inside it. Without the inner span
    there is nothing to move and nothing to clip it, and the reveal is a
    stylesheet away from being silently dead. Whether it animates is an e2e
    question; that the markup it needs is here is this one.
  */
  it('gives every line an inner span for the reveal to raise', async () => {
    const wrapper = await mountSuspended(HomeHero)

    expect(wrapper.findAll('.home-hero-line-inner')).toHaveLength(hero.headline.length)
  })

  it('labels the section with its headline', async () => {
    const wrapper = await mountSuspended(HomeHero)

    expect(wrapper.get('section').attributes('aria-labelledby')).toBe('home-hero-heading')
  })

  it('lists the meta facts as a description list', async () => {
    const wrapper = await mountSuspended(HomeHero)
    const labels = wrapper.findAll('.home-hero-fact-label').map(fact => fact.text())
    const values = wrapper.findAll('.home-hero-fact-value').map(fact => fact.text())

    expect(labels).toEqual(hero.meta.map(fact => fact.label))
    expect(values).toEqual(hero.meta.map(fact => fact.value))
  })

  it('carries the id the rail points at', async () => {
    const wrapper = await mountSuspended(HomeHero)

    expect(wrapper.get('section').attributes('id')).toBe('index')
  })
})
