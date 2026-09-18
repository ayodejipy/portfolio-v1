# Portfolio — working conventions

This is Ayodeji's personal frontend developer portfolio (Nuxt 4 / Vue 3). It
is a **pair-programming project**, not a hand-it-to-Claude one. Read this
whole file before touching code in this repo.

## The one rule that overrides everything else

**Never write animation/transition/motion logic in this project.** Ayodeji
writes all of it himself — motion-v usage, GSAP timelines/ScrollTrigger,
Lenis config, view-transition wiring, any `<Transition>` choreography. You
may explain concepts, review what he's written, debug errors, and suggest
approaches in words or tiny illustrative snippets he doesn't paste in
directly — but you do not author it. Everything else (scaffolding, non-
animated component structure, state management, tooling, tests, config) is
fair game. Don't proceed to whatever comes after the animation phase until
he says it's done.

## Design reference

The visual reference is a set of standalone HTML prototypes archived in
Ayodeji's Obsidian vault under `projects/portfolio/concepts/`, indexed by
`projects/portfolio/portfolio-design-concepts.md`. `homepage.html` is the
fullest of them: header, overlay nav, ⌘K palette, hero, Selected Work, and
the résumé teaser. Build from the files dated 28 August 2026 onward;
`portfolio-concept.html` is an earlier direction that was dropped.

The full research and decision log (**Portfolio Design Process.md**,
including the Phase 14 build order) is not on this machine. Ask Ayodeji for
it when you need a decision the prototypes and this file don't cover.

## Conventions — treat this list as a living standard, not a one-time rule

Improve it as we learn what actually works for this codebase; don't silently
drift from it.

### Structure

- Everything app-facing under `app/` (Nuxt 4 default): `pages/`,
  `layouts/`, `components/`, `composables/`, `stores/`, `plugins/`,
  `assets/`, `middleware/`, `utils/`.
- Typed content (projects, résumé entries, nav links, palette commands)
  lives in `app/data/`, one file per collection, each exporting its
  interface next to the data. It is imported explicitly (`~/data/projects`)
  rather than auto-imported.
- One component per file. Tightly-coupled components get the parent's name
  as a prefix (`SelectedWork.vue`, `SelectedWorkRow.vue`) instead of nested
  folders. Base/presentational components get a `Base` prefix
  (`BaseButton.vue`).
- Tests colocated: `foo.ts` → `foo.test.ts`, same folder.

### Naming

- Components: PascalCase filenames, full words, no abbreviations.
- Props: camelCase declared, kebab-case only if ever hit an in-DOM template.
- Composables: `use` prefix, named for what they return, one job each.
- Multi-word component names go general → specific (`SearchButtonClear`,
  not `ClearSearchButton`).

### Component style

- `<script setup lang="ts">` everywhere. Composition API only.
- Self-closing tags for childless components. Keep template expressions
  simple — anything with a branch or transform becomes a computed property.
- Directive shorthands (`:`, `@`, `#`) used consistently, never mixed with
  the long form in the same file.

### State (Pinia)

- Setup-store syntax (`defineStore('x', () => {...})`), not options-store
  syntax — consistent with Composition-API-everywhere.
- Composables expose state read-only alongside explicit actions rather
  than handing back a raw mutable object.
- Stores are the exception: a setup store must return every piece of state
  as a plain `ref`, never wrapped in `readonly()` or hidden behind a
  computed. Pinia hydrates SSR state on the client by writing to each
  returned ref, so a readonly ref rejects the write (Vue warns "Set
  operation on key "value" failed: target is readonly") and the server's
  state never reaches the client; unreturned state also skips devtools and
  `$reset`/`$patch`. Mutate store state only through the store's actions;
  that part is enforced in review, not by the type system.

### Animation library boundaries (project-specific — see design doc Phase 12)

- motion-v: gesture/reveal/layout-driven animation.
- GSAP + ScrollTrigger: reserved for frame-precise timelines only (blueprint
  loader, résumé ruler scroll marker).
- Lenis: scroll feel.
- Never let two of the above animate the same property on the same element
  at once.
- Everything animated gets a `usePreferredReducedMotion` fallback.

### Linting / TypeScript

- `@nuxt/eslint` in `standalone: false` mode (Nuxt-aware rules only) layered
  under `@antfu/eslint-config` for style/format/TS/Vue rules.
- `strict: true` TypeScript. Explicit return types on non-trivial functions.
  Non-trivial inline types get pulled into their own `type`/`interface`.
- TypeScript stays on 5.x for now even though 7.x is the published latest:
  `@typescript-eslint` (pulled in by `@antfu/eslint-config`) declares a peer
  range of `>=4.8.4 <6.1.0`, so bumping TypeScript past that breaks
  `pnpm lint`. Revisit once typescript-eslint ships TS 7 support.
- `formatters: true` in `eslint.config.mjs` requires `eslint-plugin-format`.
  It is an explicit devDependency so ESLint never prompts to install it
  mid-run (which would hang a non-interactive lint).

### Testing

- Vitest + `@nuxt/test-utils`, `environment: 'nuxt'`. Unit tests
  (`mountSuspended`/`renderSuspended`) and e2e tests
  (`@nuxt/test-utils/e2e`) stay in separate files — different environments.

## Status

Installed and building (2026-09-11): `pnpm install`, `pnpm lint`, and
`pnpm build` all pass. Dependencies were moved off `"latest"` onto explicit
caret ranges at the same time. Current phase: non-animated
UI port (header, overlay nav, ⌘K palette, hero, Selected Work, résumé page,
footer — all structure/markup, zero motion) — see the design doc's Phase 14
for the full phase breakdown.
