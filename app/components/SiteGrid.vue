<template>
  <div class="site-grid" aria-hidden="true" />
</template>

<style scoped>
/*
  The concept's persistent coordinate grid, drawn behind every page. Purely
  decorative, so it is hidden from assistive tech and takes no pointer
  events.

  Fixed rather than sized to the document, as the concept has it: the lines
  cover the viewport at every scroll position, which reads as one grid under
  the whole document, and nothing has to measure the page height. The cost is
  that the lines hold still while the page scrolls. Sizing it to the document
  instead means an absolutely positioned layer on a `position: relative`
  wrapper with no `overflow: hidden` above it.

  Its colour is `--grid-line`, one token in main.css.

  The mask is the concept's: the grid is at its strongest across the top of
  the screen and fades out below. Because the layer is fixed, the fade is
  fixed to the viewport too, so the strong band stays at the top of the
  screen however far the page is scrolled.
*/
.site-grid {
  position: fixed;
  z-index: 0;
  inset: 0;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: var(--grid-cell) var(--grid-cell);
  mask-image: radial-gradient(circle at 50% 0%, black 0%, black 40%, transparent 85%);
  opacity: 0.55;
  pointer-events: none;
}

/* The grid is decoration; a forced-colours mode has no use for it. */
@media (forced-colors: active) {
  .site-grid {
    display: none;
  }
}
</style>
