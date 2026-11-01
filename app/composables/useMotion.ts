import type { gsap as GsapStatic } from 'gsap'

/**
 * GSAP, reached through a composable rather than `useNuxtApp().$gsap`
 * directly, so a test can replace it.
 *
 * Component tests run in happy-dom, where a GSAP tween blurs the element it
 * touches: focusing a link and then tweening it leaves `document.activeElement`
 * on the body. A real browser does not do that, so a focus test failing for
 * that reason is the fake DOM talking, not the component. Those tests stub
 * this and the animations are covered end to end instead.
 */
export function useMotion(): typeof GsapStatic {
  return useNuxtApp().$gsap as typeof GsapStatic
}
