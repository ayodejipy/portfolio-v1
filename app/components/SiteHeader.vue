<script setup lang="ts">
import { site } from '~/data/site'

const ui = useUiStore()
</script>

<template>
  <header class="site-header">
    <div class="site-header-inner container">
      <NuxtLink class="site-header-brand" to="/">
        {{ site.name }}
      </NuxtLink>

      <div class="site-header-actions">
        <button
          type="button"
          class="site-header-command"
          aria-keyshortcuts="Meta+K Control+K"
          @click="ui.openPalette()"
        >
          <span>Search</span>
          <kbd class="site-header-key">⌘K</kbd>
        </button>

        <button
          type="button"
          class="site-header-nav-toggle"
          aria-controls="site-nav-overlay"
          :aria-expanded="ui.navOpen"
          @click="ui.toggleNav()"
        >
          Menu
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: var(--space-s);
  gap: var(--space-m);
}

.site-header-brand {
  font-size: var(--step-1);
  font-weight: 600;
  letter-spacing: -0.01em;
  text-decoration: none;
}

.site-header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
}

.site-header-command,
.site-header-nav-toggle {
  padding: var(--space-3xs) var(--space-xs);
  border: 1px solid var(--line);
  background: none;
  color: inherit;
  font: inherit;
  font-size: var(--step--1);
  cursor: pointer;
}

.site-header-command {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
}

.site-header-key {
  color: var(--ink-soft);
  font-family: ui-monospace, monospace;
  font-size: var(--step--1);
}
</style>
