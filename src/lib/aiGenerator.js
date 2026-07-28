/**
 * Story -> chat generation.
 *
 * If VITE_AI_CHAT_ENDPOINT is configured, the prompt is POSTed to that backend
 * (your own server should call the actual LLM there — never call a provider API
 * with a secret key directly from the browser). The endpoint is expected to
 * respond with JSON: { lines: [{ label: "A", text: "..." }, ...] }
 *
 * Example backend call you'd make server-side with the Anthropic SDK:
 *
 *   const res = await anthropic.messages.create({
 *     model: 'claude-sonnet-5',
 *     max_tokens: 500,
 *     messages: [{
 *       role: 'user',
 *       content: `Turn this into a short WhatsApp-style dialogue between A and B,
 *         one "Label: message" per line, 6-10 lines:\n\n${prompt}`,
 *     }],
 *   })
 *
 * Without an endpoint configured, a local template-based generator is used
 * instead so the feature still works out of the box.
 */

const API_ENDPOINT = import.meta.env.VITE_AI_CHAT_ENDPOINT

const SCENARIOS = [
  {
    keywords: ['makan', 'kuliner', 'resto', 'restoran', 'laper', 'lapar'],
    build: (topic) => [
      ['A', `Eh laper nih, ${topic}`],
      ['B', 'Sama! Mau makan di mana enaknya?'],
      ['A', 'Terserah kamu deh, aku ga ada ide'],
      ['B', 'Gimana kalau yang deket sini aja?'],
      ['A', 'Boleh, jam berapa kira-kira?'],
      ['B', 'Jam 7 gimana? Aku jemput ya'],
      ['A', 'Sip, ditunggu!'],
    ],
  },
  {
    keywords: ['debat', 'berantem', 'ribut', 'marah', 'kesel', 'ngambek'],
    build: (topic) => [
      ['A', `Kok kamu diem aja sih soal ${topic}?`],
      ['B', 'Bukan diem, lagi mikir jawabnya gimana'],
      ['A', 'Ya udah, aku tunggu'],
      ['B', 'Maaf ya kalau kemarin aku salah'],
      ['A', 'Gapapa kok, aku juga kelewat emosi'],
      ['B', 'Kita omongin baik-baik nanti ya'],
      ['A', 'Oke, makasih udah ngerti'],
    ],
  },
  {
    keywords: ['jalan', 'liburan', 'nonton', 'main', 'hangout', 'kumpul'],
    build: (topic) => [
      ['A', `Weekend ini jadi ${topic} kan?`],
      ['B', 'Jadi dong, udah gak sabar'],
      ['A', 'Kita berangkat jam berapa?'],
      ['B', 'Pagi aja biar gak kesiangan'],
      ['A', 'Oke siap, jangan telat ya!'],
      ['B', 'Santai, aku pasti on time kok'],
    ],
  },
  {
    keywords: ['kerja', 'tugas', 'kerjaan', 'deadline', 'kantor', 'kuliah'],
    build: (topic) => [
      ['A', `Udah kelar belum ${topic}-nya?`],
      ['B', 'Belum, masih setengah jalan nih'],
      ['A', 'Butuh bantuan gak?'],
      ['B', 'Boleh banget, makasih ya'],
      ['A', 'Santai, kita kerjain bareng'],
      ['B', 'Oke, nanti malam aku kabarin progressnya'],
    ],
  },
  {
    keywords: ['kangen', 'rindu', 'sayang'],
    build: (topic) => [
      ['A', `Aku kangen banget deh, ${topic}`],
      ['B', 'Aku juga kangen kamu'],
      ['A', 'Kapan nih kita ketemu lagi?'],
      ['B', 'Minggu depan gimana? Aku free'],
      ['A', 'Yes, aku tungguin ya'],
      ['B', 'Pasti dateng kok, janji'],
    ],
  },
]

const FALLBACK = (topic) => [
  ['A', `Btw soal ${topic}, gimana menurut kamu?`],
  ['B', 'Menurutku sih oke-oke aja, kenapa?'],
  ['A', 'Cuma mikir apa ini keputusan yang tepat'],
  ['B', 'Santai aja, kita jalanin dulu'],
  ['A', 'Oke deh, aku percaya sama kamu'],
  ['B', 'Tenang, semua bakal baik-baik aja'],
]

function localGenerate(prompt) {
  const lower = prompt.toLowerCase()
  const scenario = SCENARIOS.find((s) => s.keywords.some((k) => lower.includes(k)))
  const topic = prompt.trim().replace(/\.$/, '') || 'ini'
  const lines = (scenario ? scenario.build(topic) : FALLBACK(topic)).map(
    ([label, text]) => ({ label, text }),
  )
  return { labels: ['A', 'B'], lines }
}

export async function generateChatFromStory(prompt) {
  if (!prompt || !prompt.trim()) {
    throw new Error('Story prompt tidak boleh kosong')
  }

  if (API_ENDPOINT) {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
    if (!res.ok) throw new Error('Gagal generate chat dari AI endpoint')
    const data = await res.json()
    const labels = [...new Set(data.lines.map((l) => l.label))]
    return { labels, lines: data.lines }
  }

  // Simulate network latency so the loading state is visible/testable.
  await new Promise((resolve) => setTimeout(resolve, 500))
  return localGenerate(prompt)
}
