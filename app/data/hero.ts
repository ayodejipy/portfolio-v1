/**
 * Home page hero. The headline is the concept's; everything else is
 * deliberately generic, because the concept's copy was written for a
 * stand-in persona. Replace every value with real copy.
 */

export interface HeroLine {
  text: string
}

export interface HeroFact {
  label: string
  value: string
}

export interface HeroContent {
  eyebrow: string
  headline: HeroLine[]
  intro: string
  /** The row under the intro. The concept shows three; any number works. */
  meta: HeroFact[]
}

export const hero: HeroContent = {
  eyebrow: 'Frontend Developer',
  headline: [
    { text: 'Interfaces' },
    { text: 'built with' },
    { text: 'precision.' },
  ],
  intro: 'Placeholder introduction: where you are based, what you work across, and the kind of work you are open to next.',
  meta: [
    { label: 'Focus', value: 'Placeholder, placeholder, placeholder' },
    { label: 'Experience', value: 'Placeholder years' },
    { label: 'Available', value: 'Placeholder date' },
  ],
}
