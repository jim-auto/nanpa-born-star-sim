import type { GeneticConditionId, GeneticEstimationResult, GeneticInput, RarityTone } from '../types';
import {
  equivalentDeviationFromRatio,
  formatPercent,
} from '../utils/estimator';
import {
  getBirthRegionOption,
  getFamilyWealthOption,
  getSceneAgeOption,
} from '../data/assumptions';

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
  input: GeneticInput;
}

type DeviationConditionId = Extract<
  GeneticConditionId,
  'face' | 'height' | 'physique' | 'athletic' | 'voiceAura' | 'iq' | 'age' | 'familyWealth' | 'birthRegion'
>;

export function ResultSummary({ result, input }: Props) {
  const tone = toneStyles[result.rarityTone];
  const deviationItems = [
    input.enabled.face ? { id: 'face' as const, label: '顔', value: input.faceDeviation } : null,
    input.enabled.height ? { id: 'height' as const, label: '身長', value: input.heightDeviation } : null,
    input.enabled.physique ? { id: 'physique' as const, label: '体格', value: input.physiqueDeviation } : null,
    input.enabled.athletic ? { id: 'athletic' as const, label: '運動', value: input.athleticDeviation } : null,
    input.enabled.voiceAura ? { id: 'voiceAura' as const, label: '声', value: input.voiceAuraDeviation } : null,
    input.enabled.iq ? { id: 'iq' as const, label: 'IQ', value: input.iqDeviation } : null,
    input.enabled.age
      ? {
          id: 'age' as const,
          label: '年代',
          value: Math.round(equivalentDeviationFromRatio(getSceneAgeOption(input.sceneAgeId).ratio)),
        }
      : null,
    input.enabled.familyWealth
      ? {
          id: 'familyWealth' as const,
          label: '実家',
          value: Math.round(equivalentDeviationFromRatio(getFamilyWealthOption(input.familyWealthId).ratio)),
        }
      : null,
    input.enabled.birthRegion
      ? {
          id: 'birthRegion' as const,
          label: '地域',
          value: Math.round(equivalentDeviationFromRatio(getBirthRegionOption(input.birthRegionId).ratio)),
        }
      : null,
  ].filter((item): item is { id: DeviationConditionId; label: string; value: number } => item !== null);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md">
      <p className="text-xs tracking-wide text-white/58">生まれた星偏差値</p>
      <p className="mt-0.5 text-[0.7rem] text-white/52">このアプリ独自の目安です。</p>

      <div className="mt-4 grid gap-3 lg:grid-cols-[11rem,minmax(0,1fr),15rem]">
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

        <div className={`rounded-xl px-4 py-3 ring-1 backdrop-blur-sm ${tone.ring} ${tone.bg}`}>
          <p className={`text-sm font-medium ${tone.text}`}>{result.rarityLabel}</p>
          <p className="mt-1 text-xs text-white/58">
            モジュール {result.enabledFactorCount} 個・{result.genderLabel}基準
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-night-950/30 px-4 py-3">
          <p className="text-[0.7rem] tracking-wide text-white/52">総合スコア</p>
          <p className="mt-1 text-sm leading-relaxed text-white/72">
            顔・身長・IQ などをまとめて見た目安です。
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-night-950/30 px-4 py-3">
          <p className="text-[0.7rem] tracking-wide text-white/52">この条件が全部そろう割合</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-white">
            {formatPercent(result.finalRatio)}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/55">
            条件を足すほど、どれくらい絞られるかのイメージです。
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-night-950/35 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.7rem] tracking-wide text-white/52">いまの偏差値（係数は換算）</p>
          <a
            href="#method-notes"
            className="inline-flex rounded-full border border-star-300/25 bg-star-500/10 px-3 py-1 text-xs font-medium text-star-100 transition hover:border-star-300/45 hover:bg-star-500/20"
          >
            前提を見る
          </a>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {deviationItems.map((item) => (
            <div
              key={item.id}
              className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5"
            >
              <span className="text-[0.7rem] text-white/55">{item.label}</span>
              <span className="text-sm font-medium tabular-nums text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
