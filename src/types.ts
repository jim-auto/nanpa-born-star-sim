export type Gender = 'male' | 'female';

export type GeneticConditionId =
  | 'face'
  | 'height'
  | 'physique'
  | 'athletic'
  | 'voiceAura'
  | 'age';

export type EnabledGeneticConditions = Record<GeneticConditionId, boolean>;

/** 見た目・スタミナの「年代感」（偏差値ではなく語で選ぶ）。 */
export type SceneAgeId = 'early20s' | 'late20s' | 'early30s' | 'late30s' | 'early40sPlus';

/** 各スライダーの共通レンジ（偏差値風スケール）。 */
/** 凡〜神で表示に幅を出すため、教科書の偏差値よりやや広め。 */
export const DEVIATION_MIN = 35;
export const DEVIATION_MAX = 85;

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
  /** 界隈での若さ・スタミナを年代帯でざっくり係数化（尾確率ではない）。 */
  sceneAgeId: SceneAgeId;
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
