<script setup lang="ts">
import { homeSections } from '~/data/sections'

/*
  One observer for the page, read by both the rail and the corner readout.
  The list is fixed, so it is read once here rather than watched.
*/
const activeId = useActiveSection(homeSections.map(section => section.id))

/*
  The rail's fill. Two things move it, never at the same time:

  1. the intro, which runs it 0 to 100% once on first paint;
  2. the scroll sync, which then ties it to how far down the page you are.

  Both write `--rail-progress` on `.site-rail`, and nothing else does: Vue
  stopped binding that property so a tween cannot be undone by a re-render.
*/
/*
  ScrollTrigger is not named here on purpose: the plugin registers it with
  GSAP, which is all `scrollTrigger:` in a tween config needs.
*/
const { $gsap } = useNuxtApp()
const ui = useUiStore()

let scrollSync: gsap.core.Tween | null = null

/** Ties the fill to scroll position: top of the page empty, bottom full. */
function startScrollSync() {
  scrollSync = $gsap.to('.site-rail', {
    '--rail-progress': '100%',
    'ease': 'none',
    'scrollTrigger': {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    },
  })
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
        startScrollSync()
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
