/**
 * Primary navigation, shared by the header and the overlay nav.
 * Contact is absent on purpose: where it lives is still undecided (TODOS.md).
 */

export interface NavLink {
  label: string
  to: string
}

export const navLinks: NavLink[] = [
  { label: 'Work', to: '/' },
  { label: 'Résumé', to: '/resume' },
]
