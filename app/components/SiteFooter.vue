<script setup lang="ts">
import { site } from '~/data/site'

const year = new Date().getFullYear()
const shortcutHint = useShortcutHint()
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer-inner container">
      <p>© {{ year }} {{ site.name }}</p>
      <p>Press <kbd class="site-footer-key">{{ shortcutHint }}</kbd> to navigate</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer-inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  padding-block: 40px;
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
}

.site-footer-key {
  font: inherit;
}
</style>
