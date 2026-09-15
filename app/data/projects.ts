/**
 * Selected Work entries. Placeholder content: replace with real projects.
 */

export interface Project {
  slug: string
  title: string
  summary: string
  year: number
  role: string
  href?: string
}

export const projects: Project[] = [
  {
    slug: 'placeholder-one',
    title: 'Placeholder project one',
    summary: 'A one-line summary of what this project was and why it mattered.',
    year: 2026,
    role: 'Design and build',
  },
  {
    slug: 'placeholder-two',
    title: 'Placeholder project two',
    summary: 'A one-line summary of what this project was and why it mattered.',
    year: 2025,
    role: 'Frontend',
  },
  {
    slug: 'placeholder-three',
    title: 'Placeholder project three',
    summary: 'A one-line summary of what this project was and why it mattered.',
    year: 2024,
    role: 'Frontend',
  },
]
