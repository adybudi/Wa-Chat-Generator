const SENDER_STYLE = {
  me: 'bg-[#dcf8c6] text-[#075e54]',
  other: 'bg-gray-100 text-gray-600',
  system: 'bg-amber-100 text-amber-700',
}

export default function MessageEditorList({
  messages,
  onUpdateText,
  onChangeSender,
  onUpdateSenderName,
  onUpdateTime,
  onDelete,
  onAdd,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">📝 Manual Editor</h2>
        <span className="text-xs text-gray-400">{messages.length} pesan</span>
      </div>

      {messages.length === 0 ? (
        <p className="py-6 text-center text-xs text-gray-400">
          Belum ada pesan. Generate dari story, paste script, atau tambah manual.
        </p>
      ) : (
        <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="flex flex-col gap-1.5 rounded-lg border border-gray-100 p-2"
            >
              <div className="flex items-center gap-2">
                <select
                  value={msg.sender}
                  onChange={(e) => onChangeSender(msg.id, e.target.value)}
                  title="Ganti pengirim/penerima/situasi"
                  className={`shrink-0 rounded-full border-none px-2 py-0.5 text-[10px] font-semibold uppercase transition focus:outline-none focus:ring-1 focus:ring-[#128c7e] ${SENDER_STYLE[msg.sender] || SENDER_STYLE.other}`}
                >
                  <option value="other">Other</option>
                  <option value="me">Me</option>
                  <option value="system">Situasi</option>
                </select>

                {msg.sender === 'other' && (
                  <input
                    type="text"
                    value={msg.senderName || ''}
                    onChange={(e) => onUpdateSenderName?.(msg.id, e.target.value)}
                    placeholder="Nama Pembicara"
                    className="w-28 rounded-md border border-gray-200 px-2 py-0.5 text-xs text-gray-700 focus:border-[#128c7e] focus:outline-none focus:ring-1 focus:ring-[#128c7e]"
                  />
                )}

                <div className="flex-1" />

                <input
                  type="text"
                  value={msg.time}
                  onChange={(e) => onUpdateTime(msg.id, e.target.value)}
                  className="w-14 rounded-md border border-gray-200 px-1 py-0.5 text-center text-xs text-gray-500 focus:border-[#128c7e] focus:outline-none focus:ring-1 focus:ring-[#128c7e]"
                />

                <button
                  type="button"
                  title="Hapus pesan"
                  onClick={() => onDelete(msg.id)}
                  className="rounded-md px-1.5 py-0.5 text-xs text-red-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  ✕
                </button>
              </div>

              <textarea
                value={msg.text}
                onChange={(e) => onUpdateText(msg.id, e.target.value)}
                rows={1}
                className="min-h-[32px] w-full resize-none rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-800 focus:border-[#128c7e] focus:outline-none focus:ring-1 focus:ring-[#128c7e]"
              />
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 w-full rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 transition hover:border-[#128c7e] hover:text-[#075e54]"
      >
        + Tambah Pesan Manual
      </button>
    </div>
  )
}
