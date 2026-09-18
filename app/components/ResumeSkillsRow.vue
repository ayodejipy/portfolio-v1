<script setup lang="ts">
import type { Skill } from '~/data/resume'

const props = defineProps<{
  skill: Skill
}>()

const TICK_COUNT = 21

const position = computed(() => `${props.skill.value}%`)

function isMajorTick(tick: number): boolean {
  return (tick - 1) % 5 === 0
}
</script>

<template>
  <li class="resume-skills-row">
    <p class="resume-skills-row-top">
      <span class="resume-skills-row-name">{{ skill.name }}</span>
      <span class="visually-hidden">, </span>
      <span class="resume-skills-row-value">
        <span aria-hidden="true">{{ skill.value }} / 100</span>
        <span class="visually-hidden">{{ skill.value }} out of 100</span>
      </span>
    </p>

    <div class="resume-skills-row-scale" aria-hidden="true">
      <span class="resume-skills-row-track" />
      <span class="resume-skills-row-ticks">
        <span
          v-for="tick in TICK_COUNT"
          :key="tick"
          class="resume-skills-row-tick"
          :class="{ 'is-major': isMajorTick(tick) }"
        />
      </span>
      <span class="resume-skills-row-fill" :style="{ width: position }" />
      <span class="resume-skills-row-cursor" :style="{ left: position }" />
    </div>
  </li>
</template>

<style scoped>
/*
  The fill and cursor sit at their final value. The concept sweeps them in
  from zero as the section scrolls into view; that belongs to the animation
  pass.
*/
.resume-skills-row {
  margin-bottom: 26px;
}

.resume-skills-row-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
}

.resume-skills-row-name {
  color: var(--ink);
}

.resume-skills-row-value {
  color: var(--ink-soft);
}

.resume-skills-row-scale {
  position: relative;
  height: 18px;
}

.resume-skills-row-track,
.resume-skills-row-fill {
  position: absolute;
  top: 8px;
  left: 0;
  height: 1px;
}

.resume-skills-row-track {
  right: 0;
  background: var(--line);
}

.resume-skills-row-fill {
  background: var(--accent);
}

.resume-skills-row-ticks {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-between;
}

.resume-skills-row-tick {
  width: 1px;
  height: 18px;
  background: var(--line);
}

.resume-skills-row-tick.is-major {
  background: var(--ink-soft);
}

.resume-skills-row-cursor {
  position: absolute;
  top: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  transform: translateX(-50%);
}
</style>
