import { newMessage, makeTimeSequence } from './chatUtils'

/** Strips straight/curly quote characters that often wrap pasted dialogue lines. */
function stripQuotes(text) {
  return text
    .replace(/["""'']/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/**
 * Parses a raw pasted script where each line looks like "Label: message text".
 * Blank lines and lines without a "Label:" prefix are skipped.
 * Returns the distinct labels (in order of first appearance) and the parsed lines.
 */
export function parseScript(rawText) {
  const lines = rawText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const labelOrder = []
  const parsedLines = []

  for (const line of lines) {
    const match = line.match(/^([^:]{1,24}):\s*(.+)$/)
    if (!match) continue
    const label = match[1].trim()
    const text = stripQuotes(match[2].trim())
    if (!text) continue

    if (!labelOrder.includes(label)) labelOrder.push(label)
    parsedLines.push({ label, text })
  }

  return { labels: labelOrder, lines: parsedLines }
}

/**
 * Builds a default role map from detected labels: first label -> receiver ("other"),
 * second label -> sender ("me"), any extra labels default to "other".
 */
export function defaultRoleMap(labels) {
  const map = {}
  labels.forEach((label, index) => {
    map[label] = index === 1 ? 'me' : 'other'
  })
  return map
}

/** Converts parsed script lines into chat message objects using a label -> role map. */
export function linesToMessages(lines, roleMap) {
  const times = makeTimeSequence(lines.length)
  return lines.map((line, index) =>
    newMessage({
      sender: roleMap[line.label] || 'other',
      senderName: line.label,
      text: line.text,
      time: times[index],
    }),
  )
}
