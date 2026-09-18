<script setup lang="ts">
import type { ResumeEntry } from '~/data/resume'

const props = defineProps<{
  entry: ResumeEntry
}>()

const startYear = computed(() => props.entry.start.slice(0, 4))

/**
 * Joined here rather than in the template, where a line break before the
 * comma renders as a stray space ("Company , Remote").
 */
const companyLine = computed(() =>
  [props.entry.company, props.entry.location].filter(Boolean).join(', '),
)
</script>

<template>
  <li class="resume-timeline-entry">
    <span class="resume-timeline-entry-mark" aria-hidden="true">
      <span class="resume-timeline-entry-tick" />
      <span class="resume-timeline-entry-year">{{ startYear }}</span>
    </span>

    <p class="resume-timeline-entry-range">
      <BaseYearRange :start="entry.start" :end="entry.end" />
    </p>

    <h3 class="resume-timeline-entry-role">
      {{ entry.role }}
    </h3>

    <p class="resume-timeline-entry-company">
      {{ companyLine }}
    </p>

    <ul class="resume-timeline-entry-highlights">
      <li v-for="highlight in entry.highlights" :key="highlight">
        {{ highlight }}
      </li>
    </ul>

    <ul class="resume-timeline-entry-stack" aria-label="Stack">
      <li v-for="item in entry.stack" :key="item">
        {{ item }}
      </li>
    </ul>
  </li>
</template>

<style scoped>
.resume-timeline-entry {
  position: relative;
  padding-left: 32px;
}

.resume-timeline-entry::before {
  position: absolute;
  top: 12px;
  left: 0;
  width: 22px;
  height: 1px;
  background: var(--line);
  content: '';
}

/*
  This entry's major tick and year label, pushed out into the ruler gutter
  by the ruler's width plus the gap, both set on the timeline. top: 5% of
  the entry's own height is the concept's offset.
*/
.resume-timeline-entry-mark {
  position: absolute;
  top: 5%;
  left: calc(-1 * (var(--ruler-width) + var(--ruler-gap)));
  width: var(--ruler-width);
}

.resume-timeline-entry-tick {
  position: absolute;
  left: 0;
  width: 24px;
  height: 1px;
  background: var(--ink-soft);
}

.resume-timeline-entry-year {
  position: absolute;
  left: 32px;
  transform: translateY(-50%);
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 11px;
  white-space: nowrap;
}

.resume-timeline-entry-range {
  margin-bottom: 8px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.resume-timeline-entry-role {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.6vw, 1.9rem);
  font-style: italic;
  font-weight: 500;
}

.resume-timeline-entry-company {
  margin-top: 6px;
  color: var(--ink-soft);
  font-size: 13.5px;
}

.resume-timeline-entry-highlights {
  margin-top: 16px;
  padding-left: 18px;
  color: var(--ink-soft);
  font-size: 14px;
  line-height: 1.75;
}

.resume-timeline-entry-highlights li {
  margin-bottom: 4px;
}

.resume-timeline-entry-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  padding: 0;
  list-style: none;
}

.resume-timeline-entry-stack li {
  padding: 4px 10px;
  border: 1px solid var(--line);
  border-radius: 20px;
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 10.5px;
}
</style>
