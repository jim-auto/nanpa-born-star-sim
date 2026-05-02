import type { GeneticInput } from '../types';

const allOn = {
  face: true,
  height: true,
  physique: true,
  athletic: true,
  voiceAura: true,
  iq: true,
  age: true,
  familyWealth: true,
  birthRegion: true,
} as const;

/** スライダー50・中立めのプルダウン。起動時の既定とも共有 */
export const presetAverageBundle: GeneticInput = {
  gender: 'male',
  enabled: { ...allOn },
  faceDeviation: 50,
  heightDeviation: 50,
  physiqueDeviation: 50,
  athleticDeviation: 50,
  voiceAuraDeviation: 50,
  iqDeviation: 50,
  sceneAgeId: 'late20s',
  familyWealthId: 'averageFw',
  birthRegionId: 'regionalCity',
};

/** アプリ初回表示＝「平均の星」と同じ内容（別オブジェクト） */
export const defaultGeneticInput: GeneticInput = {
  ...presetAverageBundle,
  enabled: { ...presetAverageBundle.enabled },
};

export const presetGodGenes: GeneticInput = {
  gender: 'male',
  enabled: { ...allOn },
  faceDeviation: 84,
  heightDeviation: 83,
  physiqueDeviation: 82,
  athleticDeviation: 83,
  voiceAuraDeviation: 84,
  iqDeviation: 82,
  sceneAgeId: 'lateTeens',
  familyWealthId: 'dynasty',
  birthRegionId: 'tokyo23',
};

export const presetMortalGenes: GeneticInput = {
  gender: 'male',
  enabled: { ...allOn },
  faceDeviation: 35,
  heightDeviation: 36,
  physiqueDeviation: 36,
  athleticDeviation: 35,
  voiceAuraDeviation: 35,
  iqDeviation: 38,
  sceneAgeId: 'early40sPlus',
  familyWealthId: 'modest',
  birthRegionId: 'rural',
};

export const presets = [
  { id: 'god', label: '神の星', input: presetGodGenes },
  { id: 'average', label: '平均の星', input: presetAverageBundle },
  { id: 'mortal', label: '凡人の星', input: presetMortalGenes },
] as const;
