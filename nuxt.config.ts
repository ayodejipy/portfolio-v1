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
