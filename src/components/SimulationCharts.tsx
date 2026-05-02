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
          <h3 className="text-sm font-semibold text-white">かけ算の推移（対数スケール）</h3>
          <p className="text-xs text-white/45">
            {formatPercent(maxRem)} → {formatPercent(minRem)}
          </p>
        </div>
        <svg
          className="mt-4 w-full text-star-400"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="モジュールを足すごとの、かけ算結果の割合の階段グラフ"
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
        <p className="mt-2 text-xs leading-relaxed text-white/45">
          縦軸は log₁₀（かけ算後の割合）。モジュールを足すほど折れ線が下がります。
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-night-900/60 p-5">
        <h3 className="text-sm font-semibold text-white">ログ幅（−log₁₀ 比）：寄与の目安</h3>
        <ul className="mt-4 space-y-3">
          {contributions.map((item) => (
            <li key={item.id}>
              <div className="flex items-center justify-between gap-3 text-xs text-white/55">
                <span className="line-clamp-2">{item.label}</span>
                <span className="shrink-0 tabular-nums text-white/75">
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
          <p className="mt-4 text-sm text-white/45">ベースのみです。モジュールをオンにしてください。</p>
        ) : null}
      </div>
    </div>
  );
}
