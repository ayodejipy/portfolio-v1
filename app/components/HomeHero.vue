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
          <span class="home-hero-line">
            <span class="home-hero-line-inner">{{ line.text }}</span>
          </span>{{ ' ' }}
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

/*
  Each line is a window, and the span inside it is what moves, so the text
  rises out of nothing instead of sliding over the page.

  The window has to be deeper than the line box it wraps. Line height here
  is 0.98, tighter than the glyphs themselves, so ascenders and descenders
  sit outside it and a plain overflow:hidden would shave the top off an `f`
  and the tail off a `p`. The padding that makes room is taken straight back
  off as margin, so nothing below the hero moves.
*/
.home-hero-line {
  display: block;
  overflow: hidden;
  padding-block: 0.14em 0.2em;
  margin-block: -0.14em -0.2em;
}

.home-hero-line-inner {
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

/*
  The reveal, in CSS rather than in a timeline, because it has to be running
  before the page hydrates. Driven from GSAP it could not start until the
  component mounted, and the hero would have to be held invisible until
  then: measured on a 4x-throttled CPU that moved LCP from 824ms to 1588ms.

  `both` carries the from-state, so there is no separate hold to undo and
  nothing to go wrong if the JavaScript never arrives.
*/
@media (prefers-reduced-motion: no-preference) {
  .home-hero-eyebrow {
    animation: hero-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .home-hero-line-inner {
    animation: hero-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .home-hero-line:nth-child(1) .home-hero-line-inner {
    animation-delay: 0.14s;
  }

  .home-hero-line:nth-child(2) .home-hero-line-inner {
    animation-delay: 0.21s;
  }

  .home-hero-line:nth-child(3) .home-hero-line-inner {
    animation-delay: 0.28s;
  }

  /*
    These two move without fading, and that is not a style choice. The intro
    paragraph is what the browser counts as this page's largest paint once
    the headline is clipped out of sight, and an element at zero opacity is
    not counted as painted at all. Fading it in on a 0.42s delay measured
    1740ms LCP; moving it the same distance with no fade measures 852ms.
  */
  .home-hero-intro {
    animation: hero-settle 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.42s both;
  }

  .home-hero-fact {
    animation: hero-settle 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
  }

  .home-hero-fact:nth-child(2) {
    animation-delay: 0.56s;
  }

  .home-hero-fact:nth-child(3) {
    animation-delay: 0.62s;
  }
}

@keyframes hero-rise {
  from {
    transform: translateY(120%);
  }
}

@keyframes hero-settle {
  from {
    transform: translateY(14px);
  }
}

@keyframes hero-fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}
</style>
