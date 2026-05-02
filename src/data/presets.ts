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

/** 各因子をかなり尖らせた「規格外」寄り（シミュ用）。 */
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
  faceDeviation: 84,
  heightDeviation: 83,
  physiqueDeviation: 82,
  athleticDeviation: 83,
  voiceAuraDeviation: 84,
  sceneAgeId: 'early20s',
};

/** どこにでもいそうな平均イメージ。 */
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

/** タブー寄り・シナリオ用の下限付近。 */
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
  faceDeviation: 35,
  heightDeviation: 36,
  physiqueDeviation: 36,
  athleticDeviation: 35,
  voiceAuraDeviation: 35,
  sceneAgeId: 'early40sPlus',
};

export const presets = [
  { id: 'default', label: '初期値', input: defaultGeneticInput },
  { id: 'god', label: '神遺伝子', input: presetGodGenes },
  { id: 'average', label: '平均コピペ', input: presetAverageBundle },
  { id: 'mortal', label: '凡遺伝子', input: presetMortalGenes },
] as const;
