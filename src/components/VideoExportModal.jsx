import { useEffect, useRef, useState } from 'react'
import { domToPng } from 'modern-screenshot'
import PhoneMockup from './PhoneMockup'
import { paginateMessages, measureMessagesDOM } from '../lib/pagination'

function getSupportedMimeType() {
  if (typeof MediaRecorder === 'undefined') return 'video/webm'
  const types = [
    'video/mp4',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/webm;codecs=vp9',
  ]
  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t)) {
      return t
    }
  }
  return 'video/webm'
}

export default function VideoExportModal({
  isOpen,
  onClose,
  messages,
  contactName,
  groupName,
  chatMode,
  enableDarkMode,
  enableCustomTicks,
  enableCustomStatusBar,
  headerStatusText,
  statusBarTime,
  batteryLevel,
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingStatus, setRecordingStatus] = useState('')
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null)
  const [exportMimeType, setExportMimeType] = useState('video/webm')
  const [typingSpeed, setTypingSpeed] = useState('1') // '1' | '1.5' | '2'

  // Current screen animated messages
  const [displayedMessages, setDisplayedMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)

  const mockupRef = useRef(null)
  const canvasRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])

  useEffect(() => {
    if (isOpen) {
      setRecordedVideoUrl(null)
      setIsRecording(false)
      setDisplayedMessages(messages?.slice(0, 6) || [])
      setIsTyping(false)
    }
  }, [isOpen, messages])

  if (!isOpen) return null

  const handleStartRecording = async () => {
    if (!messages || messages.length === 0) return

    setIsRecording(true)
    setRecordedVideoUrl(null)
    recordedChunksRef.current = []

    const speedMultiplier = parseFloat(typingSpeed) || 1
    const typingDuration = Math.round(800 / speedMultiplier)
    const readDuration = Math.round(1400 / speedMultiplier)

    // 1. Determine MimeType
    const mimeType = getSupportedMimeType()
    setExportMimeType(mimeType)

    // 2. Setup Canvas
    const canvas = canvasRef.current || document.createElement('canvas')
    canvas.width = 320 * 2
    canvas.height = 660 * 2
    const ctx = canvas.getContext('2d')

    // 3. Setup MediaRecorder
    const stream = canvas.captureStream(30) // 30 FPS
    const mediaRecorder = new MediaRecorder(stream, { mimeType })
    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      // Clean mimeType string for Blob
      const cleanType = mimeType.includes('mp4') ? 'video/mp4' : 'video/webm'
      const blob = new Blob(recordedChunksRef.current, { type: cleanType })
      const url = URL.createObjectURL(blob)
      setRecordedVideoUrl(url)
      setIsRecording(false)
      setRecordingStatus('')
    }

    mediaRecorder.start()

    // Helper to capture mockup frame onto canvas
    const drawFrameToCanvas = async () => {
      if (!mockupRef.current) return
      try {
        const dataUrl = await domToPng(mockupRef.current, { scale: 2 })
        const img = new Image()
        img.src = dataUrl
        await new Promise((resolve) => {
          img.onload = resolve
        })
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      } catch (e) {
        console.error('Frame capture error:', e)
      }
    }

    // Paginate messages using exact DOM measured heights to automatically clear screen when full
    const measured = measureMessagesDOM(messages, chatMode)
    const pages = paginateMessages(messages, 485, measured)

    try {
      setRecordingStatus('Menyiapkan perekaman video…')
      setDisplayedMessages([])
      setIsTyping(false)
      await new Promise((r) => setTimeout(r, 300))
      await drawFrameToCanvas()

      // Loop page by page
      for (let p = 0; p < pages.length; p += 1) {
        const pageMessages = pages[p]

        // Clear screen for a new page
        setDisplayedMessages([])
        await drawFrameToCanvas()
        await new Promise((r) => setTimeout(r, 200))

        for (let i = 0; i < pageMessages.length; i += 1) {
          const currentMsg = pageMessages[i]

          // Step A: Typing indicator
          setIsTyping(true)
          setRecordingStatus(
            `Halaman ${p + 1}/${pages.length} - Mengetik pesan ${i + 1}/${pageMessages.length}…`,
          )
          await drawFrameToCanvas()
          await new Promise((r) => setTimeout(r, typingDuration))

          // Step B: Reveal message on screen
          setIsTyping(false)
          setDisplayedMessages((prev) => [...prev, currentMsg])
          await drawFrameToCanvas()
          await new Promise((r) => setTimeout(r, readDuration))
        }

        // Pause at end of completed page before clearing
        if (p < pages.length - 1) {
          setRecordingStatus(`Halaman ${p + 1} selesai. Menyiapkan Halaman ${p + 2}…`)
          await new Promise((r) => setTimeout(r, 1200))
        }
      }

      // Final pause on last frame
      setRecordingStatus('Menyelesaikan video…')
      await drawFrameToCanvas()
      await new Promise((r) => setTimeout(r, 1500))
    } finally {
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop()
      }
    }
  }

  const handleDownloadVideo = () => {
    if (!recordedVideoUrl) return
    const isMp4 = exportMimeType.includes('mp4')
    const ext = isMp4 ? 'mp4' : 'webm'
    const fileName = `Chat_Animation_Video.${ext}`

    const link = document.createElement('a')
    link.href = recordedVideoUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const currentHeaderStatus = isTyping
    ? 'mengetik...'
    : enableCustomTicks && headerStatusText
      ? headerStatusText
      : ''

  const isMp4Format = exportMimeType.includes('mp4')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              🎬 Export Video Chat (Typing Effect)
            </h2>
            <p className="text-xs text-gray-500">
              Rekam percakapan animasi dengan efek mengetik &amp; pembersihan layar otomatis saat penuh
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isRecording}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col items-center overflow-y-auto bg-gray-100 p-6 md:flex-row md:items-start md:justify-center md:gap-8">
          {/* Mockup Preview Area */}
          <div className="flex flex-col items-center gap-3">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
              {isRecording ? recordingStatus : 'Preview Animasi Chat'}
            </span>

            <PhoneMockup
              ref={mockupRef}
              contactName={contactName}
              groupName={groupName}
              chatMode={chatMode}
              messages={displayedMessages}
              enableDarkMode={enableDarkMode}
              enableCustomTicks={enableCustomTicks || isTyping}
              enableCustomStatusBar={enableCustomStatusBar}
              headerStatusText={currentHeaderStatus}
              statusBarTime={statusBarTime}
              batteryLevel={batteryLevel}
            />

            {/* Hidden canvas for stream capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Controls & Download Section */}
          <div className="mt-6 flex w-full max-w-sm flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:mt-0">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
              ⚙️ Pengaturan Animasi Video
            </h3>

            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Kecepatan Animasi Ketik:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTypingSpeed('1')}
                  disabled={isRecording}
                  className={`rounded-lg border py-1.5 text-xs font-medium transition ${
                    typingSpeed === '1'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Normal (1x)
                </button>
                <button
                  type="button"
                  onClick={() => setTypingSpeed('1.5')}
                  disabled={isRecording}
                  className={`rounded-lg border py-1.5 text-xs font-medium transition ${
                    typingSpeed === '1.5'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cepat (1.5x)
                </button>
                <button
                  type="button"
                  onClick={() => setTypingSpeed('2')}
                  disabled={isRecording}
                  className={`rounded-lg border py-1.5 text-xs font-medium transition ${
                    typingSpeed === '2'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 font-bold'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Kilat (2x)
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-purple-50 p-3 text-xs text-purple-800 space-y-1">
              <p className="font-semibold">💡 Fitur Otomatis:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                <li>Jika layar chat sudah penuh, isi chat otomatis di-reset dan lanjut mengetik di layar bersih baru.</li>
                <li>Preview video dapat diputar langsung di bawah setelah merekam.</li>
              </ul>
            </div>

            {!recordedVideoUrl ? (
              <button
                type="button"
                onClick={handleStartRecording}
                disabled={isRecording || !messages || messages.length === 0}
                className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-md transition hover:from-purple-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRecording ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Merekam Video…</span>
                  </>
                ) : (
                  <span>🎬 Mulai Rekam Video Chat</span>
                )}
              </button>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="overflow-hidden rounded-lg border border-gray-300 bg-black">
                  <video
                    key={recordedVideoUrl}
                    src={recordedVideoUrl}
                    controls
                    autoPlay
                    playsInline
                    muted
                    loop
                    className="max-h-56 w-full object-contain"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleDownloadVideo}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-green-700"
                >
                  ⬇ Download Video Chat ({isMp4Format ? '.mp4' : '.webm'})
                </button>

                <button
                  type="button"
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  className="w-full rounded-lg border border-gray-300 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  🔄 Rekam Ulang Video
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-gray-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isRecording}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

