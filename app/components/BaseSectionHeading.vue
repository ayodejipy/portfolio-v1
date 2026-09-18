<script setup lang="ts">
defineProps<{
  index: string
  title: string
  headingId: string
}>()
</script>

<template>
  <div class="base-section-heading">
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
  margin-bottom: 50px;
  padding-top: 130px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
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
