<script setup lang="ts">
/**
 * Specimen page for comparing typefaces against the two the site uses now,
 * Space Grotesk and JetBrains Mono, which arrived with the coordinate-grid
 * skin. Those two load site-wide from nuxt.config; this page loads the other
 * candidates and nothing else, so they cost nothing anywhere else.
 *
 * The preview opens on the live pairing, so every other row is a comparison
 * against what is actually on the site. Delete this page once the faces are
 * settled for good.
 */

interface FontOption {
  name: string
  stack: string
  note: string
}

/**
 * What the site itself uses, from the font tokens in main.css. Keep the two
 * in step: this drives both what the preview opens on and which options are
 * badged, so a stale value here is visible immediately.
 */
const live = {
  display: 'Bricolage Grotesque',
  body: 'DM Sans',
  mono: 'JetBrains Mono',
}

const displayFonts: FontOption[] = [
  { name: 'Space Grotesk', stack: '\'Space Grotesk\', system-ui, sans-serif', note: 'The coordinate-grid concept\'s own face. Upright, no italic.' },
  { name: 'Fraunces', stack: '\'Fraunces\', Georgia, serif', note: 'The concepts use this one, often italic.' },
  { name: 'Instrument Serif', stack: '\'Instrument Serif\', Georgia, serif', note: 'Lighter and sharper, fewer weights.' },
  { name: 'Newsreader', stack: '\'Newsreader\', Georgia, serif', note: 'Editorial and calm, reads well small.' },
  { name: 'Playfair Display', stack: '\'Playfair Display\', Georgia, serif', note: 'High contrast, more classical.' },
  { name: 'Bodoni Moda', stack: '\'Bodoni Moda\', Georgia, serif', note: 'Didone contrast, dramatic large; thin strokes thin out small.' },
  { name: 'EB Garamond', stack: '\'EB Garamond\', Georgia, serif', note: 'Old style and warm, with the best italic of this set.' },
  { name: 'Spectral', stack: '\'Spectral\', Georgia, serif', note: 'A serif drawn for screens, steadier than Playfair.' },
  { name: 'Bricolage Grotesque', stack: '\'Bricolage Grotesque\', system-ui, sans-serif', note: 'A sans with more character than Space Grotesk, still upright.' },
]

const bodyFonts: FontOption[] = [
  { name: 'Space Grotesk', stack: '\'Space Grotesk\', system-ui, sans-serif', note: 'The concept sets this at reading size too, not just in headings.' },
  { name: 'Inter', stack: '\'Inter\', system-ui, sans-serif', note: 'The concepts use this one.' },
  { name: 'IBM Plex Sans', stack: '\'IBM Plex Sans\', system-ui, sans-serif', note: 'Slightly warmer, more character.' },
  { name: 'Work Sans', stack: '\'Work Sans\', system-ui, sans-serif', note: 'Rounder, a little friendlier.' },
  { name: 'Manrope', stack: '\'Manrope\', system-ui, sans-serif', note: 'Geometric, tighter spacing.' },
  { name: 'DM Sans', stack: '\'DM Sans\', system-ui, sans-serif', note: 'Geometric and quiet, near neighbour of Inter.' },
  { name: 'Public Sans', stack: '\'Public Sans\', system-ui, sans-serif', note: 'Plain and legible, almost no personality of its own.' },
  { name: 'Geist', stack: '\'Geist\', system-ui, sans-serif', note: 'Neutral and current; pairs with Geist Mono below.' },
  { name: 'Schibsted Grotesk', stack: '\'Schibsted Grotesk\', system-ui, sans-serif', note: 'An editorial grotesque with more grip than Inter.' },
]

const monoFonts: FontOption[] = [
  { name: 'JetBrains Mono', stack: '\'JetBrains Mono\', ui-monospace, monospace', note: 'What both concepts used. Even and quiet at 10px.' },
  { name: 'IBM Plex Mono', stack: '\'IBM Plex Mono\', ui-monospace, monospace', note: 'Pairs with IBM Plex Sans.' },
  { name: 'Space Mono', stack: '\'Space Mono\', ui-monospace, monospace', note: 'Quirky and wide, with only 400 and 700: a mono set at 500 renders at 400.' },
  { name: 'Roboto Mono', stack: '\'Roboto Mono\', ui-monospace, monospace', note: 'Neutral and unobtrusive.' },
  { name: 'Geist Mono', stack: '\'Geist Mono\', ui-monospace, monospace', note: 'Even colour at small sizes; pairs with Geist.' },
  { name: 'DM Mono', stack: '\'DM Mono\', ui-monospace, monospace', note: 'Lighter and rounder, gentler against the accent.' },
  { name: 'Azeret Mono', stack: '\'Azeret Mono\', ui-monospace, monospace', note: 'Squarer and more technical, holds up at 10px.' },
  { name: 'Fragment Mono', stack: '\'Fragment Mono\', ui-monospace, monospace', note: 'One weight only, so anything bolder is faked by the browser.' },
]

function startOn(options: FontOption[], name: string): FontOption {
  return options.find(option => option.name === name) ?? options[0]!
}

const display = ref<FontOption>(startOn(displayFonts, live.display))
const body = ref<FontOption>(startOn(bodyFonts, live.body))
const mono = ref<FontOption>(startOn(monoFonts, live.mono))

