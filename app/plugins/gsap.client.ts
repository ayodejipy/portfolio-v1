import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Registers GSAP + ScrollTrigger once, client-side only.
 * Reserved for frame-precise choreography per Phase 12: the blueprint
 * loader sequence and the résumé ruler's scroll-synced marker.
 *
 * Rule: never let GSAP and motion-v/Lenis animate the same property
 * on the same element at the same time.
 */
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger)

  return {
    provide: {
      gsap,
      ScrollTrigger,
    },
  }
})
