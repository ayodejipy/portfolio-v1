<template>
  <div class="site">
    <a class="skip-link" href="#main-content">Skip to content</a>

    <SiteHeader />

    <SiteNavOverlay />

    <main id="main-content" class="site-main">
      <slot />
    </main>

    <footer class="site-footer" />
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
