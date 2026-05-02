const verifiedStats = [
  '身長の目安は男性 171±7 cm、女性 158±6 cm の正規近似を使っています。',
  'IQ は平均 100・ばらつき 15 くらいの目安尺に置き換えています。',
  '確認しやすい参考先としては e-Stat や厚生労働省の公表資料があります。',
];

const assumptionNotes = [
  '顔・体格・運動・声は「平均 50・幅 10 くらい」の偏差値風スライダーとして扱います。',
  '年代感・実家・育ちの地域は人口統計ではなく、エンタメ寄りの係数として掛けています。',
  '項目同士の相関は見ず、オンにしたモジュールの比率を順に掛け合わせています。',
];

const subjectiveNotes = [
  '顔・声・オーラは主観が強く、統計的に厳密な指標ではありません。',
  '複数条件を独立で掛けるため、極端な組み合わせでは過小・過大になりえます。',
  '表示している「生まれた星偏差値」は学術指標ではなく、このアプリ独自の見やすい尺度です。',
];

export function MethodNotes() {
  return (
    <section
      id="method-notes"
      className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md lg:grid-cols-3"
    >
      <article className="rounded-xl border border-white/10 bg-night-950/35 p-4">
        <p className="text-xs font-semibold tracking-[0.18em] text-star-200">前提</p>
        <h2 className="mt-2 text-base font-semibold text-white">この診断で置いているルール</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/68">
          {assumptionNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </article>

      <article className="rounded-xl border border-emerald-400/20 bg-emerald-500/8 p-4">
        <p className="text-xs font-semibold tracking-[0.18em] text-emerald-200">確かめやすい数字</p>
        <h2 className="mt-2 text-base font-semibold text-white">公開資料と噛み合いやすい部分</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/68">
          {verifiedStats.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </article>

      <article className="rounded-xl border border-amber-400/20 bg-amber-500/8 p-4">
        <p className="text-xs font-semibold tracking-[0.18em] text-amber-100">注意</p>
        <h2 className="mt-2 text-base font-semibold text-white">主観が強いところ</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/68">
          {subjectiveNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
