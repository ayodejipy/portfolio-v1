/**
 * WCAG contrast ratio between two hex colours, from 1 to 21. Order of the
 * arguments does not matter. WCAG AA wants at least 4.5 for normal text and
 * 3 for large text.
 */
export function contrastRatio(first: string, second: string): number {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second))
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second))

  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100
}

function relativeLuminance(hex: string): number {
  const [red, green, blue] = channels(hex).map(toLinear)

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function channels(hex: string): number[] {
  const value = hex.replace('#', '')

  return [0, 2, 4].map(index => Number.parseInt(value.slice(index, index + 2), 16) / 255)
}

function toLinear(channel: number): number {
  return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}
