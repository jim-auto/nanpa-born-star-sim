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
          <p className="text-xs tracking-wide text-white/45 uppercase">生まれた星偏差値（モデル依存）</p>
          <p className="mt-1 font-semibold text-5xl text-white tabular-nums tracking-tight">
            {result.geneticDeviation.toFixed(1)}
          </p>
          <p className="mt-2 text-sm text-white/55">
            各モジュールの「比」をかけた結果{' '}
            <span className="font-medium text-white/85">{formatPercent(result.finalRatio)}</span>
          </p>
          <p className="mt-1 text-xs text-white/38">
            実在の調査値ではなく、独立に掛け合わせたフェルミ用の割合です。
          </p>
        </div>
        <div
          className={`rounded-xl px-4 py-3 ring-1 backdrop-blur-sm ${tone.ring} ${tone.bg}`}
        >
          <p className={`text-sm font-medium ${tone.text}`}>{result.rarityLabel}</p>
          <p className="mt-1 text-xs text-white/45">
            有効モジュール {result.enabledFactorCount} 個・基準：{result.genderLabel}
          </p>
        </div>
      </div>
    </section>
  );
}
