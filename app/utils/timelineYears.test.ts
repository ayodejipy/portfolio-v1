import type { ResumeEntry } from '~/data/resume'
import { describe, expect, it } from 'vitest'
import { timelineYears } from './timelineYears'

function entry(start: string, end: string | null): ResumeEntry {
  return { id: start, role: '', company: '', start, end, summary: '' }
}

describe('timeline years', () => {
  it('marks each start year plus the current year while a role is ongoing', () => {
    const entries = [entry('2024-01', null), entry('2021-06', '2023-12')]

    expect(timelineYears(entries, 2026)).toEqual([2021, 2024, 2026])
  })

  it('leaves the current year off when every role has ended', () => {
    const entries = [entry('2019-03', '2020-01'), entry('2020-02', '2022-08')]

    expect(timelineYears(entries, 2026)).toEqual([2019, 2020])
  })

  it('does not repeat a year shared by two roles', () => {
    const entries = [entry('2025-01', '2025-06'), entry('2025-07', null)]

    expect(timelineYears(entries, 2025)).toEqual([2025])
  })
})
