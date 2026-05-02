import {
  birthRegionOptions,
  familyWealthOptions,
  sceneAgeOptions,
} from '../data/assumptions';
import type {
  BirthRegionId,
  FamilyWealthId,
  Gender,
  GeneticConditionId,
  GeneticInput,
  SceneAgeId,
} from '../types';
import { DEVIATION_MAX, DEVIATION_MIN } from '../types';
import { approximateHeightCmFromDeviation, approximateIqFromDeviation } from '../utils/estimator';

interface Props {
  value: GeneticInput;
  onChange: (next: GeneticInput) => void;
}

type DeviationField =
  | 'faceDeviation'
  | 'heightDeviation'
  | 'physiqueDeviation'
  | 'athleticDeviation'
  | 'voiceAuraDeviation'
  | 'iqDeviation';

type DeviationModuleConfig = {
  id: Exclude<GeneticConditionId, 'age' | 'familyWealth' | 'birthRegion'>;
  title: string;
  description: string;
  field: DeviationField;
  hint: 'none' | 'cm' | 'iq';
};

const DEVIATION_MODULES: DeviationModuleConfig[] = [
  {
    id: 'face',
    title: '顔面偏差値',
    description: `顔立ちの立ち上がり感をざっくり（${DEVIATION_MIN}–${DEVIATION_MAX}）`,
    field: 'faceDeviation',
    hint: 'none',
  },
  {
    id: 'height',
    title: '身長偏差値',
    description: `スライダーを身長の目安 cm に変換（${DEVIATION_MIN}–${DEVIATION_MAX}）`,
    field: 'heightDeviation',
    hint: 'cm',
  },
  { id: 'physique', title: '体格偏差値', description: '骨格・筋肉の印象をざっくり', field: 'physiqueDeviation', hint: 'none' },
  { id: 'athletic', title: '運動神経偏差値', description: '協調・瞬発などの生素質イメージ', field: 'athleticDeviation', hint: 'none' },
  { id: 'voiceAura', title: '声偏差値', description: 'トーンや話し方の印象（主観が強め）', field: 'voiceAuraDeviation', hint: 'none' },
  {
    id: 'iq',
    title: 'IQ（偏差値スライダー）',
    description: `スライダーから IQ の雰囲気を出して割合を見る仮定（${DEVIATION_MIN}–${DEVIATION_MAX}）。本物の検査ではありません`,
    field: 'iqDeviation',
    hint: 'iq',
  },
];

function Toggle({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs text-white/55">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="size-4 rounded border-white/25 bg-white/5 accent-star-500"
      />
      <span>{label}</span>
    </label>
  );
}

