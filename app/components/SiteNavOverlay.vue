<script setup lang="ts">
import { navLinks } from '~/data/nav'
import { site } from '~/data/site'

const ui = useUiStore()
const route = useRoute()
const overlay = ref<HTMLElement | null>(null)
const isOpen = computed(() => ui.navOpen)

useFocusTrap(overlay, isOpen)

function indexLabel(position: number): string {
  return String(position).padStart(2, '0')
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && ui.navOpen) {
    ui.closeNav()
  }
}

watch(() => route.fullPath, () => {
  ui.closeNav()
})

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    v-show="ui.navOpen"
    id="site-nav-overlay"
    ref="overlay"
    class="site-nav-overlay"
    role="dialog"
    aria-modal="true"
    aria-label="Site navigation"
  >
    <nav class="site-nav-overlay-nav">
      <NuxtLink
        v-for="(link, position) in navLinks"
        :key="link.to"
        class="site-nav-overlay-link"
        :to="link.to"
        @click="ui.closeNav()"
      >
        <span class="site-nav-overlay-index" aria-hidden="true">
          {{ indexLabel(position) }}
        </span>
        {{ link.label }}
      </NuxtLink>
    </nav>

    <div class="site-nav-overlay-footer">
      <span>{{ site.email }}</span>
    </div>
  </div>
</template>

<style scoped>
.site-nav-overlay {
  --overlay-inset: clamp(24px, 8vw, 64px);

  position: fixed;
  z-index: 40;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-inline: var(--overlay-inset);
  background: var(--overlay);
  color: var(--bg);
}

.site-nav-overlay-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
}

.site-nav-overlay-link {
  padding-block: var(--space-3xs);
  color: inherit;
  font-size: clamp(2.6rem, 7vw, 5.4rem);
  line-height: 1.05;
  text-decoration: none;
}

.site-nav-overlay-index {
  margin-right: var(--space-s);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  vertical-align: super;
}

.site-nav-overlay-footer {
  position: absolute;
  right: var(--overlay-inset);
  bottom: var(--space-l);
  left: var(--overlay-inset);
  display: flex;
  justify-content: space-between;
  color: var(--line);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  letter-spacing: 0.08em;
}
</style>
