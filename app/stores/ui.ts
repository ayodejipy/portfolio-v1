/**
 * UI-level ephemeral state: nav overlay, command palette, and the intro.
 * Mirrors the `body.nav-open` / palette pattern from the locked-in
 * nav prototypes (Concept A editorial overlay + Concept C ⌘K palette).
 */
export const useUiStore = defineStore('ui', () => {
  const navOpen = ref(false)
  const paletteOpen = ref(false)

  /*
    The intro: the rail's fill runs 0 to 1 on first paint, then goes back to
    reporting which section you are in.

    `booting` starts false, so with no animation written the rail behaves
    exactly as it does today. An intro opts in by calling `startBoot()`,
    driving `bootProgress` from its own timeline, and calling `finishBoot()`
    when it lands. Nothing here animates anything: it only says whether the
    intro owns the fill, and how far along it is.
  */
  const booting = ref(false)
  const bootProgress = ref(0)

  function toggleNav() {
    navOpen.value = !navOpen.value
  }

  function openNav() {
    navOpen.value = true
  }

  function closeNav() {
    navOpen.value = false
  }

  function startBoot() {
    booting.value = true
    bootProgress.value = 0
  }

  /** Takes 0 to 1; anything outside that is clamped. */
  function setBootProgress(value: number) {
    bootProgress.value = Math.min(1, Math.max(0, value))
  }

  function finishBoot() {
    booting.value = false
    bootProgress.value = 1
  }

  function openPalette() {
    paletteOpen.value = true
  }

  function closePalette() {
    paletteOpen.value = false
  }

  return {
    navOpen,
    paletteOpen,
    booting,
    bootProgress,
    startBoot,
    setBootProgress,
    finishBoot,
    toggleNav,
    openNav,
    closeNav,
    openPalette,
    closePalette,
  }
})
