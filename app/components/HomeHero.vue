<script setup lang="ts">
import { hero } from '~/data/hero'
</script>

<template>
  <section id="index" class="home-hero" aria-labelledby="home-hero-heading">
    <div class="home-hero-content">
      <p class="home-hero-eyebrow">
        {{ hero.eyebrow }}
      </p>

      <h1 id="home-hero-heading" class="home-hero-headline">
        <template v-for="line in hero.headline" :key="line.text">
          <span class="home-hero-line">{{ line.text }}</span>{{ ' ' }}
        </template>
      </h1>

      <p class="home-hero-intro">
        {{ hero.intro }}
      </p>

      <dl class="home-hero-meta">
        <div v-for="fact in hero.meta" :key="fact.label" class="home-hero-fact">
          <dt class="home-hero-fact-label">
            {{ fact.label }}
          </dt>
          <dd class="home-hero-fact-value">
            {{ fact.value }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
/*
  The coordinate-grid concept's hero. Three things from it are left out on
  purpose: the rise-up animation, which belongs to the animation pass; the
  hotlinked stock-photo grain layer, which is an open decision in TODOS.md;
  and the hero's own grid, which `SiteGrid` now covers for every page.
*/
.home-hero {
  position: relative;
  display: flex;
  min-height: calc(100dvh - var(--header-height));
  flex-direction: column;
  justify-content: center;
  padding-inline: var(--gutter);
  padding-block: var(--space-2xl);
}

/*
  The block is as wide as its own content and centred in the page, rather
  than filling the container the other sections use. That is what gives the
  concept's hero its space, and it is why the hero does not line up with the
  section headings below it.
*/
.home-hero-content {
  width: fit-content;
  max-width: 100%;
  margin-inline: auto;
}

.home-hero-eyebrow {
  margin-bottom: 20px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.home-hero-headline {
  max-width: 16ch;
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 7vw, 6rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 0.98;
}

.home-hero-line {
  display: block;
}

.home-hero-intro {
  max-width: 46ch;
  margin-top: 34px;
  color: var(--ink-soft);
  font-size: 1.05rem;
  line-height: 1.6;
}

.home-hero-meta {
  display: flex;
  flex-wrap: wrap;
  margin: 56px 0 0;
  gap: 48px;
}

.home-hero-fact-label {
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 11px;
}

.home-hero-fact-value {
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 600;
}

@media (max-width: 600px) {
  .home-hero-meta {
    gap: var(--space-m);
  }
}
</style>
