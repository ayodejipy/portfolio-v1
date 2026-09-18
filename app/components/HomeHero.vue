<script setup lang="ts">
import { hero } from '~/data/hero'
</script>

<template>
  <section class="home-hero" aria-labelledby="home-hero-heading">
    <div class="home-hero-grid" aria-hidden="true" />

    <div class="home-hero-content container">
      <p class="home-hero-eyebrow">
        {{ hero.eyebrow }}
      </p>

      <h1 id="home-hero-heading" class="home-hero-headline">
        <template v-for="line in hero.headline" :key="line.text">
          <span class="home-hero-line" :class="{ 'is-accent': line.accent }">{{ line.text }}</span>{{ ' ' }}
        </template>
      </h1>

      <p class="home-hero-intro">
        {{ hero.intro }}
      </p>

      <p class="home-hero-scroll-cue">
        <span class="home-hero-scroll-line" aria-hidden="true" />
        {{ hero.scrollCue }}
      </p>
    </div>
  </section>
</template>

<style scoped>
/*
  Sizes are the concept's own values. Two things from it are left out on
  purpose: the rise-up and pulse animations, which belong to the animation
  pass, and the hotlinked stock-photo grain layer, which is an open decision
  in TODOS.md.
*/
.home-hero {
  position: relative;
  display: flex;
  min-height: calc(100dvh - var(--header-height));
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 90px;
  overflow: hidden;
}

.home-hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(circle at 30% 70%, black 0%, transparent 70%);
  opacity: 0.5;
}

.home-hero-content {
  position: relative;
  z-index: 1;
}

.home-hero-eyebrow {
  margin-bottom: 22px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.home-hero-headline {
  max-width: 16ch;
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 8vw, 7rem);
  font-style: italic;
  font-weight: 500;
  line-height: 0.98;
}

.home-hero-line {
  display: block;
}

.home-hero-line.is-accent {
  color: var(--accent);
}

.home-hero-intro {
  max-width: 44ch;
  margin-top: 28px;
  color: var(--ink-soft);
  font-size: 1.08rem;
  line-height: 1.6;
}

.home-hero-scroll-cue {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 60px;
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
}

.home-hero-scroll-line {
  width: 40px;
  height: 1px;
  background: var(--ink-soft);
}
</style>
