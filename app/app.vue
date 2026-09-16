<script setup lang="ts">
import { site } from '~/data/site'

const defaultTitle = `${site.name}, ${site.role.toLowerCase()}`

function buildTitle(titleChunk?: string): string {
  return titleChunk ? `${titleChunk} · ${site.name}` : defaultTitle
}

useHead({
  htmlAttrs: { lang: 'en' },
  titleTemplate: buildTitle,
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap',
    },
  ],
  meta: [
    { name: 'description', content: site.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: site.name },
    { property: 'og:title', content: defaultTitle },
    { property: 'og:description', content: site.description },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
