/**
 * Commands offered by the ⌘K palette. Built from the nav links and social
 * links so there is a single source for each destination.
 */

import { navLinks } from '~/data/nav'
import { site } from '~/data/site'

export interface PaletteCommand {
  id: string
  label: string
  hint: string
  to?: string
  href?: string
}

const navCommands: PaletteCommand[] = navLinks.map(link => ({
  id: `nav:${link.to}`,
  label: link.label,
  hint: 'Go',
  to: link.to,
}))

const socialCommands: PaletteCommand[] = site.socials.map(social => ({
  id: `social:${social.label.toLowerCase()}`,
  label: social.label,
  hint: 'Open',
  href: social.href,
}))

export const paletteCommands: PaletteCommand[] = [...navCommands, ...socialCommands]
