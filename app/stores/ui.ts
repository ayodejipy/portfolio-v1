/**
 * UI-level ephemeral state: nav overlay, command palette, and the intro.
 * Mirrors the `body.nav-open` / palette pattern from the locked-in
 * nav prototypes (Concept A editorial overlay + Concept C ⌘K palette).
 */

/**
 * Surfaces close in two steps so an exit animation has somewhere to live.
 * `closing` means the thing is on its way out: still painted, no longer
 * interactive, and waiting for whatever is animating it to say it has
 * finished. With nothing animating, that happens on the next tick, which is
 * the instant behaviour this had before.
 */
export type SurfaceStatus = 'closed' | 'open' | 'closing'

export const useUiStore = defineStore('ui', () => {
  const navStatus = ref<SurfaceStatus>('closed')
  const paletteStatus = ref<SurfaceStatus>('closed')

  /*
    Two questions with different answers while a surface is leaving.

    `open` is about interaction: it drives the focus trap, `aria-expanded`,
    and whether Escape means anything. It goes false the moment a close is
    asked for, so a keyboard is never held inside something on its way out.

    `visible` is about paint: it keeps the element in the layout until the
    exit has run, and holds the scroll lock with it.
  */
  const navOpen = computed(() => navStatus.value === 'open')
  const navVisible = computed(() => navStatus.value !== 'closed')
  const paletteOpen = computed(() => paletteStatus.value === 'open')
  const paletteVisible = computed(() => paletteStatus.value !== 'closed')

  /*
    Whether the rail's intro is running. The fill itself is a CSS custom
    property written by the timeline, not state: this is only the flag that
    says an intro owns the rail right now, so the scroll sync can stay out of
    its way until it lands.
  */
  const booting = ref(false)

  function openNav() {
    navStatus.value = 'open'
  }

  /** Asks the overlay to leave. It is gone once `finishCloseNav` runs. */
  function closeNav() {
    if (navStatus.value === 'open') {
      navStatus.value = 'closing'
    }
  }

  function finishCloseNav() {
    navStatus.value = 'closed'
  }

  function toggleNav() {
    if (navStatus.value === 'open') {
      closeNav()
      return
    }

    openNav()
  }

  function openPalette() {
    paletteStatus.value = 'open'
  }

  /** Asks the palette to leave. It is gone once `finishClosePalette` runs. */
  function closePalette() {
    if (paletteStatus.value === 'open') {
      paletteStatus.value = 'closing'
    }
  }

  function finishClosePalette() {
    paletteStatus.value = 'closed'
  }

  function startBoot() {
    booting.value = true
  }

  function finishBoot() {
    booting.value = false
  }

  return {
    navStatus,
    paletteStatus,
    navOpen,
    navVisible,
    paletteOpen,
    paletteVisible,
    booting,
    startBoot,
    finishBoot,
    toggleNav,
    openNav,
    closeNav,
    finishCloseNav,
    openPalette,
    closePalette,
    finishClosePalette,
  }
})
