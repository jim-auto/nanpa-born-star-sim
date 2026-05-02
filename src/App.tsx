import { useMemo, useState } from 'react';
import { defaultGeneticInput } from './data/presets';
import type { GeneticInput } from './types';
import { FilterPanel } from './components/FilterPanel';
import { MethodNotes } from './components/MethodNotes';
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
        <p className="text-xs font-semibold tracking-[0.2em] text-star-300">
          ネタ診断 · <span className="text-star-200">フェルミ推定</span>
        </p>
        <h1 className="text-balance text-3xl font-semibold text-white sm:text-4xl">
          生まれた星偏差値診断
        </h1>
        <p className="max-w-3xl text-pretty text-sm leading-relaxed text-white/72">
          顔・身長・IQ・実家・地域などをざっくり掛け合わせる
          <strong className="font-medium text-white/82">フェルミ推定のネタ診断</strong>
          です。実測や公式統計の予測ではありません。
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PresetButtons onSelect={setInput} />
          <p className="text-xs leading-relaxed text-white/58">
            迷ったら「平均の星」から顔・身長・IQだけ動かすと見やすいです。
          </p>
        </div>
      </header>

      <ResultSummary result={result} input={input} />

      <MethodNotes />

      <SimulationCharts steps={result.steps} />

      <FilterPanel value={input} onChange={setInput} />

      <section className="rounded-2xl border border-white/10 bg-night-950/40 p-5 text-sm leading-relaxed text-white/66">
        <h2 className="text-base font-semibold text-white">使った条件</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          {result.steps.map((step) => (
            <li key={step.id}>
              <span className="font-medium text-white/80">{step.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="border-t border-white/10 pt-6 text-xs leading-relaxed text-white/55">
        <p>
          娯楽用の<strong className="font-medium text-white/55">フェルミ推定</strong>です。詳しい前提は
          <a href="#method-notes" className="mx-1 text-star-200 underline decoration-star-300/40 underline-offset-2">
            前提
          </a>
          を見てください。
        </p>
      </footer>
    </div>
  );
}
