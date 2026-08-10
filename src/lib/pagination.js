// Hybrid DOM-measured pagination parameters
// Fills phone screens to maximum available height (485px out of 512px max body)
// while guaranteeing zero cut-offs under the footer bar.
const PAGE_CAPACITY_PX = 445
const CHARS_PER_LINE_BUBBLE = 26
const CHARS_PER_LINE_SYSTEM = 38

function countLines(text, charsPerLine) {
  if (!text) return 1
  return text
    .split('\n')
    .reduce((total, segment) => {
      const len = segment.length
      if (len === 0) return total + 1
      return total + Math.ceil(len / charsPerLine)
    }, 0)
}

export function estimateMessageHeight(message) {
  if (message.sender === 'system') {
    const lines = countLines(message.text || '', CHARS_PER_LINE_SYSTEM)
    return 30 + lines * 16
  }

  let height = 40 // Base bubble padding + timestamp row + message gap

  if (message.sender === 'other' && message.senderName) {
    height += 16 // Speaker name header in group chat
  }

  if (message.mediaType === 'image') {
    height += message.mediaUrl ? 150 : 100
    if (message.text) {
      const lines = countLines(message.text, CHARS_PER_LINE_BUBBLE)
      height += lines * 18
    }
  } else if (message.mediaType === 'audio') {
    height += 50
  } else {
    const lines = countLines(message.text || '', CHARS_PER_LINE_BUBBLE)
    height += lines * 18.5
  }

  return height
}

/** Measures exact rendered DOM heights of messages in a hidden offscreen container. */
export function measureMessagesDOM(messages, chatMode = 'personal') {
  if (typeof document === 'undefined' || !messages || messages.length === 0) {
    return {}
  }

  let container = document.getElementById('wa-measure-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'wa-measure-container'
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '-9999px'
    container.style.width = '320px'
    container.style.visibility = 'hidden'
    container.style.pointerEvents = 'none'
    container.style.boxSizing = 'border-box'
    document.body.appendChild(container)
  }

  const isGroup = chatMode === 'group'
  container.innerHTML = `
    <div style="padding-left: 12px; padding-right: 12px; padding-top: 8px; padding-bottom: 8px; font-family: system-ui, -apple-system, sans-serif; box-sizing: border-box;">
      ${messages
        .map((msg, idx) => {
          if (msg.sender === 'system') {
            return `<div id="wa-m-${idx}" style="margin-bottom: 8px; display: flex; justify-content: center; padding-left: 24px; padding-right: 24px; padding-top: 4px; padding-bottom: 4px; box-sizing: border-box;">
              <div style="max-width: 85%; padding-top: 6px; padding-bottom: 6px; padding-left: 12px; padding-right: 12px; font-size: 11px; line-height: 1.375; text-align: center; box-sizing: border-box; word-break: break-word;">${msg.text || ''}</div>
            </div>`
          }
          const isMe = msg.sender === 'me'
          const speaker = !isMe && isGroup && msg.senderName ? `<div style="font-size: 11px; font-weight: 600; margin-bottom: 2px;">${msg.senderName}</div>` : ''
          const media = msg.mediaType === 'image' ? '<div style="height: 140px;"></div>' : msg.mediaType === 'audio' ? '<div style="height: 48px;"></div>' : ''
          return `
            <div id="wa-m-${idx}" style="margin-bottom: 8px; display: flex; justify-content: ${isMe ? 'flex-end' : 'flex-start'}; box-sizing: border-box;">
              <div style="max-width: 80%; padding: 8px 12px 6px 12px; font-size: 14px; box-sizing: border-box; border-radius: 8px;">
                ${speaker}
                ${media}
                <div style="word-break: break-word; white-space: pre-wrap; padding-right: 8px; line-height: 1.5;">${msg.text || ''}</div>
                <div style="font-size: 10.5px; margin-top: 4px; text-align: right;">19:00 ✓✓</div>
              </div>
            </div>
          `
        })
        .join('')}
    </div>
  `

  const heights = {}
  messages.forEach((msg, idx) => {
    const el = document.getElementById(`wa-m-${idx}`)
    if (el) {
      heights[msg.id] = Math.ceil(el.getBoundingClientRect().height) + 8
    }
  })

  return heights
}

/** Greedily packs messages into pages using measured DOM heights or heuristic estimate. */
export function paginateMessages(messages, capacity = PAGE_CAPACITY_PX, measuredHeights = null) {
  const pages = []
  let current = []
  let currentHeight = 0

  for (const message of messages) {
    const height = (measuredHeights && measuredHeights[message.id]) || estimateMessageHeight(message)

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






