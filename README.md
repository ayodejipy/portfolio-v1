---
tags: [personal, portfolio, nuxt, vue]
status: in-progress
created: 2026-09-09
---

# Portfolio

Personal frontend developer portfolio. Nuxt 4 / Vue 3, built to port over the
concepts explored in the companion design doc ("Portfolio Design Process",
kept in the Obsidian vault): the editorial full-screen nav overlay, the ⌘K
command palette, the Kinetic Typography hero, and the Fine Ruler résumé
timeline.

## Stack

- **Nuxt 4** — `app/` directory structure, native View Transitions
  (`experimental.viewTransition`) for shared-element morphs between pages.
- **Pinia** (`@pinia/nuxt`) — state management, stores in `app/stores/`.
- **motion-v** — primary declarative animation layer (Vue port of Motion /
  Framer Motion), for hover/reveal/layout animation.
- **GSAP + ScrollTrigger** — reserved for frame-precise choreography only:
  the blueprint loader sequence, the résumé ruler's scroll-synced marker.
- **Lenis** (`lenis/nuxt`) — smooth scrolling, synced with GSAP's ticker.
- **VueUse** — utilities, incl. `usePreferredReducedMotion` gating.
- **ESLint** — `@nuxt/eslint` (Nuxt-aware rules only, `standalone: false`)
  layered under `@antfu/eslint-config` (the ruleset used across the Vue
  ecosystem and by the Nuxt core team).
- **Vitest + @nuxt/test-utils** — unit/component tests colocated as
  `*.test.ts` next to the file they cover.

## Getting started

```bash
pnpm install
pnpm dev
```

The dev server runs at http://localhost:3000.

Dependencies use explicit caret ranges and are locked in `pnpm-lock.yaml`.
Avoid blanket upgrades with `pnpm up --latest`: TypeScript has to stay on 5.x
until `@typescript-eslint` supports TypeScript 7, and a blanket upgrade moves
it past that and breaks `pnpm lint` (see CLAUDE.md). Upgrade packages
individually instead.

## Project structure

```
app/
  assets/css/    — global styles, design tokens (locked palette)
  composables/   — useReducedMotion, etc.
  pages/         — routes
  plugins/       — gsap.client.ts (GSAP + ScrollTrigger registration)
  stores/        — Pinia stores (ui.ts: nav/palette open state)
public/
```

## Design reference

Full design exploration, decision log, and the locked-in concepts (nav,
hero, résumé, contact) live in **Portfolio Design Process.md** in the
Obsidian vault — not duplicated here to avoid drift.
