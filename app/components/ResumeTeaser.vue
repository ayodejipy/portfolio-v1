<script setup lang="ts">
import { resumeEntries, resumeHeadline } from '~/data/resume'

const years = timelineYears(resumeEntries, new Date().getFullYear())
</script>

<template>
  <section id="resume" class="resume-teaser" aria-labelledby="resume-teaser-heading">
    <div class="container">
      <BaseSectionHeading index="02" title="Résumé" heading-id="resume-teaser-heading" />

      <div class="resume-teaser-box">
        <div>
          <h3 class="resume-teaser-headline">
            {{ resumeHeadline }}
          </h3>

          <ol class="resume-teaser-years" aria-label="Years on the timeline">
            <li v-for="year in years" :key="year" class="resume-teaser-year">
              {{ year }}
            </li>
          </ol>
        </div>

        <NuxtLink class="resume-teaser-link" to="/resume">
          View full timeline <span aria-hidden="true">→</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.resume-teaser {
  padding-bottom: 60px;
}

.resume-teaser-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: 44px 40px;
  border: 1px solid var(--line);
}

.resume-teaser-headline {
  max-width: 20ch;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-style: italic;
}

.resume-teaser-years {
  display: flex;
  margin-top: 24px;
  padding: 0;
  list-style: none;
}

.resume-teaser-year {
  padding: 0 14px;
  border-right: 1px solid var(--line);
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 10px;
}

.resume-teaser-year:first-child {
  padding-left: 0;
}

.resume-teaser-year:last-child {
  border-right: none;
}

.resume-teaser-link {
  padding-bottom: 3px;
  border-bottom: 1px solid var(--accent);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 13px;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;
}
</style>
