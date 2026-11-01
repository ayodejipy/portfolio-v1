<script setup lang="ts">
import { navLinks } from '~/data/nav'
import { site } from '~/data/site'

const ui = useUiStore()
const route = useRoute()
const overlay = ref<HTMLElement | null>(null)
const isOpen = computed(() => ui.navOpen)
const isClosing = computed(() => ui.navStatus === 'closing')

const $gsap = useMotion()
const reducedMotion = useReducedMotion()

/*
  The trap follows `navOpen`, not `navVisible`, so focus goes back to the
  menu button the moment a close is asked for rather than waiting out the
  animation. The overlay is inert for the rest of its exit, so a fast Tab
  cannot land inside something that is leaving.
*/
useFocusTrap(overlay, isOpen)

function indexLabel(position: number): string {
  return String(position).padStart(2, '0')
}

function links(): HTMLElement[] {
  return Array.from(overlay.value?.querySelectorAll<HTMLElement>('.site-nav-overlay-link') ?? [])
}

/*
  The overlay arrives as a dark field, then the links come up under it. The
  stagger is what makes it read as a list being dealt rather than a panel
  appearing.
*/
watch(isOpen, async (open) => {
  if (!open || reducedMotion.value) {
    return
  }

  await nextTick()

  $gsap.fromTo(
    overlay.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.28, ease: 'power2.out' },
  )

  $gsap.fromTo(
    links(),
    { y: 24, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.05, delay: 0.06 },
  )
})

/*
  Leaving is quicker than arriving, and in the other order: the links go
  first, the field follows. `done` is what actually removes the overlay, so
  it runs from the last tween rather than on a timer.
*/
useExitTransition(isClosing, ui.finishCloseNav, (done) => {
  $gsap.to(links(), { y: 8, opacity: 0, duration: 0.12, ease: 'power1.in' })

  $gsap.to(overlay.value, {
    opacity: 0,
    duration: 0.22,
    delay: 0.06,
    ease: 'power1.in',
    onComplete: () => {
      // Back to the state the next open expects to animate from.
      $gsap.set(overlay.value, { clearProps: 'opacity' })
      $gsap.set(links(), { clearProps: 'opacity,transform' })
      done()
    },
  })
})

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
    v-show="ui.navVisible"
    id="site-nav-overlay"
    ref="overlay"
    class="site-nav-overlay"
    role="dialog"
    aria-modal="true"
    aria-label="Site navigation"
    :aria-hidden="isClosing || undefined"
    :inert="isClosing || undefined"
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
  color: var(--accent-on-dark);
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
