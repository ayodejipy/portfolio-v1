/**
 * Which of the given elements are in the reading area right now.
 *
 * The sibling of `useActiveSection`, and the difference between them is the
 * band. That one watches a zero-height strip, so exactly one thing is ever
 * inside it: it answers "what are you reading". This one trims a fifth off
 * the top and bottom of the viewport and lets several elements qualify at
 * once: it answers "what is in front of you". A timeline entry that is
 * showing only its last line at the edge of the screen is not in front of
 * you, which is why this is not a plain `isIntersecting`.
 *
 * The set is replaced rather than mutated on every crossing, so a template
 * reading it re-renders. There are a handful of entries; this is cheaper
 * than making the set itself reactive.
 */
export function useInView(ids: string[], rootMargin = '-20% 0px -20% 0px'): Ref<Set<string>> {
  const visible = ref(new Set<string>())
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    // Absent in some test environments, where nothing is in view and the
    // entries simply render in their resting state.
    if (typeof IntersectionObserver === 'undefined') {
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        const next = new Set(visible.value)

        for (const entry of entries) {
          if (entry.isIntersecting) {
            next.add(entry.target.id)
          }
          else {
            next.delete(entry.target.id)
          }
        }

        visible.value = next
      },
      { rootMargin },
    )

    for (const id of ids) {
      const element = document.getElementById(id)

      if (element) {
        observer.observe(element)
      }
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  return visible
}
