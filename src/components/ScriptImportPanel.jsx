import { useState } from 'react'
import { parseScript, defaultRoleMap, linesToMessages } from '../lib/scriptParser'

export default function ScriptImportPanel({ onConvert }) {
  const [scriptText, setScriptText] = useState('')
  const [parsed, setParsed] = useState(null) // { labels, lines }
  const [roleMap, setRoleMap] = useState({})

  const handleParse = () => {
    const result = parseScript(scriptText)
    if (result.labels.length === 0) {
      setParsed(null)
      return
    }
    setParsed(result)
    setRoleMap(defaultRoleMap(result.labels))
  }

  const handleRoleChange = (label, role) => {
    setRoleMap((prev) => ({ ...prev, [label]: role }))
  }

  const handleConvert = () => {
    if (!parsed) return
    const messages = linesToMessages(parsed.lines, roleMap)
    onConvert(messages)
    setParsed(null)
    setScriptText('')
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-sm font-semibold text-gray-800">
        📋 Paste Script Percakapan
      </h2>
      <p className="mb-3 text-xs text-gray-400">
        Tempel naskah dengan format <code className="rounded bg-gray-100 px-1">Nama: pesan</code>{' '}
        per baris, lalu tentukan siapa penerima &amp; pengirim.
      </p>
      <textarea
        value={scriptText}
        onChange={(e) => setScriptText(e.target.value)}
        placeholder={'A: Malam ini makan di mana ya?\nB: Terserah kamu aja\nA: Sushi gimana?'}
        rows={5}
        className="w-full resize-none rounded-lg border border-gray-300 p-3 font-mono text-xs text-gray-800 placeholder:text-gray-400 focus:border-[#128c7e] focus:outline-none focus:ring-1 focus:ring-[#128c7e]"
      />
      <button
        type="button"
        onClick={handleParse}
        disabled={!scriptText.trim()}
        className="mt-3 w-full rounded-lg border border-[#128c7e] px-4 py-2 text-sm font-medium text-[#075e54] transition hover:bg-[#e7f6f2] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Deteksi Pembicara
      </button>

      {parsed && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500">
            {parsed.lines.length} pesan dari {parsed.labels.length} pembicara terdeteksi.
            Atur perannya:
          </p>
          {parsed.labels.map((label) => (
            <div key={label} className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium text-gray-700">{label}</span>
              <div className="flex overflow-hidden rounded-lg border border-gray-300 text-xs">
                <button
                  type="button"
                  onClick={() => handleRoleChange(label, 'other')}
                  className={`px-2.5 py-1.5 transition ${
                    roleMap[label] === 'other'
                      ? 'bg-gray-700 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  ⬇ Receiver
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange(label, 'me')}
                  className={`px-2.5 py-1.5 transition ${
                    roleMap[label] === 'me'
                      ? 'bg-[#075e54] text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  ⬆ Sender
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange(label, 'system')}
                  title="Tampilkan sebagai notifikasi di tengah, bukan pesan dari seseorang (mis. 'Anda ditambahkan ke grup')"
                  className={`px-2.5 py-1.5 transition ${
                    roleMap[label] === 'system'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  ⓘ Situasi
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleConvert}
            className="w-full rounded-lg bg-[#075e54] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0c7c6d]"
          >
            Convert to Chat
          </button>
        </div>
      )}
    </div>
  )
}
