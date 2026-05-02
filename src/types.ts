export type Gender = 'male' | 'female';

export type GeneticConditionId =
  | 'face'
  | 'height'
  | 'physique'
  | 'athletic'
  | 'voiceAura'
  | 'age';

export type EnabledGeneticConditions = Record<GeneticConditionId, boolean>;

export type PhysiqueId = 'lean' | 'average' | 'athleticBuild' | 'stocky';
export type AthleticId = 'low' | 'medium' | 'high' | 'elite';
export type VoiceAuraId = 'plain' | 'pleasant' | 'magnetic' | 'unfair';
export type AgeBandId = 'early20s' | 'late20s' | 'early30s' | 'late30s' | 'early40sPlus';

export interface RatioOption<TId extends string = string> {
  id: TId;
  label: string;
  ratio: number;
  note: string;
}

export interface GeneticInput {
  /** 身長分布などに利用。デフォルトは男性。 */
  gender: Gender;
  enabled: EnabledGeneticConditions;
  /** 顔面偏差値（40–80） */
  faceDeviation: number;
  /** 身長 cm（150–190） */
  heightCm: number;
  physiqueId: PhysiqueId;
  athleticId: AthleticId;
  voiceAuraId: VoiceAuraId;
  ageBandId: AgeBandId;
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
