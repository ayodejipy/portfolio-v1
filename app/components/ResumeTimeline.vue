<script setup lang="ts">
import { resumeEntries } from '~/data/resume'
</script>

<template>
  <section id="timeline" class="resume-timeline" aria-labelledby="resume-timeline-heading">
    <div class="container">
      <BaseSectionHeading
        index="02"
        title="Career Timeline"
        heading-id="resume-timeline-heading"
        compact
      />

      <div class="resume-timeline-body">
        <div class="resume-timeline-ruler" aria-hidden="true" />

        <ol class="resume-timeline-entries">
          <ResumeTimelineEntry v-for="entry in resumeEntries" :key="entry.id" :entry="entry" />
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.resume-timeline {
  --ruler-width: 64px;
  --ruler-gap: 56px;

  padding-bottom: 60px;
}

@media (max-width: 760px) {
  .resume-timeline {
    --ruler-gap: 28px;
  }
}

.resume-timeline-body {
  display: flex;
  gap: var(--ruler-gap);
}

/*
  Minor ticks every 22px down the full height of the entries, drawn as a
  repeating gradient so nothing has to be measured. Each entry renders its
  own major tick and year label and pushes them out into this gutter, which
  keeps them aligned with their entry at any width without script.
*/
.resume-timeline-ruler {
  flex-shrink: 0;
  width: var(--ruler-width);
  background-image: repeating-linear-gradient(to bottom, var(--line) 0 1px, transparent 1px 22px);
  background-repeat: no-repeat;
  background-size: 12px 100%;
}

.resume-timeline-entries {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 64px;
  padding: 0;
  list-style: none;
}
</style>
