import type { Ref } from 'vue'

export type ExitTimeline = (done: () => void) => void

/**
 * Runs an exit animation while a surface is leaving, and makes sure the
 * surface leaves either way.
 *
 * The danger with a two-step close is a surface that gets stuck halfway:
 * asked to leave, nothing finishes it, and it sits there covering the page
 * with the scroll locked. So the timeline is optional, `done` is only ever
 * honoured once, and a visitor who prefers reduced motion skips straight to
 * the end.
 */
export function useExitTransition(
  closing: Ref<boolean>,
  finish: () => void,
  play?: ExitTimeline,
): void {
  const reducedMotion = useReducedMotion()

  watch(closing, (isClosing) => {
    if (!isClosing) {
      return
    }

    let finished = false

    const done = () => {
      if (finished) {
        return
      }

      finished = true
      finish()
    }

    if (!play || reducedMotion.value) {
      done()
      return
    }

    play(done)
  })
}
