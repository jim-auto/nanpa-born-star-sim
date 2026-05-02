import type { GeneticInput } from '../types';
import { presets } from '../data/presets';

interface Props {
  onSelect: (input: GeneticInput) => void;
}

export function PresetButtons({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelect(structuredClone(preset.input))}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/85 transition hover:border-star-400/50 hover:bg-star-500/15"
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
