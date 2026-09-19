import { site } from '~/data/site'

/**
 * Site-wide head tags: the title template, the document language, and the
 * description and social tags. Called from both app.vue and error.vue,
 * because Nuxt renders error.vue in place of app.vue, so anything set only
 * in app.vue is missing from error pages.
 */
export function useSiteHead(): void {
  const defaultTitle = `${site.name}, ${site.role.toLowerCase()}`

  function buildTitle(titleChunk?: string): string {
    return titleChunk ? `${titleChunk} · ${site.name}` : defaultTitle
  }

  useHead({
    htmlAttrs: { lang: 'en' },
    titleTemplate: buildTitle,
    meta: [
      { name: 'description', content: site.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: site.name },
      { property: 'og:title', content: defaultTitle },
      { property: 'og:description', content: site.description },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  })
}
