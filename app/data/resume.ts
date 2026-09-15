/**
 * Résumé timeline entries, newest first. Placeholder content: replace with
 * the real history. `end: null` means the role is current.
 */

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
