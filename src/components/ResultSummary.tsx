import type { GeneticEstimationResult, RarityTone } from '../types';
import { formatPercent } from '../utils/estimator';

const toneStyles: Record<
  RarityTone,
  { ring: string; bg: string; text: string }
> = {
  reasonable: {
    ring: 'ring-emerald-500/40',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-200',
  },
  narrow: {
    ring: 'ring-amber-500/40',
    bg: 'bg-amber-500/15',
    text: 'text-amber-100',
  },
  rare: {
    ring: 'ring-fuchsia-500/45',
    bg: 'bg-fuchsia-500/15',
    text: 'text-fuchsia-100',
  },
  mythic: {
    ring: 'ring-violet-400/55',
    bg: 'bg-violet-500/20',
    text: 'text-violet-100',
  },
};

interface Props {
  result: GeneticEstimationResult;
}

export function ResultSummary({ result }: Props) {
  const tone = toneStyles[result.rarityTone];

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-wide text-white/45 uppercase">生まれた星偏差値</p>
          <p className="mt-0.5 text-[0.65rem] text-white/35">このアプリだけの目安（統計の公式値ではありません）</p>
          <p className="mt-1 font-semibold text-5xl text-white tabular-nums tracking-tight">
            {result.geneticDeviation.toFixed(1)}
          </p>
          <p className="mt-2 text-sm text-white/55">
            オンにした条件を<strong className="font-medium text-white/75">全部そろえたときの割合</strong>（想像）{' '}
            <span className="font-medium text-white/85">{formatPercent(result.finalRatio)}</span>
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/38">
            各項目に「こんな人がどれくらいいそう」という比率を付け、それを<strong className="font-medium text-white/55">順に掛け合わせた数</strong>
            です。会話のうまさや、その日のノリは含みません。
          </p>
        </div>
        <div
          className={`rounded-xl px-4 py-3 ring-1 backdrop-blur-sm ${tone.ring} ${tone.bg}`}
        >
          <p className={`text-sm font-medium ${tone.text}`}>{result.rarityLabel}</p>
          <p className="mt-1 text-xs text-white/45">
            オン中のモジュール {result.enabledFactorCount} 個・身長の目安は{result.genderLabel}基準
          </p>
        </div>
      </div>
    </section>
  );
}
