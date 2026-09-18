<script setup lang="ts">
import type { Project } from '~/data/projects'

const props = defineProps<{
  project: Project
  position: number
}>()

const indexLabel = computed(() => String(props.position + 1).padStart(2, '0'))
const tag = computed(() => (props.project.href ? 'a' : 'div'))
</script>

<template>
  <li class="selected-work-row">
    <component :is="tag" class="selected-work-row-inner" :href="project.href">
      <span class="selected-work-row-name">{{ project.title }}</span>
      <span class="visually-hidden">, </span>

      <span class="selected-work-row-meta">
        <span class="selected-work-row-index" aria-hidden="true">{{ indexLabel }}</span>
        <span>{{ project.stack }}</span>
        <span class="visually-hidden">, </span>
        <span>{{ project.year }}</span>
      </span>
    </component>
  </li>
</template>

<style scoped>
/*
  The concept's hover slides the row in with a transition. That is motion,
  so no hover state is set here; it belongs to the animation pass.
*/
.selected-work-row-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-s) var(--space-m);
  padding: 34px 4px;
  border-bottom: 1px solid var(--line);
  color: inherit;
  text-decoration: none;
}

.selected-work-row-name {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.4vw, 2.6rem);
  font-style: italic;
}

.selected-work-row-meta {
  display: flex;
  align-items: center;
  gap: 26px;
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 11px;
}

.selected-work-row-index {
  color: var(--accent);
}
</style>
