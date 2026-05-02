import type { GeneticStep } from '../types';
import { formatPercent, logDropContribution } from '../utils/estimator';

interface Props {
  steps: GeneticStep[];
}

function buildStepPath(
  steps: GeneticStep[],
  width: number,
  height: number,
  padX: number,
  padY: number,
): string {
  if (steps.length === 1) {
    const midY = height / 2;
    return `M ${padX} ${midY} L ${width - padX} ${midY}`;
  }
  const vals = steps.map((s) => Math.max(s.remaining, 1e-12));
  const logVals = vals.map((v) => Math.log10(v));
  const minL = Math.min(...logVals);
  const maxL = Math.max(...logVals);
  const span = Math.max(maxL - minL, 1e-6);

  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const xAt = (i: number) => padX + (i / Math.max(steps.length - 1, 1)) * innerW;
  const yAt = (logV: number) => padY + innerH * (1 - (logV - minL) / span);

  let d = '';
  for (let i = 0; i < steps.length; i++) {
    const x = xAt(i);
    const y = yAt(logVals[i]!);
    if (i === 0) {
      d += `M ${x} ${y}`;
    } else {
      d += ` H ${x} V ${y}`;
    }
  }
  return d;
}

export function SimulationCharts({ steps }: Props) {
  const contributions = steps
    .slice(1)
    .map((step) => ({
      id: step.id,
      label: step.label,
      contribution: logDropContribution(step.ratio),
    }))
    .filter((item) => item.contribution > 0);

  const sumContrib =
    contributions.reduce((acc, item) => acc + item.contribution, 0) || 1;

  const width = 520;
  const height = 200;
  const padX = 28;
  const padY = 22;
  const path = buildStepPath(steps, width, height, padX, padY);

  const minRem = Math.min(...steps.map((s) => s.remaining));
  const maxRem = Math.max(...steps.map((s) => s.remaining));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-night-900/60 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-semibold text-white">条件を足すごとの割合（小さすぎる数字を見やすくしたもの）</h3>
          <p className="text-xs text-white/58">
            {formatPercent(maxRem)} → {formatPercent(minRem)}
          </p>
        </div>
        <svg
          className="mt-4 w-full text-star-400"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="条件を一つずつ足したときの、全体の割合の階段グラフ"
        >
          <defs>
            <linearGradient id="lineGlow" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#d4b8ff" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#b388ff" stopOpacity="1" />
              <stop offset="100%" stopColor="#9d6bff" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <path
            d={path}
            fill="none"
            stroke="url(#lineGlow)"
            strokeWidth={3}
            strokeLinecap="square"
            strokeLinejoin="round"
          />
          <path
            d={path}
            fill="none"
            stroke="#c4b5fd"
            strokeOpacity={0.35}
            strokeWidth={6}
          />
        </svg>
        <p className="mt-2 text-xs leading-relaxed text-white/58">
          縦は「けたがいくつ減るか」イメージです。条件が増えるほど、線はだいたい下がります。
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-night-900/60 p-5">
        <h3 className="text-sm font-semibold text-white">どの条件で割合が大きく減ったか（目安）</h3>
        <p className="mt-1 text-xs text-white/52">棒が長いほど、その条件で一気に狭くなったイメージです。</p>
        <ul className="mt-4 space-y-3">
          {contributions.map((item) => (
            <li key={item.id}>
              <div className="flex items-center justify-between gap-3 text-xs text-white/62">
                <span className="line-clamp-2">{item.label}</span>
                <span className="shrink-0 tabular-nums text-white/75" title="効き目の目安スコア">
                  {item.contribution.toFixed(2)}
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500/80 to-fuchsia-400/90"
                  style={{ width: `${(item.contribution / sumContrib) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
        {contributions.length === 0 ? (
          <p className="mt-4 text-sm text-white/58">まだ条件がありません。下の星モジュールで「使う」にチェックを入れてください。</p>
        ) : null}
      </div>
    </div>
  );
}
