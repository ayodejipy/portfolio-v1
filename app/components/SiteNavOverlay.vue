<script setup lang="ts">
import { navLinks } from '~/data/nav'
import { site } from '~/data/site'

const ui = useUiStore()
const route = useRoute()
const overlay = ref<HTMLElement | null>(null)
const field = ref<HTMLElement | null>(null)
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

/*
  The entrance animates these inner spans rather than the anchors around
  them, and that split is load-bearing. GSAP writes `translate: none` onto
  anything it tweens, to stop the independent transform properties fighting
  the `transform` matrix it is building. Inline, that beats the stylesheet, so
  an anchor GSAP has touched can never be moved by a CSS hover again. Giving
  each owner its own element costs one span and ends the argument.
*/
function labels(): HTMLElement[] {
  return Array.from(overlay.value?.querySelectorAll<HTMLElement>('.site-nav-overlay-label') ?? [])
}

/*
  The dark field is its own layer rather than the overlay's background, so it
  can be timed apart from what sits on it: it washes in over 0.42s while the
  links are still being dealt, which reads as the ground arriving under them.
  Fading the whole overlay, as this did before, put one opacity on both, so
  the links could only ever arrive at exactly the rate the field did.
*/
watch(isOpen, async (open) => {
  if (!open || reducedMotion.value) {
    return
  }

  await nextTick()

  $gsap.fromTo(
    field.value,
    { opacity: 0 },
    { opacity: 1, duration: 0.42, ease: 'power2.out' },
  )

  $gsap.fromTo(
    labels(),
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
  $gsap.to(labels(), { y: 8, opacity: 0, duration: 0.12, ease: 'power1.in' })

  $gsap.to(field.value, {
    opacity: 0,
    duration: 0.22,
    delay: 0.06,
    ease: 'power1.in',
    onComplete: () => {
      // Back to the state the next open expects to animate from.
      $gsap.set(field.value, { clearProps: 'opacity' })
      $gsap.set(labels(), { clearProps: 'opacity,transform' })
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
    <!-- The field is painted by its own element so the entrance can fade it
         without fading the links with it. -->
    <div ref="field" class="site-nav-overlay-field" aria-hidden="true" />

    <nav class="site-nav-overlay-nav">
      <NuxtLink
        v-for="(link, position) in navLinks"
        :key="link.to"
        class="site-nav-overlay-link"
        :to="link.to"
        @click="ui.closeNav()"
      >
        <span class="site-nav-overlay-label">
          <span class="site-nav-overlay-index" aria-hidden="true">
            {{ indexLabel(position) }}
          </span>
          {{ link.label }}
        </span>
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
  /* How far a hovered link pulls away from the margin. */
  --link-shift: 14px;

  position: fixed;
  z-index: 40;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-inline: var(--overlay-inset);
  color: var(--bg);
}

.site-nav-overlay-field {
  position: absolute;
  inset: 0;
  background: var(--overlay);
}

/* Positioned, so it paints over the field rather than under it. */
.site-nav-overlay-nav {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3xs);
}

/*
  Only as wide as its text, so the pointer has to be on the word for a link to
  move, not anywhere along an empty row.
*/
.site-nav-overlay-link {
  width: fit-content;
  padding-block: var(--space-3xs);
  color: inherit;
  font-size: clamp(2.6rem, 7vw, 5.4rem);
  line-height: 1.05;
  text-decoration: none;
  translate: 0;
  transition: translate 0.3s ease-in-out;
}

.site-nav-overlay-link:hover,
.site-nav-overlay-link:focus-visible {
  translate: var(--link-shift);
}

/*
  inline-block because a rotation does not apply to an inline box. The
  superscript alignment is unchanged by it.
*/
.site-nav-overlay-index {
  display: inline-block;
  margin-right: var(--space-s);
  color: var(--accent-on-dark);
  font-family: var(--font-mono);
  font-size: var(--step--1);
  vertical-align: super;
  rotate: 0deg;
  transition: rotate 0.3s ease-in-out;
}

/* Carries the entrance, so GSAP owns its transform and nothing else does. */
.site-nav-overlay-label {
  display: inline-block;
}

.site-nav-overlay-link:hover .site-nav-overlay-index,
.site-nav-overlay-link:focus-visible .site-nav-overlay-index {
  rotate: -12deg;
}

/*
  No geometry for a visitor who asked for less motion. The hover still has
  to be legible, so it falls back to an underline, which is a state rather
  than a movement.
*/
@media (prefers-reduced-motion: reduce) {
  .site-nav-overlay-link,
  .site-nav-overlay-index {
    transition: none;
  }

  .site-nav-overlay-link:hover,
  .site-nav-overlay-link:focus-visible {
    translate: 0;
    text-decoration: underline;
  }

  .site-nav-overlay-link:hover .site-nav-overlay-index,
  .site-nav-overlay-link:focus-visible .site-nav-overlay-index {
    rotate: 0deg;
  }
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
