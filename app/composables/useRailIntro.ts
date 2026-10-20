/*
  Module scope on purpose: this is per page load, not per component. Only
  ever written from onMounted, so the server never sets it and one request
  cannot leak into another.
*/
let playedThisLoad = false

export interface RailIntroControls {
  /**
   * Call once, when the intro lands. It clears the flag that says an intro
   * owns the rail, which is what lets the scroll sync take the fill over.
   */
  done: () => void
}

export type RailIntroTimeline = (controls: RailIntroControls) => void

/**
 * Decides whether the rail's intro should run, and holds the flag while it
 * does. It never animates anything: the timeline is passed in and is the
 * only thing that moves, writing `--rail-progress` on the rail itself.
 *
 * It does not run when:
 * - the visitor prefers reduced motion;
 * - the URL carries a hash, so they asked for a section rather than the top;
 * - the page is already scrolled, which a restored position does;
 * - it has already run once this page load, so returning home from another
 *   route does not replay it.
 *
 * The last three matter because the fill would otherwise run 0 to 100 and
 * then snap to whichever section the reader is actually looking at.
 */
export function useRailIntro(timeline: RailIntroTimeline): void {
  const ui = useUiStore()
  const reducedMotion = useReducedMotion()
  const route = useRoute()

  onMounted(() => {
    if (playedThisLoad) {
      return
    }

    playedThisLoad = true

    if (reducedMotion.value || route.hash || window.scrollY > 0) {
      return
    }

    ui.startBoot()

    timeline({ done: ui.finishBoot })
  })
}

/** Test seam: there is no other way back to a fresh page load in a suite. */
export function resetRailIntroForTests(): void {
  playedThisLoad = false
}
