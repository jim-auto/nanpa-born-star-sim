import {
  ageBandOptions,
  athleticOptions,
  physiqueOptions,
  voiceAuraOptions,
} from '../data/assumptions';
import type { Gender, GeneticConditionId, GeneticInput } from '../types';

interface Props {
  value: GeneticInput;
  onChange: (next: GeneticInput) => void;
}

const moduleMeta: { id: GeneticConditionId; title: string; description: string }[] = [
  { id: 'face', title: '顔面偏差値', description: 'N(50,10) 片側（40–80）' },
  { id: 'height', title: '身長', description: '性別別の正規尾（150–190cm）' },
  { id: 'physique', title: '体格', description: '筋肉・骨格の仮定比' },
  { id: 'athletic', title: '運動神経', description: '協調性・瞬発の先天性寄り' },
  { id: 'voiceAura', title: '声・オーラ', description: '計測困難＝主観係数強め' },
  { id: 'age', title: '加齢補正', description: 'シーン上の係数（尾確率ではない）' },
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

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">先天性モジュール</h2>
            <p className="text-sm text-white/50">オンオフと入力が即座に連乗に反映されます。</p>
          </div>
          <fieldset className="flex gap-2 rounded-xl border border-white/10 bg-night-950/40 p-1">
            <legend className="sr-only">性別（身長分布）</legend>
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
          {moduleMeta.map((meta) => (
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

              <div className="mt-4 opacity-100">
                {meta.id === 'face' ? (
                  <label className="block text-xs text-white/55">
                    <div className="mb-2 flex items-center justify-between">
                      <span>偏差値</span>
                      <span className="tabular-nums text-white/85">{value.faceDeviation}</span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={80}
                      step={1}
                      disabled={!value.enabled.face}
                      value={value.faceDeviation}
                      onChange={(event) =>
                        onChange({ ...value, faceDeviation: Number(event.target.value) })
                      }
                      className="w-full accent-star-500 disabled:opacity-35"
                    />
                  </label>
                ) : null}

                {meta.id === 'height' ? (
                  <label className="block text-xs text-white/55">
                    <div className="mb-2 flex items-center justify-between">
                      <span>cm</span>
                      <span className="tabular-nums text-white/85">{value.heightCm}</span>
                    </div>
                    <input
                      type="range"
                      min={150}
                      max={190}
                      step={1}
                      disabled={!value.enabled.height}
                      value={value.heightCm}
                      onChange={(event) =>
                        onChange({ ...value, heightCm: Number(event.target.value) })
                      }
                      className="w-full accent-star-500 disabled:opacity-35"
                    />
                  </label>
                ) : null}

                {meta.id === 'physique' ? (
                  <select
                    disabled={!value.enabled.physique}
                    value={value.physiqueId}
                    onChange={(event) =>
                      onChange({ ...value, physiqueId: event.target.value as GeneticInput['physiqueId'] })
                    }
                    className="mt-1 w-full rounded-lg border border-white/15 bg-night-900/80 px-3 py-2 text-sm text-white outline-none ring-0 focus:border-star-400/60 disabled:opacity-35"
                  >
                    {physiqueOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : null}

                {meta.id === 'athletic' ? (
                  <select
                    disabled={!value.enabled.athletic}
                    value={value.athleticId}
                    onChange={(event) =>
                      onChange({ ...value, athleticId: event.target.value as GeneticInput['athleticId'] })
                    }
                    className="mt-1 w-full rounded-lg border border-white/15 bg-night-900/80 px-3 py-2 text-sm text-white outline-none focus:border-star-400/60 disabled:opacity-35"
                  >
                    {athleticOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : null}

                {meta.id === 'voiceAura' ? (
                  <select
                    disabled={!value.enabled.voiceAura}
                    value={value.voiceAuraId}
                    onChange={(event) =>
                      onChange({
                        ...value,
                        voiceAuraId: event.target.value as GeneticInput['voiceAuraId'],
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-white/15 bg-night-900/80 px-3 py-2 text-sm text-white outline-none focus:border-star-400/60 disabled:opacity-35"
                  >
                    {voiceAuraOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : null}

                {meta.id === 'age' ? (
                  <select
                    disabled={!value.enabled.age}
                    value={value.ageBandId}
                    onChange={(event) =>
                      onChange({
                        ...value,
                        ageBandId: event.target.value as GeneticInput['ageBandId'],
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-white/15 bg-night-900/80 px-3 py-2 text-sm text-white outline-none focus:border-star-400/60 disabled:opacity-35"
                  >
                    {ageBandOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
