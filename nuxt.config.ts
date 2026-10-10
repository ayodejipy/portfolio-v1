// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    'lenis/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  /*
    The site's three faces, served by Google Fonts. `display=swap` so text
    paints in the fallback rather than waiting. The specimen page at /type
    compares them against the alternatives; keep its `live` constant in step
    with the tokens in main.css.

    Self-hosting these would drop the third-party origin and the extra
    connection; it means adding a dependency or committing the woff2 files,
    so it is left for the launch pass.
  */
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&family=JetBrains+Mono:wght@400;500&display=swap',
        },
      ],
    },
  },

  // Native shared-element transitions (Chromium-first, degrades gracefully).
  // See Phase 12 of the design doc for how this maps to the nav/hero/résumé prototypes.
  experimental: {
    viewTransition: true,
  },

  eslint: {
    config: {
      // Only emit Nuxt-aware rules here; the opinionated style/formatting
      // rules come from @antfu/eslint-config, layered in eslint.config.mjs.
      standalone: false,
    },
  },

  typescript: {
    strict: true,
  },
})
