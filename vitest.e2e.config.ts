import { defineConfig } from 'vitest/config'

/**
 * End-to-end tests only. They build the app and drive a browser, so they are
 * kept out of the default `pnpm test` run and given longer timeouts.
 *
 * Plain Vitest config on purpose: `defineVitestConfig` from
 * `@nuxt/test-utils/config` is for tests running in the Nuxt client
 * environment, and warns when used here.
 */
export default defineConfig({
  test: {
    include: ['tests/e2e/**/*.test.ts'],
    environment: 'node',
    testTimeout: 60_000,
    hookTimeout: 240_000,
  },
})
