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
  heightDeviation: 52,
  physiqueDeviation: 52,
  athleticDeviation: 52,
  voiceAuraDeviation: 52,
  ageVitalityDeviation: 50,
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
  heightDeviation: 64,
  physiqueDeviation: 62,
  athleticDeviation: 65,
  voiceAuraDeviation: 68,
  ageVitalityDeviation: 56,
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
  heightDeviation: 50,
  physiqueDeviation: 50,
  athleticDeviation: 50,
  voiceAuraDeviation: 50,
  ageVitalityDeviation: 48,
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
  heightDeviation: 46,
  physiqueDeviation: 47,
  athleticDeviation: 46,
  voiceAuraDeviation: 45,
  ageVitalityDeviation: 38,
};

export const presets = [
  { id: 'default', label: '初期値', input: defaultGeneticInput },
  { id: 'god', label: '神遺伝子', input: presetGodGenes },
  { id: 'average', label: '平均コピペ', input: presetAverageBundle },
  { id: 'mortal', label: '凡遺伝子', input: presetMortalGenes },
] as const;
