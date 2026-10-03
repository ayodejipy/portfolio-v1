/**
 * The home page's sections, in document order. The rail reads this list to
 * draw its ticks and to know what to highlight, and each `id` has to match
 * the `id` on the matching section element.
 *
 * The numbering the rail shows is the position in this array, so a section
 * added here in the wrong place renumbers the rail and the section headings
 * disagree with it.
 */

export interface PageSection {
  id: string
  label: string
}

export const homeSections: PageSection[] = [
  { id: 'index', label: 'Index' },
  { id: 'work', label: 'Work' },
  { id: 'resume', label: 'Résumé' },
  { id: 'contact', label: 'Contact' },
]
