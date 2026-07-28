// Rough heuristic layout estimate so a chat can be split into multiple phone
// "screens" instead of scrolling — good enough visually without doing a real
// DOM measurement pass.
const PAGE_CAPACITY_PX = 480
const CHARS_PER_LINE_BUBBLE = 28
const CHARS_PER_LINE_SYSTEM = 40

function countLines(text, charsPerLine) {
  return text
    .split('\n')
    .reduce((total, segment) => total + Math.max(1, Math.ceil(segment.length / charsPerLine)), 0)
}

function estimateMessageHeight(message) {
  if (message.sender === 'system') {
    const lines = countLines(message.text, CHARS_PER_LINE_SYSTEM)
    return 28 + lines * 16
  }
  const lines = countLines(message.text, CHARS_PER_LINE_BUBBLE)
  return 34 + lines * 20
}

/** Greedily packs messages into pages that each fit one phone-screen's worth of height. */
export function paginateMessages(messages, capacity = PAGE_CAPACITY_PX) {
  const pages = []
  let current = []
  let currentHeight = 0

  for (const message of messages) {
    const height = estimateMessageHeight(message)
    if (current.length > 0 && currentHeight + height > capacity) {
      pages.push(current)
      current = []
      currentHeight = 0
    }
    current.push(message)
    currentHeight += height
  }

  if (current.length > 0) pages.push(current)
  if (pages.length === 0) pages.push([])

  return pages
}
