import type { Ref } from 'vue'

/**
 * Hands the page's scroll to Lenis, and Lenis's clock to GSAP.
 *
 * Two things have to be true at once for smooth scrolling and
 * scroll-triggered animation to live on the same page.
 *
 * Lenis has to be driven by GSAP's ticker rather than its own
 * requestAnimationFrame loop, so that a scrub never reads a scroll position
 * from a frame Lenis has already moved past. That is why the component is
 * mounted with `auto-raf` off: with it off and nothing calling `raf`, Lenis
 * swallows the wheel and the page does not move at all, which is the failure
 * this is most worth testing.
 *
 * And ScrollTrigger has to be told the moment Lenis moves. It would hear
 * about it anyway, from the native scroll event Lenis causes, but a frame
 * later than the tween that is reading it.
 *
 * It also owns stopping and starting, because a surface over the page has to
 * stop Lenis rather than only hide the scrollbar: a stopped Lenis holds its
 * position, where a running one keeps easing toward a target it cannot reach
 * and lurches when the lock comes off.
 */
export function useLenisScroll(locked: Ref<boolean>): void {
  const lenis = useLenis()
  const $gsap = useMotion()
  const { $ScrollTrigger } = useNuxtApp()

  /* GSAP's ticker counts seconds; Lenis expects milliseconds. */
  function advance(time: number): void {
    lenis.value?.raf(time * 1000)
  }

  function sync(): void {
    $ScrollTrigger.update()
  }

  watch(lenis, (instance, previous) => {
    previous?.off('scroll', sync)

    if (!instance) {
      return
    }

    instance.on('scroll', sync)

    /* A reduced-motion change rebuilds the instance, and it must come back
       stopped if a surface is still open over it. */
    if (locked.value) {
      instance.stop()
    }
  }, { immediate: true })

  watch(locked, (isLocked) => {
    if (isLocked) {
      lenis.value?.stop()
      return
    }

    lenis.value?.start()
  })

  onMounted(() => {
    $gsap.ticker.add(advance)

    /* GSAP drops a frame's worth of time after a stall rather than playing
       catch-up. Lenis integrates real elapsed time, so a smoothed lag leaves
       its position behind the page's. */
    $gsap.ticker.lagSmoothing(0)
  })

  onBeforeUnmount(() => {
    $gsap.ticker.remove(advance)
    $gsap.ticker.lagSmoothing(500, 33)
    lenis.value?.off('scroll', sync)
  })
}
