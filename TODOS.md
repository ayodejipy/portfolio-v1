# Portfolio: implementation plan

Every task for the build, grouped by phase, with an owner on each line. It
combines what README.md, CLAUDE.md, and the code comments describe with the
standard work any launch needs. The design doc ("Portfolio Design Process",
Phase 14) is the authority on order and scope, so reconcile this plan
against it once it's available.

## Who does what

**Claude** builds; Ayodeji reviews before anything merges.

- Page and component structure, markup, and static styling
- State (Pinia stores) and composables
- Keyboard behavior, focus management, and accessibility
- Data types and placeholder content
- Tests, tooling, config, and CI
- Reviewing, debugging, and explaining animation code when asked

**Ayodeji** writes or decides.

- All motion: motion-v, GSAP and ScrollTrigger, Lenis config, view
  transitions, `<Transition>`, CSS transitions and keyframes
- Reduced-motion fallbacks for every animation
- Design decisions: phase order, typefaces, the contact concept
- Real content and copy
- Accounts and hosting: domain, hosting provider, the remote repository

**Rules at the boundary**

- Claude ships show/hide as instant `v-if` / `v-show`. No `<Transition>`,
  no CSS `transition` or `animation`, no `view-transition-name`.
- Where behavior meets motion (closing the overlay after its exit
  animation, focusing the palette input after it opens, locking scroll
  under Lenis), Claude ships the instant version with a clear seam and
  Ayodeji adapts it when animating.
- Claude uses stable, semantic class names so animation has something to
  target, but doesn't add refs, wrappers, or text splitting for animation.
- One branch per task, merged after Ayodeji's review. Tick items here as
  they land.

## Phase 0: foundations (done)

- [x] Scaffold: Nuxt 4, Pinia, GSAP + ScrollTrigger, Lenis, motion-v, VueUse
- [x] Dependencies installed and pinned to caret ranges (2026-09-11)
- [x] ESLint 10 toolchain and production build passing
- [x] Git repository with initial commit (2026-09-15)

## Phase 1: groundwork for the UI port

- [ ] **Ayodeji** Confirm the phase order from Phase 14. Routes are settled
      (2026-09-16): `/` is home and `/resume` is the resume and employment
      history.
- [ ] **Ayodeji** Confirm the typefaces. The concept prototypes use
      Fraunces (display, often italic), Inter (body), and JetBrains Mono
      (labels and palette UI); `main.css` is still on the system stack.
- [x] **Claude** Layout shell: `app/layouts/default.vue` with header, main,
      and footer; `app.vue` renders it through `<NuxtLayout>`.
- [x] **Claude** Base styles on top of the color tokens: type scale,
      spacing, container widths, visible focus styles.
- [x] **Claude** Site metadata: title (currently empty), description, and
      social meta through `app.head` / `useHead`.
- [x] **Claude** Content model: typed data for projects, résumé entries,
      nav links, and palette commands, filled with placeholders.
- [ ] **Ayodeji** Replace the placeholders with real content and copy.
- [x] **Claude** First unit test (`app/stores/ui.ts`) so `pnpm test` stops
      exiting 1 on an empty suite.

## Phase 2: non-animated UI port

### Header

- [x] **Claude** Name/logo link, nav trigger button (`aria-expanded`), and
      a ⌘K trigger with a shortcut hint.
- [x] **Claude** Component test: the trigger toggles `ui.navOpen`.

### Overlay nav (Concept A, editorial full-screen)

- [x] **Claude** Overlay markup and link list from the nav data, shown and
      hidden from `ui.navOpen`.
- [x] **Claude** Keep the `body.nav-open` class in sync with the store.
- [x] **Claude** Escape closes, focus is trapped while open and returned to
      the trigger on close, and navigating closes the overlay.
- [x] **Claude** Basic scroll lock while open (body `overflow: hidden`).
- [x] **Claude** Component tests for open, close, Escape, and focus return.
- [x] **Claude** Point the header trigger's `aria-controls` at the overlay
      once the overlay element exists to reference.

