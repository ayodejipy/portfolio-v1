<script setup lang="ts">
import { projects } from '~/data/projects'
</script>

<template>
  <section id="work" class="selected-work" aria-labelledby="selected-work-heading">
    <div class="container">
      <BaseSectionHeading index="01" title="Selected Work" heading-id="selected-work-heading" />

      <ol class="selected-work-list">
        <SelectedWorkRow
          v-for="(project, position) in projects"
          :key="project.slug"
          :project="project"
          :position="position"
        />
      </ol>
    </div>
  </section>
</template>

<style scoped>
.selected-work {
  padding-bottom: 60px;
}

.selected-work-list {
  padding: 0;
  list-style: none;
}
</style>
