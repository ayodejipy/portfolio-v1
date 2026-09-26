<script setup lang="ts">
const ui = useUiStore()

/**
 * Both overlays are rendered here, so the body classes they rely on are set
 * in one place. Two components writing bodyAttrs.class would overwrite each
 * other's value.
 */
const bodyClass = computed(() => [
  ui.navOpen ? 'nav-open' : '',
  ui.paletteOpen ? 'palette-open' : '',
].filter(Boolean).join(' '))

useHead({
  bodyAttrs: { class: bodyClass },
})
</script>

<template>
  <div class="site">
    <a class="skip-link" href="#main-content">Skip to content</a>

    <SiteGrid />

    <SiteHeader />

    <SiteNavOverlay />

    <SitePalette />

    <main id="main-content" class="site-main">
      <slot />
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.site {
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
}

.site-main {
  flex: 1;
}

.skip-link {
  position: absolute;
  z-index: 10;
  top: var(--space-xs);
  left: var(--space-xs);
  padding: var(--space-3xs) var(--space-xs);
  border: 1px solid var(--line);
  background: var(--bg);
}

.skip-link:not(:focus) {
  overflow: hidden;
  width: 1px;
  height: 1px;
  padding: 0;
  border: 0;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
