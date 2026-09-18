<script setup lang="ts">
import type { PaletteCommand } from '~/data/commands'
import { paletteCommands } from '~/data/commands'

const ui = useUiStore()
const panel = ref<HTMLElement | null>(null)
const query = ref('')
const selectedIndex = ref(0)
const isOpen = computed(() => ui.paletteOpen)

/**
 * Strips accents so a query typed without them still matches, for example
 * "resume" against "Résumé".
 */
function forMatching(value: string): string {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

const matches = computed<PaletteCommand[]>(() => {
  const term = forMatching(query.value.trim())

  if (!term) {
    return paletteCommands
  }

  return paletteCommands.filter(command =>
    forMatching(`${command.hint} ${command.label}`).includes(term),
  )
})

const selected = computed(() => matches.value[selectedIndex.value])

useFocusTrap(panel, isOpen)

function optionId(command: PaletteCommand): string {
  return `site-palette-option-${command.id.replace(/[^a-z0-9]+/gi, '-')}`
}

function move(step: number): void {
  const count = matches.value.length

  if (count === 0) {
    return
  }

  selectedIndex.value = (selectedIndex.value + step + count) % count
}

async function activate(command?: PaletteCommand): Promise<void> {
  ui.closePalette()

  if (command?.to) {
    await navigateTo(command.to)
    return
  }

  if (command?.href) {
    await navigateTo(command.href, { external: true })
  }
}

function onKeydown(event: KeyboardEvent): void {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()

    if (ui.paletteOpen) {
      ui.closePalette()
    }
    else {
      ui.openPalette()
    }

    return
  }

  if (!ui.paletteOpen) {
    return
  }

  if (event.key === 'Escape') {
    ui.closePalette()
  }
  else if (event.key === 'ArrowDown') {
    event.preventDefault()
    move(1)
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    move(-1)
  }
  else if (event.key === 'Enter') {
    event.preventDefault()
    void activate(selected.value)
  }
}

watch(isOpen, (open) => {
  if (!open) {
    query.value = ''
    selectedIndex.value = 0
  }
})

watch(query, () => {
  selectedIndex.value = 0
})

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    v-show="ui.paletteOpen"
    class="site-palette-backdrop"
    @click.self="ui.closePalette()"
  >
    <div
      id="site-palette"
      ref="panel"
      class="site-palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <input
        v-model="query"
        class="site-palette-input"
        type="text"
        role="combobox"
        aria-expanded="true"
        aria-controls="site-palette-list"
        :aria-activedescendant="selected ? optionId(selected) : undefined"
        placeholder="Type a command or search…"
        autocomplete="off"
      >

      <ul
        id="site-palette-list"
        class="site-palette-list"
        role="listbox"
        aria-label="Commands"
      >
        <li
          v-for="(command, position) in matches"
          :id="optionId(command)"
          :key="command.id"
          class="site-palette-item"
          :class="{ 'is-selected': position === selectedIndex }"
          role="option"
          :aria-selected="position === selectedIndex"
          @mouseenter="selectedIndex = position"
          @click="activate(command)"
        >
          <span class="site-palette-item-text">
            <span class="site-palette-item-arrow" aria-hidden="true">→</span>
            <span class="site-palette-item-label">{{ command.label }}</span>
          </span>
          <span class="site-palette-item-hint">{{ command.hint }}</span>
        </li>
      </ul>

      <p v-if="matches.length === 0" class="site-palette-empty">
        No matches
      </p>
    </div>
  </div>
</template>

<style scoped>
/*
  Measurements come from the concept's palette; the colours are the site's
  own editorial skin rather than the concept's dark terminal one.

  Two deliberate differences from the concept: the light skin, and the focus
  indicator. The concept removes the ring with outline:none, but the input
  takes focus every time the palette opens, so a permanent ring fights the
  design. The divider under the input carries the accent instead.
*/
.site-palette-backdrop {
  position: fixed;
  z-index: 80;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 14vh;
  backdrop-filter: blur(3px);
  background: rgba(28, 26, 23, 0.4);
}

.site-palette {
  width: 560px;
  max-width: 90vw;
  height: fit-content;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--bg);
  box-shadow: 0 30px 80px -20px rgba(28, 26, 23, 0.45);
  color: var(--ink);
  font-family: var(--font-mono);
}

.site-palette-input {
  width: 100%;
  padding: 18px 20px;
  border: none;
  border-bottom: 1px solid var(--line);
  background: none;
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 14px;
}

.site-palette-input:focus-visible {
  outline: none;
  border-bottom-color: var(--accent);
}

.site-palette-input::placeholder {
  color: var(--ink-soft);
}

.site-palette-list {
  max-height: 320px;
  padding: 8px;
  overflow-y: auto;
  list-style: none;
}

.site-palette-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 12px;
  border-radius: 6px;
  color: var(--ink-soft);
  font-size: 13px;
  cursor: pointer;
}

.site-palette-item-text {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
}

.site-palette-item-arrow,
.site-palette-item-label {
  color: var(--ink);
}

.site-palette-item-hint {
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.site-palette-item.is-selected {
  background: rgba(168, 50, 31, 0.08);
}

.site-palette-item.is-selected .site-palette-item-arrow,
.site-palette-item.is-selected .site-palette-item-label,
.site-palette-item.is-selected .site-palette-item-hint {
  color: var(--accent);
}

.site-palette-empty {
  padding: 11px 20px;
  color: var(--ink-soft);
  font-size: 13px;
}
</style>
