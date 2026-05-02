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
  sceneAgeId: 'early20s',
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
  sceneAgeId: 'early20s',
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
  sceneAgeId: 'late20s',
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
  sceneAgeId: 'early40sPlus',
};

export const presets = [
  { id: 'default', label: '初期値', input: defaultGeneticInput },
  { id: 'god', label: '神遺伝子', input: presetGodGenes },
  { id: 'average', label: '平均コピペ', input: presetAverageBundle },
  { id: 'mortal', label: '凡遺伝子', input: presetMortalGenes },
] as const;
