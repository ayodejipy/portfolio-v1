<script setup lang="ts">
import { resumeEntries } from '~/data/resume'

const $gsap = useMotion()
const reducedMotion = useReducedMotion()

const ruler = ref<HTMLElement | null>(null)
const readout = ref<HTMLElement | null>(null)

/* Prefixed, because an entry's own id only has to be unique within the
   résumé data, and this one has to be unique in the document. */
function markerId(id: string): string {
  return `timeline-${id}`
}

/*
  Two different questions, and they want two different answers.

  `activeId` is the one entry under the reading line, and it is what the
  year label reports: exactly one year is ever lit.

  `inView` is everything currently in front of the reader, usually one entry
  and sometimes two, and it is what turns the connector rules accent. The
  ruler then shows a lit stretch rather than a single lit point, which is
  what makes it read as a measurement of where you are rather than a cursor.
*/
const entryIds = resumeEntries.map(entry => markerId(entry.id))
const activeId = useActiveSection(entryIds)
const inView = useInView(entryIds)

let marker: gsap.core.Tween | null = null

/*
  The page's own y coordinate, in the grid's language. Written straight to
  the element rather than through a ref: this changes every frame of a
  scroll, and a ref would re-render the whole timeline each time to change
  four characters. Padded so the width never changes and the text cannot
  reflow what sits beside it.
*/
function showCoordinate(): void {
  if (readout.value) {
    readout.value.textContent = `Y ${String(Math.round(window.scrollY)).padStart(4, '0')}`
  }
}

/*
  The marker tracks the reading line: `top 40%` to `bottom 40%` is the same
  line `useActiveSection` watches, so the marker is level with the entry
  whose year is lit rather than drifting against it.

  `fromTo` names both ends rather than letting a `to` tween record whatever
  the element happens to hold when it first renders. Nothing else writes
  this property, so unlike the rail there is no second animation here for it
  to inherit a start from: this is the shape being defensive, not a fix for
  a bug seen on this page. Swapping it for a `to` passes every test in
  tests/e2e/ruler.test.ts, which is worth knowing before trusting them to
  protect it.

  The scrub smooths the marker against Lenis's own easing, except under
  reduced motion, where it tracks the scroll position exactly. The marker is
  information, so it stays either way; only the smoothing goes.
*/
onMounted(() => {
  showCoordinate()

  marker = $gsap.fromTo(
    ruler.value,
    { '--marker-progress': '0%' },
    {
      '--marker-progress': '100%',
      'ease': 'none',
      'immediateRender': false,
      'scrollTrigger': {
        trigger: ruler.value,
        start: 'top 40%',
        end: 'bottom 40%',
        scrub: reducedMotion.value ? true : 0.3,
        onUpdate: showCoordinate,
        /* The readout is only meaningful while the ruler it belongs to is
           the thing being measured. */
        onToggle: (self) => {
          readout.value?.classList.toggle('is-visible', self.isActive)
        },
      },
    },
  )
})

/* A ScrollTrigger outlives the component that made it. */
onBeforeUnmount(() => {
  marker?.scrollTrigger?.kill()
  marker?.kill()
  marker = null
})
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
        <div ref="ruler" class="resume-timeline-ruler" aria-hidden="true">
          <span class="resume-timeline-marker" />
        </div>

        <ol class="resume-timeline-entries">
          <ResumeTimelineEntry
            v-for="entry in resumeEntries"
            :id="markerId(entry.id)"
            :key="entry.id"
            :entry="entry"
            :class="{
              'is-active': activeId === markerId(entry.id),
              'is-in-view': inView.has(markerId(entry.id)),
            }"
          />
        </ol>
      </div>
    </div>

    <!--
      Hidden from assistive technology: it is a number that changes on every
      frame of a scroll and says nothing the page does not already say.
    -->
    <p ref="readout" class="resume-timeline-readout" aria-hidden="true">
      Y 0000
    </p>
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

/* On a phone the full gutter costs the entries too much of the screen. */
@media (max-width: 480px) {
  .resume-timeline {
    --ruler-width: 40px;
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
  position: relative;
  flex-shrink: 0;
  width: var(--ruler-width);
  background-image: repeating-linear-gradient(to bottom, var(--line) 0 1px, transparent 1px 22px);
  background-repeat: no-repeat;
  background-size: 12px 100%;
}

/*
  The marker. `--marker-progress` is written by the tween above and by
  nothing else: binding it from the template as well is the mistake the rail
  made, where a re-render undid whatever the scrub had just set.

  The square on the left end is what the eye actually follows; the hairline
  carries it across the ticks so the two read as one instrument.
*/
.resume-timeline-marker {
  position: absolute;
  top: var(--marker-progress, 0%);
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--accent);
}

.resume-timeline-marker::before {
  position: absolute;
  top: -2px;
  left: 0;
  width: 5px;
  height: 5px;
  background: var(--accent);
  content: '';
}

/*
  Fixed, so it stays with the reader rather than with the ruler, and in the
  opposite corner to the site's own readout. It fades in when the ruler
  starts passing the reading line and out again when it is done.
*/
.resume-timeline-readout {
  position: fixed;
  z-index: 5;
  right: var(--space-l);
  bottom: var(--space-l);
  margin: 0;
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.1em;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.resume-timeline-readout.is-visible {
  opacity: 1;
}

/* Below this the corner is too close to the text to hold a floating number,
   and the site's own readout is hidden at the same width. */
@media (max-width: 1359px) {
  .resume-timeline-readout {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .resume-timeline-readout {
    transition: none;
  }
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