useHead({
  title: 'Type specimens',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    /*
      Every candidate, the live three included. They overlap with the
      stylesheet in nuxt.config, which costs a cached request rather than
      another download, and it means changing the site's faces never leaves
      this page with a face it cannot draw.
    */
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Instrument+Serif:ital@0;1&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;1,6..96,400&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Spectral:ital,wght@0,400;0,600;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600&family=Inter:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Work+Sans:wght@400;500;600&family=Manrope:wght@400;500;600&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&family=Public+Sans:wght@400;500;600&family=Geist:wght@400;500;600&family=Schibsted+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Space+Mono:wght@400;700&family=Roboto+Mono:wght@400;500&family=Geist+Mono:wght@400;500&family=DM+Mono:wght@400;500&family=Azeret+Mono:wght@400;500&family=Fragment+Mono:ital@0;1&display=swap',
    },
  ],
})
</script>

<template>
  <div class="type-page container">
    <header class="type-intro">
      <h1>Type specimens</h1>
      <p>
        The preview opens on what the site uses now, marked
        <em>on the site</em> in the rows below. Pick one from each row and it
        redraws, so every choice here is a comparison against the live
        pairing. Nothing on this page changes the site; this page is
        temporary.
      </p>
    </header>

    <section class="type-preview" aria-label="Preview">
      <p class="type-preview-eyebrow" :style="{ fontFamily: mono.stack }">
        Frontend Developer
      </p>

      <p class="type-preview-hero" :style="{ fontFamily: display.stack }">
        Quiet craft, loud results.
      </p>

      <p class="type-preview-body" :style="{ fontFamily: body.stack }">
        Structure, then story. This paragraph stands in for the body copy
        that runs under the hero and through the résumé, so the pairing can
        be judged at reading size rather than in a headline alone.
      </p>

      <div class="type-preview-row" :style="{ fontFamily: mono.stack }">
        <span>→ Résumé</span>
        <span>GO</span>
      </div>

      <!-- The rail, the HUD and the footer all set mono at 10px, which is
           where a mono face either holds its shape or turns to mush. -->
      <p class="type-preview-fine" :style="{ fontFamily: mono.stack }">
        At 10px / 00 Index / 01 Work / 02 Résumé / 03 Contact / 2019 to 2026
      </p>

      <p class="type-preview-current">
        {{ display.name }} + {{ body.name }} + {{ mono.name }}
      </p>
    </section>

    <section class="type-group">
      <h2>Display</h2>
      <div class="type-options">
        <button
          v-for="option in displayFonts"
          :key="option.name"
          type="button"
          class="type-option"
          :class="{ 'is-chosen': option.name === display.name }"
          :aria-pressed="option.name === display.name"
          @click="display = option"
        >
          <span class="type-option-sample" :style="{ fontFamily: option.stack }">Aa</span>
          <span class="type-option-name">
            {{ option.name }}
            <span v-if="option.name === live.display" class="type-option-live">on the site</span>
          </span>
          <span class="type-option-note">{{ option.note }}</span>
        </button>
      </div>
    </section>

    <section class="type-group">
      <h2>Body</h2>
      <div class="type-options">
        <button
          v-for="option in bodyFonts"
          :key="option.name"
          type="button"
          class="type-option"
          :class="{ 'is-chosen': option.name === body.name }"
          :aria-pressed="option.name === body.name"
          @click="body = option"
        >
          <span class="type-option-sample" :style="{ fontFamily: option.stack }">Aa</span>
          <span class="type-option-name">
            {{ option.name }}
            <span v-if="option.name === live.body" class="type-option-live">on the site</span>
          </span>
          <span class="type-option-note">{{ option.note }}</span>
        </button>
      </div>
    </section>

    <section class="type-group">
      <h2>Mono</h2>
      <div class="type-options">
        <button
          v-for="option in monoFonts"
          :key="option.name"
          type="button"
          class="type-option"
          :class="{ 'is-chosen': option.name === mono.name }"
          :aria-pressed="option.name === mono.name"
          @click="mono = option"
        >
          <span class="type-option-sample" :style="{ fontFamily: option.stack }">Aa</span>
          <span class="type-option-name">
            {{ option.name }}
            <span v-if="option.name === live.mono" class="type-option-live">on the site</span>
          </span>
          <span class="type-option-note">{{ option.note }}</span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.type-page {
  padding-block: var(--space-xl) var(--space-2xl);
}

.type-intro p {
  max-width: var(--measure);
  margin-top: var(--space-s);
  color: var(--ink-soft);
}

.type-preview {
  margin-block: var(--space-l);
  padding: var(--space-l);
  border: 1px solid var(--line);
}

.type-preview-eyebrow {
  color: var(--accent);
  font-size: var(--step--1);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.type-preview-hero {
  margin-top: var(--space-s);
  font-size: var(--step-4);
  line-height: 1.05;
}

.type-preview-body {
  max-width: var(--measure);
  margin-top: var(--space-m);
  font-size: var(--step-0);
  line-height: 1.6;
}

.type-preview-row {
  display: flex;
  justify-content: space-between;
  max-width: 320px;
  margin-top: var(--space-m);
  padding: 11px 12px;
  border: 1px solid var(--line);
  border-radius: 6px;
  font-size: 13px;
}

.type-preview-fine {
  margin-top: var(--space-s);
  color: var(--ink-soft);
  font-size: 10px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.type-preview-current {
  margin-top: var(--space-m);
  color: var(--ink-soft);
  font-size: var(--step--1);
}

.type-group {
  margin-top: var(--space-l);
}

.type-group h2 {
  font-size: var(--step-1);
}

.type-options {
  display: grid;
  gap: var(--space-s);
  margin-top: var(--space-s);
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.type-option {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
  padding: var(--space-s);
  border: 1px solid var(--line);
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.type-option.is-chosen {
  border-color: var(--accent);
}

.type-option-sample {
  font-size: var(--step-3);
  line-height: 1.1;
}

.type-option-name {
  font-size: var(--step-0);
}

.type-option-live {
  margin-left: var(--space-3xs);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.type-option-note {
  color: var(--ink-soft);
  font-size: var(--step--1);
}
</style>
