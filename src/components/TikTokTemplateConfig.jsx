export default function TikTokTemplateConfig({
  coverTitle,
  setCoverTitle,
  coverSubtitle,
  setCoverSubtitle,
  coverImage,
  setCoverImage,
  synopsisText,
  setSynopsisText,
}) {
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setCoverImage(event.target?.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-purple-900">
          🎵 Pengaturan Template TikTok (Slide 1 & 2)
        </h2>
        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
          9:16 Format
        </span>
      </div>

      <div className="space-y-3">
        {/* Thumbnail Upload */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Thumbnail Slide 1
          </label>
          <div className="flex items-center gap-3">
            {coverImage ? (
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-300 bg-gray-100">
                <img src={coverImage} alt="Thumbnail preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow"
                  title="Hapus gambar"
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="flex h-14 flex-1 cursor-pointer items-center justify-center rounded-lg border border-dashed border-purple-300 bg-white px-3 text-center transition hover:border-purple-500 hover:bg-purple-50">
                <span className="text-xs font-medium text-purple-700">+ Upload Gambar Thumbnail</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
            {coverImage && (
              <label className="cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
                Ganti Gambar
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Judul Utama (Slide 1)
          </label>
          <input
            type="text"
            value={coverTitle}
            onChange={(e) => setCoverTitle(e.target.value)}
            placeholder="TAMAN WISATA BERHANTU"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-800 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Sub Judul / Episode (Slide 1)
          </label>
          <input
            type="text"
            value={coverSubtitle}
            onChange={(e) => setCoverSubtitle(e.target.value)}
            placeholder="EPISODE ENAM"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-800 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
          />
        </div>

        {/* Synopsis / Opening Narrative */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Narasi / Sinopsis Pembuka (Slide 2)
          </label>
          <textarea
            value={synopsisText}
            onChange={(e) => setSynopsisText(e.target.value)}
            placeholder="Wahana terakhir adalah Bianglala Raksasa yang menjulang tinggi menembus kabut..."
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-300 bg-white p-2.5 text-xs text-gray-800 focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
          />
        </div>
      </div>
    </div>
  )
}
