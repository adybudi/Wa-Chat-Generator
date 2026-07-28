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

export function newMessage({ sender = 'other', text = '', time } = {}) {
  return {
    id: uid(),
    sender,
    text,
    time: time || formatTime(new Date()),
  }
}
