import { forwardRef } from 'react'
import { getSpeakerColor } from '../lib/chatUtils'

const WALLPAPER_STYLE = {
  backgroundColor: '#e5ddd5',
  backgroundImage:
    'repeating-linear-gradient(45deg, rgba(0,0,0,0.025) 0px, rgba(0,0,0,0.025) 1px, transparent 1px, transparent 14px), ' +
    'repeating-linear-gradient(-45deg, rgba(0,0,0,0.025) 0px, rgba(0,0,0,0.025) 1px, transparent 1px, transparent 14px)',
}

// Plain hex/rgba only below — Tailwind v4's default palette (gray-*, shadow-sm,
// bg-white/NN, etc.) compiles to oklch()/color-mix(), which html2canvas-pro
// renders inconsistently (misaligned boxes/shadows in the exported PNG even
// though the live DOM looks correct).
const SHADOW_SM = '0 1px 2px 0 rgba(0,0,0,0.05)'
const GRAY_300 = '#d1d5db'
const GRAY_400 = '#9ca3af'
const GRAY_500 = '#6b7280'
const GRAY_700 = '#374151'
const GRAY_800 = '#1f2937'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="M22 8l-6 4 6 4V8z" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  )
}

function GroupIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 19v3" />
    </svg>
  )
}

function SignalIcon() {
  return (
    <svg viewBox="0 0 18 12" className="h-3 w-4" fill="currentColor">
      <rect x="0" y="7" width="3" height="5" rx="0.5" />
      <rect x="5" y="4" width="3" height="8" rx="0.5" />
      <rect x="10" y="2" width="3" height="10" rx="0.5" />
      <rect x="15" y="0" width="3" height="12" rx="0.5" />
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg viewBox="0 0 24 12" className="h-3 w-5" fill="none">
      <rect x="0.5" y="0.5" width="19" height="11" rx="2.5" stroke="currentColor" />
      <rect x="2" y="2" width="14" height="8" rx="1.2" fill="currentColor" />
      <rect x="20.5" y="4" width="2" height="4" rx="1" fill="currentColor" />
    </svg>
  )
}

function Bubble({ message, chatMode }) {
  if (message.sender === 'system') {
    return (
      <div className="flex justify-center px-6 py-1">
        <div
          className="max-w-[85%] rounded-lg px-3 py-1.5 text-center text-[11px] leading-snug"
          style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: GRAY_500, boxShadow: SHADOW_SM }}
        >
          {message.text}
        </div>
      </div>
    )
  }

  const isMe = message.sender === 'me'
  const isGroup = chatMode === 'group'
  const speakerName = message.senderName || 'Contact'
  const speakerColor = getSpeakerColor(speakerName)

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-[80%] rounded-lg px-3 pt-2 pb-1.5 text-[14px] ${
          isMe ? 'rounded-tr-none bg-[#dcf8c6]' : 'rounded-tl-none bg-white'
        }`}
        style={{ color: GRAY_800, boxShadow: SHADOW_SM }}
      >
        {!isMe && isGroup && speakerName && (
          <span
            className="mb-0.5 block text-[11px] font-semibold leading-tight"
            style={{ color: speakerColor }}
          >
            {speakerName}
          </span>
        )}
        <p className="whitespace-pre-wrap break-words pr-2">{message.text}</p>
        <div className="mt-1 flex items-center justify-end gap-1">
          <span className="text-[10.5px] leading-none" style={{ color: GRAY_500 }}>
            {message.time}
          </span>
          {isMe && (
            <span className="text-[12px] leading-none text-[#53bdeb]">✓✓</span>
          )}
        </div>
      </div>
    </div>
  )
}

const PhoneMockup = forwardRef(function PhoneMockup(
  { contactName, groupName, chatMode = 'personal', messages },
  ref,
) {
  const isGroup = chatMode === 'group'
  const title = isGroup ? (groupName || 'Grup Percakapan') : (contactName || 'Contact')

  return (
    <div
      ref={ref}
      className="mx-auto flex w-[320px] flex-col overflow-hidden rounded-xl border border-gray-300/50"
      style={{ ...WALLPAPER_STYLE, height: 660 }}
    >
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 pt-2 pb-1 text-[13px] font-semibold"
        style={{ color: GRAY_800 }}
      >
        <span>10:04</span>
        <div className="flex items-center gap-1">
          <SignalIcon />
          <span className="text-[10px] font-bold">5G</span>
          <BatteryIcon />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 pb-3 pt-1" style={{ color: GRAY_800 }}>
        <button
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white"
          style={{ boxShadow: SHADOW_SM }}
        >
          <BackIcon />
        </button>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: isGroup ? '#128c7e' : GRAY_300, color: isGroup ? '#ffffff' : GRAY_500 }}
        >
          {isGroup ? <GroupIcon /> : <PersonIcon />}
        </div>
        <div className="min-w-0 flex-1 truncate pt-1">
          <h2
            className="truncate text-[16px] font-semibold leading-tight"
            style={{ color: GRAY_800 }}
          >
            {title}
          </h2>
          {isGroup && (
            <p className="truncate text-[10px]" style={{ color: GRAY_500 }}>
              Anda, {contactName || 'Anna'}, Rey, Warga...
            </p>
          )}
        </div>
        <button
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white"
          style={{ boxShadow: SHADOW_SM }}
        >
          <VideoIcon />
        </button>
        <button
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white"
          style={{ boxShadow: SHADOW_SM }}
        >
          <PhoneIcon />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 space-y-2 overflow-hidden px-3 py-1">
        {!messages || messages.length === 0 ? (
          <p
            className="mx-auto mt-10 max-w-[150px] rounded-lg py-1 text-center text-xs"
            style={{ backgroundColor: 'rgba(255,255,255,0.5)', color: GRAY_500 }}
          >
            Belum ada pesan
          </p>
        ) : (
          messages.map((msg) => <Bubble key={msg.id} message={msg} chatMode={chatMode} />)
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-3 py-3" style={{ color: GRAY_700 }}>
        <PlusIcon />
        <div
          className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[14px]"
          style={{ boxShadow: SHADOW_SM }}
        >
          <span aria-hidden style={{ color: GRAY_400 }}>🙂</span>
          <span className="flex-1" style={{ color: GRAY_400 }}>Message</span>
        </div>
        <CameraIcon />
        <MicIcon />
      </div>
    </div>
  )
})

export default PhoneMockup

