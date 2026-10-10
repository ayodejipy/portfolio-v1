<script setup lang="ts">
import { homeSections } from '~/data/sections'

/*
  One observer for the page, read by both the rail and the corner readout.
  The list is fixed, so it is read once here rather than watched.
*/
const activeId = useActiveSection(homeSections.map(section => section.id))
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
