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

  `--line-soft` rather than `--line`: at this size the grid is texture behind
  text, not a rule, and the darker line reads as a table.
*/
.site-grid {
  position: fixed;
  z-index: 0;
  inset: 0;
  background-image:
    linear-gradient(var(--line-soft) 1px, transparent 1px),
    linear-gradient(90deg, var(--line-soft) 1px, transparent 1px);
  background-size: var(--grid-cell) var(--grid-cell);
  pointer-events: none;
}

/* The grid is decoration; a forced-colours mode has no use for it. */
@media (forced-colors: active) {
  .site-grid {
    display: none;
  }
}
</style>
