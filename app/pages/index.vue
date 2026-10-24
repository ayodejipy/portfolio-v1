<script setup lang="ts">
import { homeSections } from '~/data/sections'

/*
  One observer for the page, read by both the rail and the corner readout.
  The list is fixed, so it is read once here rather than watched.
*/
const activeId = useActiveSection(homeSections.map(section => section.id))

/*
  The rail's fill. Three things move it, one after another, never at once:

  1. the intro sweeps it 0 to 100% on first paint;
  2. it then drains to wherever the reader actually is, which at the top of
     the page is empty;
  3. the scroll sync takes over and ties it to scroll position from there.

  Steps 2 and 3 exist because the intro ends full while the indicator at the
  top of the page should read empty. Without the drain the handover snaps.

  Both write `--rail-progress` on `.site-rail`, and nothing else does: Vue
  stopped binding that property so a tween cannot be undone by a re-render.

  ScrollTrigger is not named here on purpose: the plugin registers it with
  GSAP, which is all `scrollTrigger:` in a tween config needs.
*/
const { $gsap } = useNuxtApp()
const ui = useUiStore()

let settle: gsap.core.Tween | null = null
let scrollSync: gsap.core.Tween | null = null

/** How far down the page the reader is, 0 to 1. */
function scrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  return scrollable > 0 ? window.scrollY / scrollable : 0
}

/**
 * Ties the fill to scroll position: top of the page empty, bottom full.
 *
 * `fromTo` rather than `to`, because a `to` tween takes its start value from
 * whatever the element happens to hold when it is created. Created after the
 * intro, that start was 100%, so the tween ran 100% to 100% and the fill
 * never moved again. Naming both ends removes the dependency on timing.
 *
 * `immediateRender: false` keeps it from stamping 0% on the element the
 * moment it is built; the scrub sets the right value on its first refresh.
 */
function startScrollSync() {
  scrollSync = $gsap.fromTo(
    '.site-rail',
    { '--rail-progress': '0%' },
    {
      '--rail-progress': '100%',
      'ease': 'none',
      'immediateRender': false,
      'scrollTrigger': {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    },
  )
}

/*
  `useRailIntro` decides whether the intro should run at all: it skips for
  reduced motion, for a url with a hash, for a page that loads already
  scrolled, and for a second visit within the same page load.
*/
useRailIntro(({ done }) => {
  $gsap.fromTo(
    '.site-rail',
    { '--rail-progress': '0%' },
    {
      '--rail-progress': '100%',
      'duration': 0.8,
      'ease': 'power2.out',
      'onComplete': () => {
        done()

        // Drain from full to the reader's actual position, then hand over.
        settle = $gsap.to('.site-rail', {
          '--rail-progress': `${scrollProgress() * 100}%`,
          'duration': 0.4,
          'ease': 'power2.inOut',
          'onComplete': startScrollSync,
        })
      },
    },
  )
})

/*
  When the intro is skipped nothing hands over, so the sync starts here
  instead. `useRailIntro` registers its hook first, so by now `booting` is
  true if an intro is running and the handover above owns the start.
*/
onMounted(() => {
  if (!ui.booting) {
    startScrollSync()
  }
})

/*
  A ScrollTrigger outlives the page that made it, so leaving the route would
  leave it listening to a rail that is no longer there.
*/
onBeforeUnmount(() => {
  settle?.kill()
  settle = null
  scrollSync?.scrollTrigger?.kill()
  scrollSync?.kill()
  scrollSync = null
})
</script>

<template>
  <div class="home-page">
    <!-- First in the page, so tabbing into the content reaches the section
         index before the sections themselves. -->
    <SiteRail :sections="homeSections" :active-id="activeId" />
    <SiteHud :sections="homeSections" :active-id="activeId" />

    <HomeHero />
    <SelectedWork />
    <ResumeTeaser />
    <HomeContact />
  </div>
</template>
