import { useEffect, useRef, useState } from 'react'
import { domToPng } from 'modern-screenshot'
import TikTokSlideCanvas from './TikTokSlideCanvas'

export default function TikTokTemplateModal({
  isOpen,
  onClose,
  coverTitle,
  coverSubtitle,
  coverImage,
  synopsisText,
  pages,
  contactName,
}) {
  const [isLoadingPreview, setIsLoadingPreview] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState('')

  const slideRefs = useRef([])

  useEffect(() => {
    if (isOpen) {
      setIsLoadingPreview(true)
      const timer = setTimeout(() => {
        setIsLoadingPreview(false)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  const totalSlides = 2 + (pages?.length || 0)

  const handleDownloadAll = async () => {
    setIsDownloading(true)
    try {
      // 1. Cover slide
      setDownloadProgress('Menyiapkan Slide 1 (Cover)…')
      if (slideRefs.current[0]) {
        const coverPng = await domToPng(slideRefs.current[0], { scale: 2.7 })
        downloadDataUrl(coverPng, 'Slide_1_Cover.png')
        await new Promise((r) => setTimeout(r, 250))
      }

      // 2. Synopsis slide
      setDownloadProgress('Menyiapkan Slide 2 (Sinopsis)…')
      if (slideRefs.current[1]) {
        const synPng = await domToPng(slideRefs.current[1], { scale: 2.7 })
        downloadDataUrl(synPng, 'Slide_2_Sinopsis.png')
        await new Promise((r) => setTimeout(r, 250))
      }

      // 3. Chat slides
      for (let i = 0; i < (pages?.length || 0); i += 1) {
        const refIndex = 2 + i
        setDownloadProgress(`Menyiapkan Slide ${refIndex + 1} (Chat ${i + 1})…`)
        if (slideRefs.current[refIndex]) {
          const chatPng = await domToPng(slideRefs.current[refIndex], { scale: 2.7 })
          downloadDataUrl(chatPng, `Slide_${refIndex + 1}_Chat_${i + 1}.png`)
          if (i < pages.length - 1) await new Promise((r) => setTimeout(r, 250))
        }
      }
    } catch (err) {
      console.error('Failed to export TikTok slides:', err)
    } finally {
      setIsDownloading(false)
      setDownloadProgress('')
    }
  }

  const downloadDataUrl = (dataUrl, filename) => {
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              📱 Preview TikTok Template (9:16 Aspect Ratio)
            </h2>
            <p className="text-xs text-gray-500">
              Total {totalSlides} Slide Siap Upload (Cover, Sinopsis &amp; {pages?.length || 0} Chat Pages)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {isLoadingPreview ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
              <p className="text-sm font-medium text-gray-600">
                Memproses dan menyiapkan preview template TikTok...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {/* Slide 1: Cover */}
              <div className="flex flex-col items-center gap-2">
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                  Slide 1: Cover / Thumbnail
                </span>
                <TikTokSlideCanvas
                  ref={(el) => {
                    slideRefs.current[0] = el
                  }}
                  type="cover"
                  coverData={{
                    title: coverTitle,
                    subtitle: coverSubtitle,
                    image: coverImage,
                  }}
                />
              </div>

              {/* Slide 2: Synopsis */}
              <div className="flex flex-col items-center gap-2">
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                  Slide 2: Narasi / Sinopsis
                </span>
                <TikTokSlideCanvas
                  ref={(el) => {
                    slideRefs.current[1] = el
                  }}
                  type="synopsis"
                  synopsisText={synopsisText}
                />
              </div>

              {/* Slide 3+: Chat pages */}
              {pages?.map((pageMessages, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    Slide {idx + 3}: Chat Halaman {idx + 1}
                  </span>
                  <TikTokSlideCanvas
                    ref={(el) => {
                      slideRefs.current[idx + 2] = el
                    }}
                    type="chat"
                    contactName={contactName}
                    messages={pageMessages}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={handleDownloadAll}
            disabled={isDownloading || isLoadingPreview}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>{downloadProgress || 'Mengunduh Slide…'}</span>
              </>
            ) : (
              <span>⬇ Download Semua {totalSlides} Slide TikTok (.PNG)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
