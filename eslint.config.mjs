import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

// @nuxt/eslint (standalone: false, see nuxt.config.ts) contributes only the
// Nuxt-aware rules (auto-imports, component resolution); @antfu/eslint-config
// supplies the actual style/formatting/TS/Vue ruleset used across the Vue
// community and by the Nuxt core team itself.
export default withNuxt(
  antfu({
    vue: true,
    typescript: true,
    formatters: true,
  }),
)
