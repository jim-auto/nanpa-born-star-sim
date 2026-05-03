import type { GeneticConditionId, GeneticEstimationResult, GeneticInput, RarityTone } from '../types';
import {
  approximateHeightCmFromDeviation,
  approximateIqFromDeviation,
  modelTierShortJapanese,
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
  'face' | 'height' | 'physique' | 'athletic' | 'voiceAura' | 'iq'
>;

type SettingItem = {
  id: DeviationConditionId | 'age' | 'familyWealth' | 'birthRegion';
  label: string;
  value: string;
  detail: string | null;
};

export function ResultSummary({ result, input }: Props) {
  const tone = toneStyles[result.rarityTone];
  const tierLabel = modelTierShortJapanese(result.geneticDeviation);
  const deviationItems: SettingItem[] = [];
  if (input.enabled.face) {
    deviationItems.push({ id: 'face', label: '顔', value: `${input.faceDeviation}`, detail: null });
  }
  if (input.enabled.height) {
    deviationItems.push({
      id: 'height',
      label: '身長',
      value: `${input.heightDeviation}`,
      detail: `${approximateHeightCmFromDeviation(input.heightDeviation, input.gender).toFixed(1)} cm`,
    });
  }
  if (input.enabled.physique) {
    deviationItems.push({ id: 'physique', label: '体格', value: `${input.physiqueDeviation}`, detail: null });
  }
  if (input.enabled.athletic) {
    deviationItems.push({ id: 'athletic', label: '運動', value: `${input.athleticDeviation}`, detail: null });
  }
  if (input.enabled.voiceAura) {
    deviationItems.push({ id: 'voiceAura', label: '声', value: `${input.voiceAuraDeviation}`, detail: null });
  }
  if (input.enabled.iq) {
    deviationItems.push({
      id: 'iq',
      label: 'IQ',
      value: `${input.iqDeviation}`,
      detail: `目安 IQ ${approximateIqFromDeviation(input.iqDeviation).toFixed(0)}`,
    });
  }
  if (input.enabled.age) {
    const ageOption = getSceneAgeOption(input.sceneAgeId);
    deviationItems.push({
      id: 'age',
      label: '外見年齢',
      value: `${ageOption.displayDeviation}`,
      detail: ageOption.label,
    });
  }
  if (input.enabled.familyWealth) {
    const familyWealthOption = getFamilyWealthOption(input.familyWealthId);
    deviationItems.push({
      id: 'familyWealth',
      label: '実家',
      value: `${familyWealthOption.displayDeviation}`,
      detail: familyWealthOption.label,
    });
  }
  if (input.enabled.birthRegion) {
    const birthRegionOption = getBirthRegionOption(input.birthRegionId);
    deviationItems.push({
      id: 'birthRegion',
      label: '地域',
      value: `${birthRegionOption.displayDeviation}`,
      detail: birthRegionOption.label,
    });
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-md">
      <p className="text-xs tracking-wide text-white/58">生まれた星偏差値</p>
      <p className="mt-0.5 text-[0.7rem] text-white/52">このアプリ独自の目安です。</p>

      <div className="mt-4 grid gap-3 lg:grid-cols-[11rem,minmax(0,1fr),15rem]">
        <div className="rounded-xl border border-white/10 bg-night-950/35 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="shrink-0 text-base font-medium text-white/72">偏差値</p>
            <p className="min-w-0 text-right text-4xl font-semibold tabular-nums tracking-tight text-white sm:text-5xl">
              {result.geneticDeviation.toFixed(1)}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-star-300/18 bg-star-500/8 px-4 py-3">
          <p className="text-[0.7rem] tracking-wide text-white/52">だいたいの帯</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-star-100 sm:text-[1.9rem]">
            {tierLabel}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/60">このアプリ内でのざっくりした目安です。</p>
        </div>

        <div className={`rounded-xl px-4 py-3 ring-1 backdrop-blur-sm ${tone.ring} ${tone.bg}`}>
          <p className={`text-sm font-medium ${tone.text}`}>{result.rarityLabel}</p>
          <p className="mt-1 text-xs text-white/58">
            モジュール {result.enabledFactorCount} 個・{result.genderLabel}基準
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-night-950/35 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[0.7rem] tracking-wide text-white/52">設定した各偏差値</p>
          <a
            href="#method-notes"
            className="inline-flex rounded-full border border-star-300/25 bg-star-500/10 px-3 py-1 text-xs font-medium text-star-100 transition hover:border-star-300/45 hover:bg-star-500/20"
          >
            前提を見る
          </a>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {deviationItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-white/8 bg-white/5 px-3 py-2.5"
            >
              <p className="shrink-0 pt-0.5 text-base font-medium text-white/72">{item.label}</p>
              <div className="min-w-0 flex-1 text-right">
                <p className="text-xl font-semibold tabular-nums leading-tight text-white">{item.value}</p>
                {item.detail ? (
                  <p className="mt-1 text-sm leading-snug text-white/58">{item.detail}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
