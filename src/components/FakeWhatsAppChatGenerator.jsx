import { useMemo, useRef, useState } from 'react'
import { domToPng } from 'modern-screenshot'
import StoryToChatPanel from './StoryToChatPanel'
import ScriptImportPanel from './ScriptImportPanel'
import MessageEditorList from './MessageEditorList'
import PhoneMockup from './PhoneMockup'
import TikTokTemplateConfig from './TikTokTemplateConfig'
import TikTokTemplateModal from './TikTokTemplateModal'
import AdvancedSettingsPanel from './AdvancedSettingsPanel'
import VideoExportModal from './VideoExportModal'
import { generateChatFromStory } from '../lib/aiGenerator'
import { newMessage, makeTimeSequence } from '../lib/chatUtils'
import { paginateMessages, measureMessagesDOM } from '../lib/pagination'

export default function FakeWhatsAppChatGenerator() {
  const [contactName, setContactName] = useState('')
  const [groupName, setGroupName] = useState('Grup Percakapan')
  const [chatMode, setChatMode] = useState('personal') // 'personal' | 'group'
  const [messages, setMessages] = useState([])

  const [storyPrompt, setStoryPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState('')

  const [isDownloading, setIsDownloading] = useState(false)

  // Points 1-4 Feature Checkbox Toggles
  const [enableDarkMode, setEnableDarkMode] = useState(false)
  const [enableMediaMessages, setEnableMediaMessages] = useState(false)
  const [enableCustomTicks, setEnableCustomTicks] = useState(false)
  const [enableCustomStatusBar, setEnableCustomStatusBar] = useState(false)

  // Feature specific states
  const [headerStatusText, setHeaderStatusText] = useState('')
  const [statusBarTime, setStatusBarTime] = useState('10:04')
  const [batteryLevel, setBatteryLevel] = useState('100')

  // TikTok Template State
  const [coverTitle, setCoverTitle] = useState('TAMAN WISATA BERHANTU')
  const [coverSubtitle, setCoverSubtitle] = useState('EPISODE ENAM')
  const [coverImage, setCoverImage] = useState(null)
  const [synopsisText, setSynopsisText] = useState(
    'Wahana terakhir adalah Bianglala Raksasa yang menjulang tinggi menembus kabut. Mereka harus mencapai kabin tertinggi untuk mengambil kunci gerbang utama yang tergantung di poros paling atas. Angin kencang dan besi yang keropos menjadi rintangan fisik terbesar mereka.',
  )
  const [isTikTokModalOpen, setIsTikTokModalOpen] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  const pages = useMemo(() => {
    const measured = measureMessagesDOM(messages, chatMode)
    return paginateMessages(messages, 485, measured)
  }, [messages, chatMode])
  const pageRefs = useRef({})

  const handleGenerateFromStory = async () => {
    setIsGenerating(true)
    setGenerateError('')
    try {
      const { lines } = await generateChatFromStory(storyPrompt)
      const times = makeTimeSequence(lines.length)
      // First detected label -> receiver ("other"), second -> sender ("me").
      const labelOrder = [...new Set(lines.map((l) => l.label))]
      if (labelOrder.length > 2) {
        setChatMode('group')
      }
      const generated = lines.map((line, index) =>
        newMessage({
          sender: labelOrder.indexOf(line.label) === 1 ? 'me' : 'other',
          senderName: line.label,
          text: line.text,
          time: times[index],
        }),
      )
      setMessages(generated)
    } catch (err) {
      setGenerateError(err.message || 'Gagal generate chat')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleScriptConvert = (newMessages) => {
    const distinctSpeakers = [...new Set(newMessages.map((m) => m.senderName).filter(Boolean))]
    if (distinctSpeakers.length > 2) {
      setChatMode('group')
    }
    setMessages(newMessages)
  }

  const updateMessageText = (id, text) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text } : m)))
  }

  const updateMessageSenderName = (id, senderName) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, senderName } : m)))
  }

  const updateMessageField = (id, field, value) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const updateMessageTime = (id, time) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, time } : m)))
  }

  const changeSender = (id, sender) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, sender } : m)))
  }

  const deleteMessage = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  const addMessage = () => {
    setMessages((prev) => [...prev, newMessage({ sender: 'other', senderName: 'Teman', text: 'Pesan baru' })])
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      for (let i = 0; i < pages.length; i += 1) {
        const node = pageRefs.current[i]
        if (!node) continue
        const dataUrl = await domToPng(node, {
          scale: 2,
        })
        const link = document.createElement('a')
        link.download = `Scene ${i + 1}.png`
        link.href = dataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        // Small gap so browsers don't treat rapid multi-file downloads as spam.
        if (i < pages.length - 1) await new Promise((r) => setTimeout(r, 250))
      }
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-800">
          🤖 AI Fake WhatsApp Chat Generator
        </h1>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 lg:grid-cols-[420px_1fr]">
        {/* Left column: controls */}
        <div className="space-y-4">
          {/* Mode Switcher */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
              Tipe Percakapan
            </label>

            <div className="mb-4 grid grid-cols-2 gap-1.5 rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                type="button"
                onClick={() => setChatMode('personal')}
                className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition ${
                  chatMode === 'personal'
                    ? 'bg-white text-[#075e54] shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <span>💬 Personal (1-on-1)</span>
              </button>
              <button
                type="button"
                onClick={() => setChatMode('group')}
                className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition ${
                  chatMode === 'group'
                    ? 'bg-[#075e54] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <span>👥 Grup WhatsApp</span>
              </button>
            </div>

            {chatMode === 'personal' ? (
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  Nama Kontak (Penerima)
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Anna"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-[#128c7e] focus:outline-none focus:ring-1 focus:ring-[#128c7e]"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Nama Grup WA
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Grup Percakapan"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-[#128c7e] focus:outline-none focus:ring-1 focus:ring-[#128c7e]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-700">
                    Nama Anggota Utama
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Anna"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-[#128c7e] focus:outline-none focus:ring-1 focus:ring-[#128c7e]"
                  />
                </div>
              </div>
            )}
          </div>

          <AdvancedSettingsPanel
            enableDarkMode={enableDarkMode}
            setEnableDarkMode={setEnableDarkMode}
            enableMediaMessages={enableMediaMessages}
            setEnableMediaMessages={setEnableMediaMessages}
            enableCustomTicks={enableCustomTicks}
            setEnableCustomTicks={setEnableCustomTicks}
            enableCustomStatusBar={enableCustomStatusBar}
            setEnableCustomStatusBar={setEnableCustomStatusBar}
            headerStatusText={headerStatusText}
            setHeaderStatusText={setHeaderStatusText}
            statusBarTime={statusBarTime}
            setStatusBarTime={setStatusBarTime}
            batteryLevel={batteryLevel}
            setBatteryLevel={setBatteryLevel}
          />

          <TikTokTemplateConfig
            coverTitle={coverTitle}
            setCoverTitle={setCoverTitle}
            coverSubtitle={coverSubtitle}
            setCoverSubtitle={setCoverSubtitle}
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            synopsisText={synopsisText}
            setSynopsisText={setSynopsisText}
          />

          <StoryToChatPanel
            storyPrompt={storyPrompt}
            onStoryPromptChange={setStoryPrompt}
            onGenerate={handleGenerateFromStory}
            isGenerating={isGenerating}
            error={generateError}
          />

          <ScriptImportPanel onConvert={handleScriptConvert} />

          <MessageEditorList
            messages={messages}
            onUpdateText={updateMessageText}
            onUpdateSenderName={updateMessageSenderName}
            onUpdateMessageField={updateMessageField}
            onUpdateTime={updateMessageTime}
            onChangeSender={changeSender}
            onDelete={deleteMessage}
            onAdd={addMessage}
            enableMediaMessages={enableMediaMessages}
            enableCustomTicks={enableCustomTicks}
          />
        </div>

        {/* Right column: live preview */}
        <div className="flex flex-col items-center gap-8">
          {pages.map((pageMessages, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              {pages.length > 1 && (
                <span className="text-xs font-medium text-gray-400">
                  Halaman {index + 1} dari {pages.length}
                </span>
              )}
              <PhoneMockup
                ref={(el) => {
                  pageRefs.current[index] = el
                }}
                contactName={contactName}
                groupName={groupName}
                chatMode={chatMode}
                messages={pageMessages}
                enableDarkMode={enableDarkMode}
                enableCustomTicks={enableCustomTicks}
                enableCustomStatusBar={enableCustomStatusBar}
                headerStatusText={headerStatusText}
                statusBarTime={statusBarTime}
                batteryLevel={batteryLevel}
              />
            </div>
          ))}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || messages.length === 0}
              className="rounded-lg bg-[#128c7e] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#0f7669] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDownloading
                ? 'Menyiapkan gambar…'
                : pages.length > 1
                  ? `⬇ Download ${pages.length} Halaman`
                  : '⬇ Download Chat Image'}
            </button>

            <button
              type="button"
              onClick={() => setIsTikTokModalOpen(true)}
              className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:from-purple-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ✨ Generate Template
            </button>

            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              disabled={messages.length === 0}
              className="rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition hover:from-pink-700 hover:to-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              🎬 Export Video Chat
            </button>
          </div>
        </div>
      </main>

      <TikTokTemplateModal
        isOpen={isTikTokModalOpen}
        onClose={() => setIsTikTokModalOpen(false)}
        coverTitle={coverTitle}
        coverSubtitle={coverSubtitle}
        coverImage={coverImage}
        synopsisText={synopsisText}
        pages={pages}
        contactName={contactName}
        groupName={groupName}
        chatMode={chatMode}
        enableDarkMode={enableDarkMode}
        enableCustomTicks={enableCustomTicks}
        enableCustomStatusBar={enableCustomStatusBar}
        headerStatusText={headerStatusText}
        statusBarTime={statusBarTime}
        batteryLevel={batteryLevel}
      />

      <VideoExportModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        messages={messages}
        contactName={contactName}
        groupName={groupName}
        chatMode={chatMode}
        enableDarkMode={enableDarkMode}
        enableCustomTicks={enableCustomTicks}
        enableCustomStatusBar={enableCustomStatusBar}
        headerStatusText={headerStatusText}
        statusBarTime={statusBarTime}
        batteryLevel={batteryLevel}
      />
    </div>
  )
}