export function FilterPanel({ value, onChange }: Props) {
  const setGender = (gender: Gender) => onChange({ ...value, gender });

  const setEnabled = (id: GeneticConditionId, enabled: boolean) =>
    onChange({
      ...value,
      enabled: { ...value.enabled, [id]: enabled },
    });

  const setDeviation = (field: DeviationField, n: number) =>
    onChange({
      ...value,
      [field]: n,
    });

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">星モジュール</h2>
            <p className="text-sm leading-relaxed text-white/62">
              <strong className="font-medium text-white/70">フェルミ推定</strong>
              用の入力です。顔〜IQ は偏差値スライダー。年代・実家・地域はプルダウン（場当たりの係数）。すべて{' '}
              {DEVIATION_MIN}–{DEVIATION_MAX} はスライダー共通レンジです。
            </p>
          </div>
          <fieldset className="flex gap-2 rounded-xl border border-white/10 bg-night-950/40 p-1">
            <legend className="sr-only">性別（身長の目安 cm）</legend>
            {(['male', 'female'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                  value.gender === g
                    ? 'bg-star-500/25 text-white ring-1 ring-star-400/50'
                    : 'text-white/55 hover:text-white/80'
                }`}
              >
                {g === 'male' ? '男性' : '女性'}
              </button>
            ))}
          </fieldset>
        </header>

        <div className="grid gap-5 lg:grid-cols-2">
          {DEVIATION_MODULES.map((meta) => {
            const dev = value[meta.field];
            const hintCm =
              meta.hint === 'cm' ? approximateHeightCmFromDeviation(dev, value.gender).toFixed(1) : null;
            const hintIq = meta.hint === 'iq' ? approximateIqFromDeviation(dev).toFixed(0) : null;

            return (
              <article
                key={meta.id}
                className="rounded-xl border border-white/10 bg-night-950/35 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{meta.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/55">{meta.description}</p>
                  </div>
                  <Toggle
                    checked={value.enabled[meta.id]}
                    onCheckedChange={(checked) => setEnabled(meta.id, checked)}
                    label="使う"
                  />
                </div>

                <label className="mt-4 block text-xs text-white/55">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span>偏差値</span>
                    <span className="tabular-nums text-white/85">
                      {dev}
                      {hintCm !== null ? (
                        <span className="ml-2 text-white/50">（目安 {hintCm} cm）</span>
                      ) : null}
                      {hintIq !== null ? (
                        <span className="ml-2 text-white/50">（目安 IQ {hintIq}）</span>
                      ) : null}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={DEVIATION_MIN}
                    max={DEVIATION_MAX}
                    step={1}
                    disabled={!value.enabled[meta.id]}
                    value={dev}
                    onChange={(event) => setDeviation(meta.field, Number(event.target.value))}
                    className="w-full accent-star-500 disabled:opacity-35"
                  />
                </label>
              </article>
            );
          })}

          <article className="rounded-xl border border-white/10 bg-night-950/35 p-4 ring-1 ring-amber-500/15">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">シーンの年代感</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/55">
                  実年齢そのものではなく、シーン上のラベルです。係数は机上の目安です。
                </p>
              </div>
              <Toggle
                checked={value.enabled.age}
                onCheckedChange={(checked) => setEnabled('age', checked)}
                label="使う"
              />
            </div>
            <label className="mt-4 block text-xs text-white/55">
              <span className="mb-2 block text-white/55">年代帯</span>
              <select
                disabled={!value.enabled.age}
                value={value.sceneAgeId}
                onChange={(event) =>
                  onChange({ ...value, sceneAgeId: event.target.value as SceneAgeId })
                }
                className="w-full rounded-lg border border-white/15 bg-night-900/80 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400/50 disabled:opacity-35"
              >
                {sceneAgeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </article>

          <article className="rounded-xl border border-white/10 bg-night-950/35 p-4 ring-1 ring-sky-500/15">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">実家の太さ</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/55">お金の余裕のイメージ（主観の係数）。</p>
              </div>
              <Toggle
                checked={value.enabled.familyWealth}
                onCheckedChange={(checked) => setEnabled('familyWealth', checked)}
                label="使う"
              />
            </div>
            <label className="mt-4 block text-xs text-white/55">
              <span className="mb-2 block text-white/55">余裕のイメージ</span>
              <select
                disabled={!value.enabled.familyWealth}
                value={value.familyWealthId}
                onChange={(event) =>
                  onChange({
                    ...value,
                    familyWealthId: event.target.value as FamilyWealthId,
                  })
                }
                className="w-full rounded-lg border border-white/15 bg-night-900/80 px-3 py-2.5 text-sm text-white outline-none focus:border-sky-400/50 disabled:opacity-35"
              >
                {familyWealthOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </article>

          <article className="rounded-xl border border-white/10 bg-night-950/35 p-4 ring-1 ring-teal-500/15">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">育ちの地域</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/55">都会感や育ちのイメージをラベルで雑に分け、係数で掛けます。</p>
              </div>
              <Toggle
                checked={value.enabled.birthRegion}
                onCheckedChange={(checked) => setEnabled('birthRegion', checked)}
                label="使う"
              />
            </div>
            <label className="mt-4 block text-xs text-white/55">
              <span className="mb-2 block text-white/55">イメージ</span>
              <select
                disabled={!value.enabled.birthRegion}
                value={value.birthRegionId}
                onChange={(event) =>
                  onChange({
                    ...value,
                    birthRegionId: event.target.value as BirthRegionId,
                  })
                }
                className="w-full rounded-lg border border-white/15 bg-night-900/80 px-3 py-2.5 text-sm text-white outline-none focus:border-teal-400/50 disabled:opacity-35"
              >
                {birthRegionOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </article>
        </div>
      </div>
    </section>
  );
}
