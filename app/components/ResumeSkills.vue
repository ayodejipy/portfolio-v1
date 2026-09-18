<script setup lang="ts">
import { skills } from '~/data/resume'
</script>

<template>
  <section class="resume-skills" aria-labelledby="resume-skills-heading">
    <div class="container">
      <BaseSectionHeading
        index="04"
        title="Skills, on a Scale"
        heading-id="resume-skills-heading"
        compact
      />

      <ul class="resume-skills-list">
        <ResumeSkillsRow v-for="skill in skills" :key="skill.name" :skill="skill" />
      </ul>
    </div>
  </section>
</template>

<style scoped>
.resume-skills {
  padding-top: 20px;
  padding-bottom: 90px;
}

.resume-skills-list {
  padding: 0;
  list-style: none;
}
</style>
