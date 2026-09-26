<script setup lang="ts">
import type { PageSection } from '~/data/sections'

const props = defineProps<{
  sections: PageSection[]
}>()

/*
  The list is read once, on mount, since the sections of a page do not come
  and go. A page that changed them would need the observer rebuilt.
*/
const activeId = useActiveSection(props.sections.map(section => section.id))

const activePosition = computed(() => {
  const position = props.sections.findIndex(section => section.id === activeId.value)
  return position === -1 ? 0 : position
})

/** Ticks sit evenly along the track, first at the top, last at the bottom. */
function tickOffset(position: number) {
  return `${percentAlongTrack(position)}%`
}

/**
 * How far down the track the fill reaches, published as `--rail-progress` so
 * the animation pass has one value to take over.
 *
 * It steps from one tick to the next, because that is the whole of what this
 * component knows: a section is current or it is not. Reading scroll position
 * to fill it continuously, and easing the change, is animation work.
 */
const railProgress = computed(() => `${percentAlongTrack(activePosition.value)}%`)

/** Rounded to two places, so the rendered style stays readable. */
function percentAlongTrack(position: number) {
  const lastPosition = props.sections.length - 1
  if (lastPosition <= 0)
    return 0

  return Math.round((position / lastPosition) * 10000) / 100
}

function indexLabel(position: number) {
  return String(position).padStart(2, '0')
}
</script>

<template>
  <nav class="site-rail" aria-label="Page sections" :style="{ '--rail-progress': railProgress }">
    <div class="site-rail-track">
      <span class="site-rail-fill" aria-hidden="true" />

      <ol class="site-rail-ticks">
        <li
          v-for="(section, position) in sections"
          :key="section.id"
          class="site-rail-tick"
          :class="{ 'is-active': section.id === activeId }"
          :style="{ top: tickOffset(position) }"
        >
          <a
            class="site-rail-link"
            :href="`#${section.id}`"
            :aria-current="section.id === activeId ? 'true' : undefined"
          >
            <!-- The space is explicit: the template would drop it, and the
                 number and label would be announced as one word. -->
            <span class="site-rail-index">{{ indexLabel(position) }}</span>{{ ' ' }}<span class="site-rail-label">{{ section.label }}</span>
          </a>
        </li>
      </ol>
    </div>

    <span class="site-rail-hint" aria-hidden="true">Scroll</span>
  </nav>
</template>

<style scoped>
/*
  The concept's left rail: a short measure of the page with a tick per
  section, pinned to the middle of the viewport and hard against its left
  edge, where the concept has it. It stays at the same inset at every width,
  so it reads as part of the window rather than as part of the column.

  The breakpoint is where that inset stops colliding with the text. The
  labels reach about 116px, and the container's text edge is
  `(100vw - 72rem) / 2 + 24px`, which passes 116px at roughly 1336px of
  viewport. Below the breakpoint the rail is not rendered at all, and nothing
  is lost: it only repeats sections the page already shows and the palette
  already lists.
*/
.site-rail {
  --rail-inset: 28px;

  position: fixed;
  z-index: 5;
  top: 0;
  bottom: 0;
  left: var(--rail-inset);
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media (min-width: 1360px) {
  .site-rail {
    display: flex;
  }
}

.site-rail-track {
  position: relative;
  width: 1px;
  height: 220px;
  background: var(--line);
}

.site-rail-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: var(--rail-progress, 0%);
  background: var(--accent);
}

.site-rail-ticks {
  position: absolute;
  padding: 0;
  margin: 0;
  inset: 0;
  list-style: none;
}

.site-rail-tick {
  position: absolute;
  left: -3px;
  width: 7px;
  height: 1px;
  background: var(--line);
}

/* The current section's tick runs longer as well as darker, as the concept
   draws it, so the eye finds it without relying on colour alone. */
.site-rail-tick.is-active {
  left: -7px;
  width: 15px;
  background: var(--accent);
}

.site-rail-link {
  position: absolute;
  top: -7px;
  left: 14px;
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.05em;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;
}

.site-rail-tick.is-active .site-rail-link {
  /* The longer tick moves its own left edge out by 4px, and the label is
     positioned against it, so this holds the labels in one column. */
  left: 18px;
  color: var(--accent);
}

.site-rail-hint {
  margin-top: 22px;
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.2em;
  text-orientation: mixed;
  text-transform: uppercase;
  writing-mode: vertical-rl;
}
</style>
