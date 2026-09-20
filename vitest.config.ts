import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    // End-to-end tests build the app; they run separately via `pnpm test:e2e`.
    exclude: ['**/node_modules/**', 'tests/e2e/**'],
  },
})
