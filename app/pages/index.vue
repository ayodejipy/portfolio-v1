<script setup lang="ts">
const ui = useUiStore()
</script>

<template>
  <div class="scaffold-check">
    <h1>Portfolio: scaffold ready</h1>
    <p>Nuxt 4 + Pinia + GSAP + Lenis + motion-v are wired up.</p>
    <p>Nav store state (Pinia): <code>navOpen = {{ ui.navOpen }}</code></p>
    <button type="button" @click="ui.toggleNav()">
      toggle nav state
    </button>
  </div>
</template>

<style scoped>
.scaffold-check {
  max-width: 640px;
  margin: 4rem auto;
  padding: 0 1.5rem;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
</style>
