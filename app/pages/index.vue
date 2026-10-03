<script setup lang="ts">
import { homeSections } from '~/data/sections'
</script>

<template>
  <div class="home-page">
    <!-- First in the page, so tabbing into the content reaches the section
         index before the sections themselves. -->
    <SiteRail :sections="homeSections" />

    <HomeHero />
    <SelectedWork />
    <ResumeTeaser />
    <HomeContact />
  </div>
</template>
