import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { resumeIntro } from '~/data/resume'
import ResumeIntro from './ResumeIntro.vue'

describe('resume intro', () => {
  it('carries the page title as its only heading', async () => {
    const wrapper = await mountSuspended(ResumeIntro)

    expect(wrapper.get('h1').text()).toBe(resumeIntro.title)
    expect(wrapper.get('section').attributes('aria-labelledby')).toBe('resume-intro-title')
  })

  it('shows no download button until a PDF is provided', async () => {
    const wrapper = await mountSuspended(ResumeIntro)

    expect(resumeIntro.pdfUrl).toBeUndefined()
    expect(wrapper.find('.resume-intro-download').exists()).toBe(false)
  })
})
