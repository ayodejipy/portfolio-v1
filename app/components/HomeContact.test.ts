import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { contact } from '~/data/contact'
import { site } from '~/data/site'
import HomeContact from './HomeContact.vue'

describe('home contact', () => {
  it('sits under a numbered heading that labels the section', async () => {
    const wrapper = await mountSuspended(HomeContact)

    expect(wrapper.get('section').attributes('aria-labelledby')).toBe('home-contact-heading')
    expect(wrapper.get('#home-contact-heading').text()).toBe('Contact')
    expect(wrapper.get('.base-section-heading-index').text()).toBe('03')
  })

  it('carries the id the rail and the nav point at', async () => {
    const wrapper = await mountSuspended(HomeContact)

    expect(wrapper.get('section').attributes('id')).toBe('contact')
  })

  it('leaves the section heading as the only heading in the panel', async () => {
    const wrapper = await mountSuspended(HomeContact)

    expect(wrapper.findAll('h1, h2, h3, h4, h5, h6')).toHaveLength(1)
    expect(wrapper.get('.home-contact-headline').text()).toBe(contact.headline)
  })

  it('offers the email address as a mailto link', async () => {
    const wrapper = await mountSuspended(HomeContact)
    const email = wrapper.get('.home-contact-email')

    expect(email.attributes('href')).toBe(`mailto:${site.email}`)
    expect(email.text()).toBe(site.email)
  })

  it('lists the social links from the site data', async () => {
    const wrapper = await mountSuspended(HomeContact)
    const socials = wrapper.findAll('.home-contact-social')

    expect(socials.map(social => social.text())).toEqual(site.socials.map(social => social.label))
    expect(socials.map(social => social.attributes('href'))).toEqual(site.socials.map(social => social.href))
  })
})
