function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-gray-800">{title}</h2>
      {children}
    </div>
  )
}

export default function StoryToChatPanel({
  storyPrompt,
  onStoryPromptChange,
  onGenerate,
  isGenerating,
  error,
}) {
  return (
    <Section title="✨ AI Story-to-Chat">
      <textarea
        value={storyPrompt}
        onChange={(e) => onStoryPromptChange(e.target.value)}
        placeholder='Contoh: "Dua orang teman berdebat mau makan di mana"'
        rows={3}
        className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#128c7e] focus:outline-none focus:ring-1 focus:ring-[#128c7e]"
      />
      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating || !storyPrompt.trim()}
        className="mt-3 w-full rounded-lg bg-[#075e54] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0c7c6d] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGenerating ? 'Generating…' : 'Generate Chat'}
      </button>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      <p className="mt-2 text-xs text-gray-400">
        Chat akan otomatis dibuat dengan 2 pembicara (A &amp; B). Kamu bisa
        edit atau hapus tiap pesan setelahnya di bawah.
      </p>
    </Section>
  )
}
