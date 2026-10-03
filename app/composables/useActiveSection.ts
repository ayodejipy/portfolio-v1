/**
 * Reports which of the given section ids is currently under the reading
 * line: a band at 40% of the viewport height, which is where the concept's
 * rail switched from one section to the next.
 *
 * An IntersectionObserver rather than a scroll handler, so nothing runs
 * between crossings. The band is a zero-height strip, so at most one section
 * is inside it at a time; when none is (the footer fills the band at the
 * very bottom), the last one stays active.
 *
 * Deliberately instant: the value changes at the crossing and the rail swaps
 * a class. Easing the indicator between ticks, or driving it continuously
 * from scroll position, is animation work.
 */
export function useActiveSection(ids: string[]) {
  const activeId = ref(ids[0] ?? '')
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    // Absent in some test environments, and the first id is a fair fallback.
    if (typeof IntersectionObserver === 'undefined')
      return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            activeId.value = entry.target.id
        }
      },
      { rootMargin: '-40% 0px -60% 0px' },
    )

    for (const id of ids) {
      const section = document.getElementById(id)
      if (section)
        observer.observe(section)
    }
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  return activeId
}
