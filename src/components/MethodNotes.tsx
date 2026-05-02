const notes = [
  {
    label: '前提',
    title: '比率を順に掛けるだけ',
    body: '顔〜IQは偏差値風、年代・実家・地域は係数です。相関は見ません。',
    className: 'border-white/10 bg-night-950/35 text-star-200',
  },
  {
    label: '数字',
    title: '使う目安はかなり少なめ',
    body: '身長は 171±7 / 158±6 cm、IQ は 100±15 くらいで換算しています。',
    className: 'border-emerald-400/20 bg-emerald-500/8 text-emerald-200',
  },
  {
    label: '注意',
    title: 'かなり娯楽寄り',
    body: '主観の強い項目を含むので、厳密な統計や診断ではありません。',
    className: 'border-amber-400/20 bg-amber-500/8 text-amber-100',
  },
] as const;

export function MethodNotes() {
  return (
    <section
      id="method-notes"
      className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md lg:grid-cols-3"
    >
      {notes.map((note) => (
        <article key={note.label} className={`rounded-xl border p-4 ${note.className}`}>
          <p className="text-xs font-semibold tracking-[0.18em]">{note.label}</p>
          <h2 className="mt-2 text-base font-semibold text-white">{note.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/68">{note.body}</p>
        </article>
      ))}
    </section>
  );
}
