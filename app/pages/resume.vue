<script setup lang="ts">
useHead({ title: 'Résumé' })
</script>

<template>
  <div class="resume-page container">
    <h1>Résumé</h1>
    <p>
      Placeholder page so the route resolves. The fine ruler timeline and
      the real entries arrive with the résumé page task.
    </p>
  </div>
</template>

<style scoped>
.resume-page {
  padding-block: var(--space-xl);
}

.resume-page p {
  max-width: var(--measure);
  margin-top: var(--space-m);
  color: var(--ink-soft);
}
</style>
