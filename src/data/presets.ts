import type { GeneticInput } from '../types';

export const defaultGeneticInput: GeneticInput = {
  gender: 'male',
  enabled: {
    face: true,
    height: true,
    physique: true,
    athletic: true,
    voiceAura: true,
    age: true,
  },
  faceDeviation: 52,
  heightCm: 171,
  physiqueId: 'average',
  athleticId: 'medium',
  voiceAuraId: 'pleasant',
  ageBandId: 'early20s',
};

export const presetGodGenes: GeneticInput = {
  gender: 'male',
  enabled: {
    face: true,
    height: true,
    physique: true,
    athletic: true,
    voiceAura: true,
    age: true,
  },
  faceDeviation: 72,
  heightCm: 182,
  physiqueId: 'athleticBuild',
  athleticId: 'elite',
  voiceAuraId: 'unfair',
  ageBandId: 'early20s',
};

export const presetAverageBundle: GeneticInput = {
  gender: 'male',
  enabled: {
    face: true,
    height: true,
    physique: true,
    athletic: true,
    voiceAura: true,
    age: true,
  },
  faceDeviation: 50,
  heightCm: 171,
  physiqueId: 'average',
  athleticId: 'medium',
  voiceAuraId: 'plain',
  ageBandId: 'late20s',
};

export const presetMortalGenes: GeneticInput = {
  gender: 'male',
  enabled: {
    face: true,
    height: true,
    physique: true,
    athletic: true,
    voiceAura: true,
    age: true,
  },
  faceDeviation: 44,
  heightCm: 162,
  physiqueId: 'lean',
  athleticId: 'low',
  voiceAuraId: 'plain',
  ageBandId: 'early40sPlus',
};

export const presets = [
  { id: 'default', label: '初期値', input: defaultGeneticInput },
  { id: 'god', label: '神遺伝子', input: presetGodGenes },
  { id: 'average', label: '平均コピペ', input: presetAverageBundle },
  { id: 'mortal', label: '凡遺伝子', input: presetMortalGenes },
] as const;
