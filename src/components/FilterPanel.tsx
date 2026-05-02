import { sceneAgeOptions } from '../data/assumptions';
import type { Gender, GeneticConditionId, GeneticInput, SceneAgeId } from '../types';
import { DEVIATION_MAX, DEVIATION_MIN } from '../types';
import { approximateHeightCmFromDeviation } from '../utils/estimator';

interface Props {
  value: GeneticInput;
  onChange: (next: GeneticInput) => void;
}

type DeviationField =
  | 'faceDeviation'
  | 'heightDeviation'
  | 'physiqueDeviation'
  | 'athleticDeviation'
  | 'voiceAuraDeviation';

const DEVIATION_MODULES: {
  id: Exclude<GeneticConditionId, 'age'>;
  title: string;
  description: string;
  field: DeviationField;
}[] = [
  { id: 'face', title: '顔面偏差値', description: `尾モデル N(50,10)・${DEVIATION_MIN}–${DEVIATION_MAX}`, field: 'faceDeviation' },
  {
    id: 'height',
    title: '身長偏差値',
    description: `同じ z を性別別身長分布へ写像・目安 cm 表示（${DEVIATION_MIN}–${DEVIATION_MAX}）`,
    field: 'heightDeviation',
  },
  { id: 'physique', title: '体格偏差値', description: '骨格・筋肉の先天イメージ（尾モデル）', field: 'physiqueDeviation' },
  { id: 'athletic', title: '運動神経偏差値', description: '協調・瞬発など（尾モデル）', field: 'athleticDeviation' },
  { id: 'voiceAura', title: '声・オーラ偏差値', description: '主観強め・同一スケールの尾仮定', field: 'voiceAuraDeviation' },
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
            <h2 className="text-lg font-semibold text-white">先天性モジュール</h2>
            <p className="text-sm text-white/50">
              顔・身長・体格・運動・声は偏差値 {DEVIATION_MIN}–{DEVIATION_MAX}。年代感だけ下のプルダウンで選びます（わかりやすさ優先）。
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
                {g === 'male' ? '男性（既定）' : '女性'}
              </button>
            ))}
          </fieldset>
        </header>

        <div className="grid gap-5 lg:grid-cols-2">
          {DEVIATION_MODULES.map((meta) => {
            const dev = value[meta.field];
            const hintCm =
              meta.id === 'height'
                ? approximateHeightCmFromDeviation(dev, value.gender).toFixed(1)
                : null;

            return (
              <article
                key={meta.id}
                className="rounded-xl border border-white/10 bg-night-950/35 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{meta.title}</h3>
                    <p className="mt-1 text-xs text-white/45">{meta.description}</p>
                  </div>
                  <Toggle
                    checked={value.enabled[meta.id]}
                    onCheckedChange={(checked) => setEnabled(meta.id, checked)}
                    label="反映"
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
                <h3 className="text-sm font-semibold text-white">見た目・スタミナの年代感</h3>
                <p className="mt-1 text-xs text-white/45">
                  実年齢そのものではなく「夜のシーンでどう見える／キレるか」のラベル。係数はフェルミ（偏差値ではありません）。
                </p>
              </div>
              <Toggle
                checked={value.enabled.age}
                onCheckedChange={(checked) => setEnabled('age', checked)}
                label="反映"
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
        </div>
      </div>
    </section>
  );
}
