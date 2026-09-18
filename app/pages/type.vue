<script setup lang="ts">
/**
 * Temporary specimen page for choosing the site's typefaces. It is the only
 * place that loads webfonts; the site itself stays on system stacks until a
 * choice is made. Delete this page once the decision is recorded.
 */

interface FontOption {
  name: string
  stack: string
  note: string
}

const displayFonts: FontOption[] = [
  { name: 'Fraunces', stack: '\'Fraunces\', Georgia, serif', note: 'The concepts use this one, often italic.' },
  { name: 'Instrument Serif', stack: '\'Instrument Serif\', Georgia, serif', note: 'Lighter and sharper, fewer weights.' },
  { name: 'Newsreader', stack: '\'Newsreader\', Georgia, serif', note: 'Editorial and calm, reads well small.' },
  { name: 'Playfair Display', stack: '\'Playfair Display\', Georgia, serif', note: 'High contrast, more classical.' },
]

const bodyFonts: FontOption[] = [
  { name: 'Inter', stack: '\'Inter\', system-ui, sans-serif', note: 'The concepts use this one.' },
  { name: 'IBM Plex Sans', stack: '\'IBM Plex Sans\', system-ui, sans-serif', note: 'Slightly warmer, more character.' },
  { name: 'Work Sans', stack: '\'Work Sans\', system-ui, sans-serif', note: 'Rounder, a little friendlier.' },
  { name: 'Manrope', stack: '\'Manrope\', system-ui, sans-serif', note: 'Geometric, tighter spacing.' },
]

const monoFonts: FontOption[] = [
  { name: 'JetBrains Mono', stack: '\'JetBrains Mono\', ui-monospace, monospace', note: 'The concepts use this one.' },
  { name: 'IBM Plex Mono', stack: '\'IBM Plex Mono\', ui-monospace, monospace', note: 'Pairs with IBM Plex Sans.' },
  { name: 'Space Mono', stack: '\'Space Mono\', ui-monospace, monospace', note: 'Quirky, strong personality.' },
  { name: 'Roboto Mono', stack: '\'Roboto Mono\', ui-monospace, monospace', note: 'Neutral and unobtrusive.' },
]

const display = ref<FontOption>(displayFonts[0]!)
const body = ref<FontOption>(bodyFonts[0]!)
const mono = ref<FontOption>(monoFonts[0]!)

useHead({
  title: 'Type specimens',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Instrument+Serif:ital@0;1&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Work+Sans:wght@400;500;600&family=Manrope:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=Space+Mono:wght@400;700&family=Roboto+Mono:wght@400;500&display=swap',
    },
  ],
})
</script>

<template>
  <div class="type-page container">
    <header class="type-intro">
      <h1>Type specimens</h1>
      <p>
        Pick one from each row and the preview above updates. Nothing here
        is wired into the site yet: every page still uses the system stacks
        until a choice is made. This page is temporary.
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
          <span class="type-option-name">{{ option.name }}</span>
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
          <span class="type-option-name">{{ option.name }}</span>
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
          <span class="type-option-name">{{ option.name }}</span>
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

.type-option-note {
  color: var(--ink-soft);
  font-size: var(--step--1);
}
</style>
