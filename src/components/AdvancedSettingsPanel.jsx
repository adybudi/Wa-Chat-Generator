export default function AdvancedSettingsPanel({
  // Toggles
  enableDarkMode,
  setEnableDarkMode,
  enableMediaMessages,
  setEnableMediaMessages,
  enableCustomTicks,
  setEnableCustomTicks,
  enableCustomStatusBar,
  setEnableCustomStatusBar,

  // Feature specific state
  headerStatusText,
  setHeaderStatusText,
  statusBarTime,
  setStatusBarTime,
  batteryLevel,
  setBatteryLevel,
}) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-blue-900">
          ⚙️ Fitur Lanjutan (Opsional)
        </h2>
        <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-100 px-2 py-0.5 rounded-full">
          Checkbox Mode
        </span>
      </div>

      <div className="space-y-3 text-xs text-gray-700">
        {/* Point 1: Dark Mode */}
        <label className="flex items-start gap-2.5 cursor-pointer rounded-lg border border-gray-200 bg-white p-2.5 shadow-2xs transition hover:bg-gray-50">
          <input
            type="checkbox"
            checked={enableDarkMode}
            onChange={(e) => setEnableDarkMode(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#128c7e] focus:ring-[#128c7e]"
          />
          <div>
            <span className="font-semibold text-gray-800">🌙 WhatsApp Dark Mode</span>
            <p className="text-[11px] text-gray-500">
              Ubah tampilan mockup menjadi tema gelap khas WhatsApp (#0b141a).
            </p>
          </div>
        </label>

        {/* Point 2: Media Messages */}
        <label className="flex items-start gap-2.5 cursor-pointer rounded-lg border border-gray-200 bg-white p-2.5 shadow-2xs transition hover:bg-gray-50">
          <input
            type="checkbox"
            checked={enableMediaMessages}
            onChange={(e) => setEnableMediaMessages(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#128c7e] focus:ring-[#128c7e]"
          />
          <div>
            <span className="font-semibold text-gray-800">📸 Pesan Media (Foto &amp; Voice Note)</span>
            <p className="text-[11px] text-gray-500">
              Aktifkan opsi memilih jenis pesan (Foto / Voice Note) di Manual Editor.
            </p>
          </div>
        </label>

        {/* Point 3: Custom Ticks & Online Status */}
        <div className="rounded-lg border border-gray-200 bg-white p-2.5 space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={enableCustomTicks}
              onChange={(e) => setEnableCustomTicks(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#128c7e] focus:ring-[#128c7e]"
            />
            <div>
              <span className="font-semibold text-gray-800">🎨 Status Centang &amp; Status Online Header</span>
              <p className="text-[11px] text-gray-500">
                Kustomisasi centang (✓, ✓✓ biru/abu, 🕒) &amp; teks status (online/mengetik).
              </p>
            </div>
          </label>

          {enableCustomTicks && (
            <div className="mt-2 pl-7 pt-2 border-t border-gray-100 space-y-2">
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  Status Online Header:
                </label>
                <input
                  type="text"
                  value={headerStatusText}
                  onChange={(e) => setHeaderStatusText(e.target.value)}
                  placeholder="online / mengetik..."
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800 focus:border-[#128c7e] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Point 4: Custom Status Bar */}
        <div className="rounded-lg border border-gray-200 bg-white p-2.5 space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={enableCustomStatusBar}
              onChange={(e) => setEnableCustomStatusBar(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#128c7e] focus:ring-[#128c7e]"
            />
            <div>
              <span className="font-semibold text-gray-800">🔋 Kustomisasi Status Bar (Jam &amp; Baterai)</span>
              <p className="text-[11px] text-gray-500">
                Atur angka jam layar HP dan level persentase baterai.
              </p>
            </div>
          </label>

          {enableCustomStatusBar && (
            <div className="mt-2 pl-7 pt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  Jam HP:
                </label>
                <input
                  type="text"
                  value={statusBarTime}
                  onChange={(e) => setStatusBarTime(e.target.value)}
                  placeholder="10:04"
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800 focus:border-[#128c7e] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  Baterai (%):
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={batteryLevel}
                  onChange={(e) => setBatteryLevel(e.target.value)}
                  placeholder="100"
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800 focus:border-[#128c7e] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
