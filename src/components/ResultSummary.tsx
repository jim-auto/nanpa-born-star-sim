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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs tracking-wide text-white/58">生まれた星偏差値</p>
          <p className="mt-0.5 text-[0.7rem] text-white/52">このアプリ独自の目安です。</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,12rem),1fr]">
            <div className="rounded-xl border border-white/10 bg-night-950/35 px-4 py-3">
              <p className="text-[0.7rem] tracking-wide text-white/52">偏差値</p>
              <p className="mt-1 font-semibold text-5xl text-white tabular-nums tracking-tight">
                {result.geneticDeviation.toFixed(1)}
              </p>
            </div>

            <div className="rounded-xl border border-star-300/18 bg-star-500/8 px-4 py-3">
              <p className="text-[0.7rem] tracking-wide text-white/52">だいたいの帯</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-star-100 sm:text-[1.9rem]">
                {result.modelTierShortJa}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-white/60">
                実際の順位ではなく、偏差値っぽく見やすくした目安です。
              </p>
            </div>
          </div>

          <p className="mt-3 text-[0.75rem] leading-relaxed text-white/55">
            顔・身長・IQ などをまとめて見た総合スコアです。
          </p>
          <p className="mt-3 text-sm text-white/66">
            <strong className="font-medium text-white/75">この条件が全部そろう割合</strong>（想像）{' '}
            <span className="font-medium text-white/85">{formatPercent(result.finalRatio)}</span>
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/55">
            条件を足すほど、どれくらい絞られるかのイメージです。
          </p>
          <a
            href="#method-notes"
            className="mt-3 inline-flex rounded-full border border-star-300/25 bg-star-500/10 px-3 py-1 text-xs font-medium text-star-100 transition hover:border-star-300/45 hover:bg-star-500/20"
          >
            前提を見る
          </a>
        </div>
        <div
          className={`rounded-xl px-4 py-3 ring-1 backdrop-blur-sm ${tone.ring} ${tone.bg}`}
        >
          <p className={`text-sm font-medium ${tone.text}`}>{result.rarityLabel}</p>
          <p className="mt-1 text-xs text-white/58">
            モジュール {result.enabledFactorCount} 個・{result.genderLabel}基準
          </p>
        </div>
      </div>
    </section>
  );
}
