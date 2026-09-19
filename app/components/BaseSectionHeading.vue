<script setup lang="ts">
defineProps<{
  index: string
  title: string
  headingId: string
  /** Tighter top spacing, as the résumé page uses between its sections. */
  compact?: boolean
}>()
</script>

<template>
  <div class="base-section-heading" :class="{ 'is-compact': compact }">
    <span class="base-section-heading-index" aria-hidden="true">{{ index }}</span>
    <h2 :id="headingId" class="base-section-heading-title">
      {{ title }}
    </h2>
  </div>
</template>

<style scoped>
.base-section-heading {
  display: flex;
  align-items: baseline;
  gap: 18px;
  margin-bottom: clamp(28px, 6vw, 50px);
  padding-top: clamp(64px, 14vw, 130px);
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
}

.base-section-heading.is-compact {
  padding-top: clamp(40px, 8vw, 60px);
}

.base-section-heading-index {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 13px;
}

.base-section-heading-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.4vw, 2.6rem);
  font-style: italic;
  font-weight: 500;
}
</style>
