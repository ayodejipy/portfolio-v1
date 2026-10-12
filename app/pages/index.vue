<script setup lang="ts">
import { homeSections } from '~/data/sections'

/*
  One observer for the page, read by both the rail and the corner readout.
  The list is fixed, so it is read once here rather than watched.
*/
const activeId = useActiveSection(homeSections.map(section => section.id))

/*
  While the intro owns the rail, the fill reports the intro's progress
  instead of the current section. Nothing starts the intro yet: with none
  written, `booting` stays false and the rail behaves as it always has.
*/
const ui = useUiStore()
const railProgress = computed(() => (ui.booting ? ui.bootProgress : null))
</script>

<template>
  <div class="home-page">
    <!-- First in the page, so tabbing into the content reaches the section
         index before the sections themselves. -->
    <SiteRail
      :sections="homeSections"
      :active-id="activeId"
      :progress-override="railProgress"
    />
    <SiteHud :sections="homeSections" :active-id="activeId" />

    <HomeHero />
    <SelectedWork />
    <ResumeTeaser />
    <HomeContact />
  </div>
</template>
