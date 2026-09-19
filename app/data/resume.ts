/**
 * Résumé page content, plus the one-line headline its home page teaser
 * shows. Every value is placeholder copy: the concept's was written for a
 * stand-in persona, so none of it carries over.
 */

export interface ResumeIntro {
  eyebrow: string
  title: string
  intro: string
  /** The download button only renders once this is set. */
  pdfUrl?: string
}

export interface ResumeEntry {
  id: string
  role: string
  company: string
  location?: string
  /** `YYYY-MM` */
  start: string
  /** `YYYY-MM`, or null while the role is current */
  end: string | null
  highlights: string[]
  stack: string[]
}

export interface EducationEntry {
  id: string
  title: string
  institution: string
  /** `YYYY` */
  start: string
  /** `YYYY`; the same as `start` for a single-year entry */
  end: string | null
}

export interface Skill {
  name: string
  /** 0 to 100 */
  value: number
}

export const resumeHeadline = 'Placeholder: a one-line summary of the career so far.'

export const resumeIntro: ResumeIntro = {
  eyebrow: 'Résumé',
  title: 'Placeholder résumé headline.',
  intro: 'Placeholder introduction: how you approach the work, and what this page lays out.',
}

/** Newest first. */
export const resumeEntries: ResumeEntry[] = [
  {
    id: 'placeholder-current',
    role: 'Frontend developer',
    company: 'Placeholder company',
    location: 'Remote',
    start: '2024-01',
    end: null,
    highlights: [
      'What you own and the scale it runs at.',
      'Something you introduced that others now rely on.',
    ],
    stack: ['Vue', 'Nuxt', 'TypeScript'],
  },
  {
    id: 'placeholder-previous',
    role: 'Frontend developer',
    company: 'Earlier placeholder company',
    start: '2021-06',
    end: '2023-12',
    highlights: [
      'A project you shipped and what changed because of it.',
    ],
    stack: ['React', 'TypeScript'],
  },
]

export const education: EducationEntry[] = [
  {
    id: 'placeholder-degree',
    title: 'Placeholder degree',
    institution: 'Placeholder university',
    start: '2015',
    end: '2019',
  },
  {
    id: 'placeholder-certificate',
    title: 'Placeholder certificate',
    institution: 'Placeholder provider',
    start: '2020',
    end: '2020',
  },
]

export const skills: Skill[] = [
  { name: 'Placeholder skill one', value: 90 },
  { name: 'Placeholder skill two', value: 80 },
  { name: 'Placeholder skill three', value: 70 },
]
