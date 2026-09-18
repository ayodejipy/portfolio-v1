import type { ResumeEntry } from '~/data/resume'

/**
 * The years marked on the home page résumé teaser: every year a role began,
 * plus the current year while any role is still ongoing. Ascending, no
 * repeats.
 */
export function timelineYears(entries: ResumeEntry[], currentYear: number): number[] {
  const years = new Set<number>()

  for (const entry of entries) {
    years.add(Number(entry.start.slice(0, 4)))

    if (entry.end === null) {
      years.add(currentYear)
    }
  }

  return [...years].sort((first, second) => first - second)
}
