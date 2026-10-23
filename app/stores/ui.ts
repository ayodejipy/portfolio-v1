/**
 * UI-level ephemeral state: nav overlay, command palette, and the intro.
 * Mirrors the `body.nav-open` / palette pattern from the locked-in
 * nav prototypes (Concept A editorial overlay + Concept C ⌘K palette).
 */
export const useUiStore = defineStore('ui', () => {
  const navOpen = ref(false)
  const paletteOpen = ref(false)

  /*
    Whether the rail's intro is running. The fill itself is a CSS custom
    property written by the timeline, not state: this is only the flag that
    says an intro owns the rail right now, so the scroll sync can stay out of
    its way until it lands.
  */
  const booting = ref(false)

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
  }

  function finishBoot() {
    booting.value = false
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
    startBoot,
    finishBoot,
    toggleNav,
    openNav,
    closeNav,
    openPalette,
    closePalette,
  }
})
