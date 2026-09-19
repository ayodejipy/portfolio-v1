<script setup lang="ts">
import { education } from '~/data/resume'
</script>

<template>
  <section class="resume-education" aria-labelledby="resume-education-heading">
    <div class="container">
      <BaseSectionHeading
        index="03"
        title="Education"
        heading-id="resume-education-heading"
        compact
      />

      <ul class="resume-education-list">
        <li v-for="item in education" :key="item.id" class="resume-education-row">
          <span class="resume-education-title">{{ item.title }}</span>
          <span class="visually-hidden">, </span>
          <span class="resume-education-meta">
            {{ item.institution }}, <BaseYearRange :start="item.start" :end="item.end" />
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.resume-education {
  padding-block: 20px;
}

.resume-education-list {
  padding: 0;
  list-style: none;
}

.resume-education-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
}

.resume-education-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-style: italic;
}

.resume-education-meta {
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 11px;
}
</style>
