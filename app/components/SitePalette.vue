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
        placeholder="Type a command or search"
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
          <span class="site-palette-item-label">{{ command.label }}</span>
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
.site-palette-backdrop {
  position: fixed;
  z-index: 80;
  inset: 0;
  display: flex;
  justify-content: center;
  padding-top: 14vh;
  backdrop-filter: blur(3px);
  background: rgba(20, 18, 15, 0.55);
}

.site-palette {
  width: 560px;
  max-width: 90vw;
  height: fit-content;
  border: 1px solid var(--term-line);
  border-radius: 10px;
  background: var(--term-panel);
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.6);
  color: var(--term-ink);
  font-family: ui-monospace, monospace;
}

.site-palette-input {
  width: 100%;
  padding: var(--space-s) var(--space-m);
  border: none;
  border-bottom: 1px solid var(--term-line);
  background: none;
  color: var(--term-ink);
  font: inherit;
  font-size: var(--step--1);
}

.site-palette-input::placeholder {
  color: var(--term-soft);
}

.site-palette-list {
  max-height: 320px;
  padding: var(--space-3xs);
  overflow-y: auto;
  list-style: none;
}

.site-palette-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2xs) var(--space-xs);
  border-radius: 6px;
  color: var(--term-soft);
  font-size: var(--step--1);
  cursor: pointer;
}

.site-palette-item-label {
  color: var(--term-ink);
}

.site-palette-item.is-selected {
  background: rgba(94, 255, 157, 0.09);
}

.site-palette-item.is-selected .site-palette-item-label,
.site-palette-item.is-selected .site-palette-item-hint {
  color: var(--term-accent);
}

.site-palette-empty {
  padding: var(--space-s) var(--space-m);
  color: var(--term-soft);
  font-size: var(--step--1);
}
</style>
