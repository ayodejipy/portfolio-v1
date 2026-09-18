/**
 * Home page hero. The headline is the concept's; the intro is deliberately
 * generic, because the concept's was written for a stand-in persona. Replace
 * every value with real copy.
 */

export interface HeroLine {
  text: string
  accent?: boolean
}

export interface HeroContent {
  eyebrow: string
  headline: HeroLine[]
  intro: string
  scrollCue: string
}

export const hero: HeroContent = {
  eyebrow: 'Frontend Developer',
  headline: [
    { text: 'Interfaces' },
    { text: 'built with', accent: true },
    { text: 'precision.' },
  ],
  intro: 'Placeholder introduction: where you are based, what you work across, and the kind of work you are open to next.',
  scrollCue: 'Scroll to explore',
}
