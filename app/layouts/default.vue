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
    <!--
      Nuxt's own route-change indicator, configured rather than built. It
      stays hidden until a navigation outlasts the throttle, so the fast case
      (nearly every case here: the site reaches LCP in about 750ms on a
      throttled phone) shows nothing at all. Under a second needs no loading
      feedback; past that, this is the feedback.
    -->
    <NuxtLoadingIndicator
      :height="2"
      :throttle="300"
      color="var(--accent)"
    />

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

/*
  A solid chip rather than a bordered one: its old --line border measured
  1.3:1 against the page, so the boundary of the only control that appears
  on focus was all but invisible. Dark on light reaches 16.71:1.
*/
.skip-link {
  position: absolute;
  z-index: 10;
  top: var(--space-xs);
  left: var(--space-xs);
  padding: var(--space-3xs) var(--space-xs);
  background: var(--ink);
  color: var(--bg);
  text-decoration: none;
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