### ⌘K command palette (Concept C)

- [ ] **Claude** Dialog markup (`role="dialog"`, `aria-modal`) styled with
      the terminal tokens (`--term-*`).
- [ ] **Claude** Global ⌘K / Ctrl+K shortcut wired to `ui.openPalette`.
- [ ] **Claude** Search input that filters the command list, arrow-key
      navigation, Enter runs the command, Escape closes.
- [ ] **Claude** Focus moves to the input on open and back to the trigger
      on close.
- [ ] **Claude** Tests for filtering, keyboard navigation, and the shortcut.
- [ ] **Claude** Show the shortcut hint per platform (⌘K on macOS, Ctrl K
      elsewhere) without causing a hydration mismatch; the header currently
      hardcodes ⌘K.

### Hero (Kinetic Typography)

- [ ] **Claude** Semantic, static heading markup and type styles.
- [ ] **Ayodeji** Decide whether the kinetic type needs the text split into
      lines or characters; that splitting belongs to the animation work.

### Selected Work

- [ ] **Claude** `SelectedWork.vue` and `SelectedWorkRow.vue`, rendered from
      the typed project data, with static hover styles (no transitions).

### Résumé page (Fine Ruler timeline)

- [ ] **Claude** `/resume` route with timeline entries from the data. A
      placeholder page already exists so the route resolves; replace it.
- [ ] **Claude** Static ruler markup (ticks, labels) with stable class names
      the scroll marker can attach to later.

### Footer and index

- [ ] **Claude** Footer with contact and social links.
- [ ] **Claude** Replace the scaffold check page (`app/pages/index.vue`)
      with the real index: hero, Selected Work, footer.
- [ ] **Claude** Error page (`app/error.vue`) for 404s and failures.

### Contact

- [ ] **Ayodeji** Decide where the locked-in contact concept lands (README
      lists it; the current phase list doesn't).
- [ ] **Claude** Build it once decided.

## Phase 3: hardening (before or alongside animation)

- [ ] **Claude** Responsive pass on every page and component.
- [ ] **Claude** Accessibility audit: keyboard paths, screen reader labels,
      and color contrast of the token pairs.
- [ ] **Claude** End-to-end smoke test (`@nuxt/test-utils/e2e`): open the
      palette, navigate to the résumé, open and close the overlay.
- [ ] **Ayodeji** Review the full non-animated site and sign off before the
      animation phase.

## Phase 4: animation (Ayodeji)

Every item includes its `usePreferredReducedMotion` fallback. Claude's role
here is review, debugging, profiling, and keeping the behavior tests green.

- [ ] **Ayodeji** Blueprint loader sequence (GSAP)
- [ ] **Ayodeji** Hero reveal and kinetic typography
- [ ] **Ayodeji** Overlay nav open and close, including the delayed-close
      seam
- [ ] **Ayodeji** ⌘K palette open and close
- [ ] **Ayodeji** Cursor-follow
- [ ] **Ayodeji** Résumé ruler scroll-synced marker (ScrollTrigger)
- [ ] **Ayodeji** Lenis config and its GSAP ticker sync (the module is
      registered, but the sync isn't wired), including moving the overlay's
      scroll lock onto Lenis
- [ ] **Ayodeji** View-transition shared-element morphs between pages
      (`experimental.viewTransition` is already on)
- [ ] **Claude** Performance trace once the animations are in, and fixes
      for anything outside the motion code.

## Phase 5: launch

- [ ] **Ayodeji** Choose hosting (static `nuxt generate` or a server) and
      the domain.
- [ ] **Ayodeji** Create the remote repository.
- [ ] **Claude** CI workflow: lint, test, and build on every push.
- [ ] **Claude** Deployment config for the chosen host.
- [ ] **Ayodeji** Design the social share image.
- [ ] **Claude** Wire up the share image and a sitemap.
- [ ] **Claude** Final Lighthouse pass and fixes.
