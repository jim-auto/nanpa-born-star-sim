export type Gender = 'male' | 'female';

export type GeneticConditionId =
  | 'face'
  | 'height'
  | 'physique'
  | 'athletic'
  | 'voiceAura'
  | 'iq'
  | 'age'
  | 'familyWealth'
  | 'birthRegion';

export type EnabledGeneticConditions = Record<GeneticConditionId, boolean>;

export type SceneAgeId =
  | 'lateTeens'
  | 'early20s'
  | 'late20s'
  | 'early30s'
  | 'late30s'
  | 'early40sPlus';

export type FamilyWealthId =
  | 'modest'
  | 'modestAbsolute'
  | 'averageFw'
  | 'comfortable'
  | 'wealthy'
  | 'dynasty';

export type BirthRegionId =
  | 'rural'
  | 'ruralRemote'
  | 'regionalCity'
  | 'metro'
  | 'tokyo23'
  | 'abroad';

export const DEVIATION_MIN = 35;
export const DEVIATION_MAX = 85;

/** プルダウン表示偏差値の下限（スライダーより低く取れる・最下位帯用）。 */
export const PULLDOWN_DEVIATION_MIN = 30;

export interface GeneticInput {
  gender: Gender;
  enabled: EnabledGeneticConditions;
  faceDeviation: number;
  heightDeviation: number;
  physiqueDeviation: number;
  athleticDeviation: number;
  voiceAuraDeviation: number;
  /** スライダーは「偏差値風」。内部で IQ 目安を出し、その上の帯の割合をざっくり見る。 */
  iqDeviation: number;
  sceneAgeId: SceneAgeId;
  familyWealthId: FamilyWealthId;
  birthRegionId: BirthRegionId;
}

export interface GeneticStep {
  id: string;
  label: string;
  ratio: number;
  remaining: number;
  note: string;
}

export type RarityTone = 'reasonable' | 'narrow' | 'rare' | 'mythic';

export interface GeneticEstimationResult {
  gender: Gender;
  genderLabel: string;
  finalRatio: number;
  geneticDeviation: number;
  steps: GeneticStep[];
  enabledFactorCount: number;
  rarityLabel: string;
  rarityTone: RarityTone;
}
