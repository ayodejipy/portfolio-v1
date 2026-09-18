<script setup lang="ts">
import { resumeIntro } from '~/data/resume'
</script>

<template>
  <section class="resume-intro" aria-labelledby="resume-intro-title">
    <div class="container">
      <p class="resume-intro-eyebrow">
        {{ resumeIntro.eyebrow }}
      </p>

      <h1 id="resume-intro-title" class="resume-intro-title">
        {{ resumeIntro.title }}
      </h1>

      <p class="resume-intro-text">
        {{ resumeIntro.intro }}
      </p>

      <div v-if="resumeIntro.pdfUrl" class="resume-intro-actions">
        <a class="resume-intro-download" :href="resumeIntro.pdfUrl" download>
          <span aria-hidden="true">↓</span> Download PDF
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/*
  The concept pads the top by 120px to clear its fixed header. Ours sits in
  the flow, so less is needed here.
*/
.resume-intro {
  display: flex;
  min-height: 56vh;
  flex-direction: column;
  justify-content: center;
  padding-top: 60px;
}

.resume-intro-eyebrow {
  margin-bottom: 22px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.resume-intro-title {
  max-width: 16ch;
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 6.4vw, 5rem);
  font-style: italic;
  font-weight: 500;
  line-height: 1.05;
}

.resume-intro-text {
  max-width: 56ch;
  margin-top: 26px;
  color: var(--ink-soft);
  font-size: 1.05rem;
  line-height: 1.65;
}

.resume-intro-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 28px;
  margin-top: 38px;
}

.resume-intro-download {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 22px;
  border-radius: 3px;
  background: var(--ink);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.05em;
  text-decoration: none;
}

.resume-intro-download:hover {
  background: var(--accent);
}
</style>
