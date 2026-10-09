/**
 * Primary navigation, shared by the overlay nav and, through `commands.ts`,
 * by the palette.
 *
 * Contact is a section of the home page rather than a route, so it is
 * reached by its hash. The id it points at is the one in `sections.ts`,
 * which the rail also uses.
 */

export interface NavLink {
  label: string
  to: string
}

export const navLinks: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Résumé', to: '/resume' },
  { label: 'Contact', to: '/#contact' },
]
