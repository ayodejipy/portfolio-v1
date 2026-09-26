/**
 * The contact section at the foot of the home page. The email address and
 * the social links live in `site.ts`, because the palette offers them too;
 * only the copy is here.
 *
 * The headline is the concept's line, kept as a placeholder so the section
 * reads right. Replace it with your own.
 */

export interface ContactContent {
  headline: string
  /** Sits above the email address, saying what a message will reach. */
  note: string
}

export const contact: ContactContent = {
  headline: 'Let\'s plot something new.',
  note: 'Placeholder note: what you are open to, and how quickly you reply.',
}
