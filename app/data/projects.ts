/**
 * Selected Work entries. Placeholder content: replace with real projects.
 * `stack` is the short technology line shown on each home page row.
 */

export interface Project {
  slug: string
  title: string
  summary: string
  year: number
  role: string
  stack: string
  href?: string
}

export const projects: Project[] = [
  {
    slug: 'placeholder-one',
    title: 'Placeholder project one',
    summary: 'A one-line summary of what this project was and why it mattered.',
    year: 2026,
    role: 'Design and build',
    stack: 'Vue / Nuxt',
  },
  {
    slug: 'placeholder-two',
    title: 'Placeholder project two',
    summary: 'A one-line summary of what this project was and why it mattered.',
    year: 2025,
    role: 'Frontend',
    stack: 'React / TypeScript',
  },
  {
    slug: 'placeholder-three',
    title: 'Placeholder project three',
    summary: 'A one-line summary of what this project was and why it mattered.',
    year: 2024,
    role: 'Frontend',
    stack: 'GSAP / Three.js',
  },
]
