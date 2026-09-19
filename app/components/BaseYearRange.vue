<script setup lang="ts">
/**
 * A year range drawn with an arrow and read aloud with "to". Takes `YYYY`
 * or `YYYY-MM`; a null end reads as Present, and a range that starts and
 * ends in the same year collapses to that one year.
 */
const props = defineProps<{
  start: string
  end: string | null
}>()

const from = computed(() => props.start.slice(0, 4))
const to = computed(() => (props.end === null ? 'Present' : props.end.slice(0, 4)))
const isSingleYear = computed(() => from.value === to.value)
</script>

<template>
  <span class="base-year-range">
    <template v-if="isSingleYear">
      {{ from }}
    </template>
    <template v-else>
      {{ from }} <span aria-hidden="true">→</span><span class="visually-hidden">to</span> {{ to }}
    </template>
  </span>
</template>
