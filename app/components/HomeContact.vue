<script setup lang="ts">
import { contact } from '~/data/contact'
import { site } from '~/data/site'
</script>

<template>
  <section id="contact" class="home-contact" aria-labelledby="home-contact-heading">
    <div class="container">
      <BaseSectionHeading index="03" title="Contact" heading-id="home-contact-heading" />

      <div class="home-contact-box">
        <p class="home-contact-headline">
          {{ contact.headline }}
        </p>

        <p class="home-contact-note">
          {{ contact.note }}
        </p>

        <a class="home-contact-email" :href="`mailto:${site.email}`">
          {{ site.email }}
        </a>

        <ul class="home-contact-socials">
          <li v-for="social in site.socials" :key="social.label">
            <a class="home-contact-social" :href="social.href" rel="me noopener">
              {{ social.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
  The concept's closing panel: a bordered box with two surveyor's marks at
  opposite corners. The marks are drawn on pseudo-elements, so they stay out
  of the accessibility tree.

  The big line is a paragraph, not a heading: `BaseSectionHeading` already
  gives the section its `h2`, and a second one here would say the same thing
  twice in a screen reader's heading list.
*/
.home-contact {
  padding-bottom: clamp(60px, 12vw, 140px);
}

.home-contact-box {
  position: relative;
  padding: clamp(40px, 8vw, 64px) clamp(20px, 5vw, 40px);
  border: 1px solid var(--line);
  text-align: center;
}

.home-contact-box::before,
.home-contact-box::after {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid var(--accent);
  content: '';
}

.home-contact-box::before {
  top: -1px;
  left: -1px;
  border-right: none;
  border-bottom: none;
}

.home-contact-box::after {
  right: -1px;
  bottom: -1px;
  border-top: none;
  border-left: none;
}

.home-contact-headline {
  max-width: 18ch;
  margin-inline: auto;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 5vw, 3.2rem);
  font-style: italic;
  line-height: 1.05;
}

.home-contact-note {
  max-width: 44ch;
  margin-inline: auto;
  margin-top: 20px;
  color: var(--ink-soft);
  font-size: var(--step--1);
}

.home-contact-email {
  display: inline-block;
  padding-bottom: 2px;
  border-bottom: 1px solid var(--accent);
  margin-top: 26px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 14px;
  text-decoration: none;
}

.home-contact-socials {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
  margin-top: 40px;
  gap: 26px;
  list-style: none;
}

.home-contact-social {
  color: var(--ink-soft);
  font-family: var(--font-mono);
  font-size: 12px;
  text-decoration: none;
  text-transform: uppercase;
}

.home-contact-social:hover {
  color: var(--ink);
}
</style>
