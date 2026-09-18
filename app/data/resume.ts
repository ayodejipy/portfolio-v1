/**
 * Résumé timeline entries, newest first. Placeholder content: replace with
 * the real history. `end: null` means the role is current.
 */

/**
 * One-line summary on the home page résumé teaser. Placeholder copy: the
 * concept's line described its stand-in persona's career, not yours.
 */
export const resumeHeadline = 'Placeholder: a one-line summary of the career so far.'

export interface ResumeEntry {
  id: string
  role: string
  company: string
  start: string
  end: string | null
  summary: string
}

export const resumeEntries: ResumeEntry[] = [
  {
    id: 'placeholder-current',
    role: 'Frontend developer',
    company: 'Placeholder company',
    start: '2024-01',
    end: null,
    summary: 'What the role covers and what shipped.',
  },
  {
    id: 'placeholder-previous',
    role: 'Frontend developer',
    company: 'Earlier placeholder company',
    start: '2021-06',
    end: '2023-12',
    summary: 'What the role covered and what shipped.',
  },
]
