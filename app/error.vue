<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isNotFound = computed(() => props.error.statusCode === 404)

const title = computed(() => (isNotFound.value ? 'Page not found' : 'Something went wrong'))

/**
 * Deliberately never shows error.message: on a server failure it can carry
 * internal detail that visitors should not see.
 */
const explanation = computed(() => (isNotFound.value
  ? 'The page you were looking for does not exist, or it has moved.'
  : 'Something unexpected stopped this page from loading. Starting again from the home page usually sorts it out.'))

useSiteHead()
useHead({ title })

function goHome(): void {
  clearError({ redirect: '/' })
}
</script>

<template>
  <NuxtLayout>
    <section class="error-page container" aria-labelledby="error-page-title">
      <p class="error-page-eyebrow">
        Error {{ error.statusCode }}
      </p>

      <h1 id="error-page-title" class="error-page-title">
        {{ title }}
      </h1>

      <p class="error-page-text">
        {{ explanation }}
      </p>

      <button type="button" class="error-page-home" @click="goHome">
        Back to the home page <span aria-hidden="true">→</span>
      </button>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.error-page {
  display: flex;
  min-height: calc(100dvh - var(--header-height));
  flex-direction: column;
  justify-content: center;
  padding-block: 60px;
}

.error-page-eyebrow {
  margin-bottom: 22px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.error-page-title {
  max-width: 16ch;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 6.4vw, 5rem);
  font-style: italic;
  font-weight: 500;
  line-height: 1.05;
}

.error-page-text {
  max-width: 56ch;
  margin-top: 26px;
  color: var(--ink-soft);
  font-size: 1.05rem;
  line-height: 1.65;
}

.error-page-home {
  align-self: flex-start;
  margin-top: 38px;
  padding: 0 0 3px;
  border: none;
  border-bottom: 1px solid var(--accent);
  background: none;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 13px;
  text-transform: uppercase;
  cursor: pointer;
}
</style>
