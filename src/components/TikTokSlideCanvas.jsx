import { forwardRef } from 'react'
import PhoneMockup from './PhoneMockup'

const SLIDE_WIDTH = 400
const SLIDE_HEIGHT = 711 // 9:16 aspect ratio (400 x 711.11)

function CloudWatermark() {
  return (
    <div
      className="absolute bottom-8 right-8 flex items-center justify-center rounded-full p-4"
      style={{
        backgroundColor: '#f3f4f6',
        color: '#9ca3af',
        width: 60,
        height: 60,
      }}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
        <span className="mt-0.5 text-[7px] font-bold tracking-tighter uppercase leading-tight">
          CLOUD STORIES
        </span>
      </div>
    </div>
  )
}

const TikTokSlideCanvas = forwardRef(function TikTokSlideCanvas(
  { type, coverData, synopsisText, messages, contactName, groupName, chatMode },
  ref,
) {
  return (
    <div
      ref={ref}
      className="relative flex shrink-0 flex-col items-center justify-center overflow-hidden border border-gray-200"
      style={{
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        backgroundColor: '#ffffff',
      }}
    >
      {type === 'cover' && (
        <div className="flex w-full flex-col items-center justify-center px-8 text-center">
          {coverData?.image ? (
            <div className="mb-6 flex w-full justify-center">
              <img
                src={coverData.image}
                alt="Cover Thumbnail"
                className="max-h-[260px] w-full rounded-md object-cover border border-gray-200"
              />
            </div>
          ) : (
            <div
              className="mb-6 flex h-[220px] w-full flex-col items-center justify-center rounded-md text-gray-400"
              style={{ backgroundColor: '#f3f4f6', border: '2px dashed #d1d5db' }}
            >
              <svg viewBox="0 0 24 24" className="mb-2 h-10 w-10 fill-current opacity-40">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
              <span className="text-xs font-medium">Belum ada thumbnail</span>
            </div>
          )}

          <h1
            className="mb-2 text-[22px] font-black uppercase tracking-tight"
            style={{ color: '#000000', lineHeight: 1.25 }}
          >
            {coverData?.title || 'JUDUL CERITA'}
          </h1>

          {coverData?.subtitle && (
            <p
              className="text-[16px] font-bold uppercase tracking-normal"
              style={{ color: '#374151' }}
            >
              {coverData.subtitle.startsWith('"') ? coverData.subtitle : `"${coverData.subtitle}"`}
            </p>
          )}
        </div>
      )}

      {type === 'synopsis' && (
        <div className="relative flex h-full w-full flex-col items-center justify-center px-10 text-center">
          <p
            className="whitespace-pre-wrap text-[16px] font-medium leading-relaxed"
            style={{ color: '#1f2937' }}
          >
            {synopsisText || 'Belum ada sinopsis atau narasi pembuka.'}
          </p>

          <CloudWatermark />
        </div>
      )}

      {type === 'chat' && (
        <div className="flex h-full w-full items-center justify-center">
          <PhoneMockup
            contactName={contactName}
            groupName={groupName}
            chatMode={chatMode}
            messages={messages}
          />
        </div>
      )}
    </div>
  )
})

export default TikTokSlideCanvas

