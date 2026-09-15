/**
 * Site-level content. Every value here is a placeholder standing in for the
 * real copy, including the example.com social links and email address.
 */

export interface SocialLink {
  label: string
  href: string
}

export interface SiteContent {
  name: string
  role: string
  description: string
  email: string
  socials: SocialLink[]
}

export const site: SiteContent = {
  name: 'Ayodeji',
  role: 'Frontend developer',
  description: 'Personal portfolio of Ayodeji, a frontend developer.',
  email: 'hello@example.com',
  socials: [
    { label: 'GitHub', href: 'https://example.com/github' },
    { label: 'LinkedIn', href: 'https://example.com/linkedin' },
  ],
}
