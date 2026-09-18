/**
 * UI-level ephemeral state: nav overlay + command palette open/closed.
 * Mirrors the `body.nav-open` / palette pattern from the locked-in
 * nav prototypes (Concept A editorial overlay + Concept C ⌘K palette).
 */
export const useUiStore = defineStore('ui', () => {
  const navOpen = ref(false)
  const paletteOpen = ref(false)

  function toggleNav() {
    navOpen.value = !navOpen.value
  }

  function openNav() {
    navOpen.value = true
  }

  function closeNav() {
    navOpen.value = false
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
    toggleNav,
    openNav,
    closeNav,
    openPalette,
    closePalette,
  }
})
