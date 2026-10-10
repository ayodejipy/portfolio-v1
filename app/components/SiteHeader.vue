<script setup lang="ts">
import { site } from '~/data/site'

const ui = useUiStore()
const shortcutHint = useShortcutHint()
</script>

<template>
  <header class="site-header">
    <div class="site-header-inner container">
      <NuxtLink class="site-header-brand" to="/">
        {{ site.name }}
      </NuxtLink>

      <div class="site-header-actions">
        <p class="site-header-role">
          {{ site.role }}
        </p>

        <button
          type="button"
          class="site-header-command"
          aria-haspopup="dialog"
          aria-controls="site-palette"
          aria-keyshortcuts="Meta+K Control+K"
          @click="ui.openPalette()"
        >
          <span>Search</span>
          <kbd class="site-header-key">{{ shortcutHint }}</kbd>
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
  min-height: var(--header-height);
  gap: var(--space-m);
}

.site-header-brand {
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}

/* The concept carries the role beside the name. It is the first thing to go
   when the bar gets tight. */
.site-header-role {
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 860px) {
  .site-header-role {
    display: none;
  }
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
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
}

.site-header-command {
  display: flex;
  align-items: center;
  gap: var(--space-2xs);
}

.site-header-key {
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 11px;
}
</style>
