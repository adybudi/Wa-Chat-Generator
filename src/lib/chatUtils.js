let counter = 0

export function uid() {
  counter += 1
  return `msg-${Date.now()}-${counter}`
}

export function formatTime(date) {
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

/** Generates a sequence of realistic-looking chat timestamps. */
export function makeTimeSequence(count, { startHour = 19, startMinute = 0 } = {}) {
  const base = new Date()
  base.setHours(startHour, startMinute, 0, 0)
  const times = []
  for (let i = 0; i < count; i += 1) {
    times.push(formatTime(base))
    base.setMinutes(base.getMinutes() + 1 + Math.floor(Math.random() * 3))
  }
  return times
}

const SPEAKER_COLORS = [
  '#075e54',
  '#0284c7',
  '#7c3aed',
  '#d97706',
  '#e11d48',
  '#2563eb',
  '#059669',
  '#c026d3',
]

export function getSpeakerColor(name) {
  if (!name) return SPEAKER_COLORS[0]
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % SPEAKER_COLORS.length
  return SPEAKER_COLORS[index]
}

export function newMessage({ sender = 'other', senderName = '', text = '', time } = {}) {
  return {
    id: uid(),
    sender,
    senderName,
    text,
    time: time || formatTime(new Date()),
  }
}

