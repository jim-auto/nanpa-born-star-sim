import { useMemo, useState } from 'react';
import { defaultGeneticInput } from './data/presets';
import type { GeneticInput } from './types';
import { FilterPanel } from './components/FilterPanel';
import { PresetButtons } from './components/PresetButtons';
import { ResultSummary } from './components/ResultSummary';
import { SimulationCharts } from './components/SimulationCharts';
import { estimateGeneticStrength } from './utils/estimator';

export default function App() {
  const [input, setInput] = useState<GeneticInput>(() => structuredClone(defaultGeneticInput));

  const result = useMemo(() => estimateGeneticStrength(input), [input]);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-10 pb-16 sm:px-6 lg:px-8">
      <header className="space-y-4">
        <p className="text-xs font-semibold tracking-[0.25em] text-star-300 uppercase">
          Nanpa scene · Fermi toy
        </p>
        <h1 className="text-balance text-3xl font-semibold text-white sm:text-4xl">
          遺伝子偏差値シミュレーター
        </h1>
        <p className="max-w-3xl text-pretty text-sm leading-relaxed text-white/60">
          「生まれた星」を独自の比で乗算し、ナンパ界隈前提の<strong className="font-medium text-white/80">
            先天性スペック
          </strong>
          をざっくり可視化します。相関・技巧・文脈は無視する娱乐モデルです。
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PresetButtons onSelect={setInput} />
          <p className="text-xs text-white/40">プリセットは初期入力をまとめて上書きします。</p>
        </div>
      </header>

      <ResultSummary result={result} />

      <SimulationCharts steps={result.steps} />

      <FilterPanel value={input} onChange={setInput} />

      <section className="rounded-2xl border border-white/10 bg-night-950/40 p-5 text-sm leading-relaxed text-white/55">
        <h2 className="text-base font-semibold text-white">ステップの読み方</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          {result.steps.map((step) => (
            <li key={step.id}>
              <span className="font-medium text-white/80">{step.label}</span>
              <span className="text-white/45"> — {step.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-white/10 pt-6 text-xs text-white/40">
        <p>
          医療・恋愛・道徳の助言ではありません。数値は{' '}
          <code className="rounded bg-white/10 px-1 py-0.5 text-[0.7rem] text-star-200">
            docs/assumptions.md
          </code>{' '}
          の仮定に依存します。
        </p>
      </footer>
    </div>
  );
}
