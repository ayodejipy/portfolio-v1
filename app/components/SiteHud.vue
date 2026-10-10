<script setup lang="ts">
import type { PageSection } from '~/data/sections'

const props = defineProps<{
  sections: PageSection[]
  activeId: string
}>()

const current = computed(() => {
  const position = props.sections.findIndex(section => section.id === props.activeId)
  const index = position === -1 ? 0 : position

  return {
    index: String(index).padStart(2, '0'),
    label: props.sections[index]?.label ?? '',
  }
})
</script>

<template>
  <!--
    The concept's readout in the top corner. Hidden from assistive tech: it
    says exactly what the rail already says, and the rail says it properly,
    with aria-current on a link that goes there.
  -->
  <p class="site-hud" aria-hidden="true">
    <span class="site-hud-index">{{ current.index }}</span> / {{ current.label }}
  </p>
</template>

<style scoped>
/*
  Sits under the header rather than at the concept's 58px, because our
  header is in the flow and holds the search and menu buttons on that side.

  Shown at the same width as the rail: below it the right-hand gutter is too
  narrow to hold the readout clear of the text, and the two appearing
  together reads as deliberate.
*/
.site-hud {
  position: fixed;
  z-index: 5;
  top: calc(var(--header-height) + var(--space-2xs));
  right: var(--space-l);
  display: none;
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-align: right;
  text-transform: uppercase;
}

@media (min-width: 1360px) {
  .site-hud {
    display: block;
  }
}

.site-hud-index {
  color: var(--accent);
}
</style>
