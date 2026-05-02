export type Gender = 'male' | 'female';

export type GeneticConditionId =
  | 'face'
  | 'height'
  | 'physique'
  | 'athletic'
  | 'voiceAura'
  | 'age';

export type EnabledGeneticConditions = Record<GeneticConditionId, boolean>;

/** 各スライダーの共通レンジ（偏差値風スケール）。 */
export const DEVIATION_MIN = 40;
export const DEVIATION_MAX = 80;

export interface GeneticInput {
  /** 身長の目安 cm 換算に利用。デフォルトは男性。 */
  gender: Gender;
  enabled: EnabledGeneticConditions;
  faceDeviation: number;
  /** 身長（偏差値）。内部で z=(D−50)/10 を身長分布に写像して尾確率を計算。 */
  heightDeviation: number;
  physiqueDeviation: number;
  athleticDeviation: number;
  voiceAuraDeviation: number;
  /** 界隈での「若さ・スタミナ」イメージ。累積側の係数（docs参照）。 */
  ageVitalityDeviation: number;
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
