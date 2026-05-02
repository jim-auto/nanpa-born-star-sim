/**
 * 分布パラメータ（フェルミ用）。UI の短文説明・estimator と共有。
 */

import type { BirthRegionId, FamilyWealthId, SceneAgeId } from '../types';

/** 顔・体格・運動・声など「偏差値スライダー」共通の仮定分布（尾確率用）。 */
export const TRAIT_DEV_MEAN = 50;
export const TRAIT_DEV_SD = 10;

/** IQ 尾モデル（ウェクスラー型のざっくり）。 */
export const IQ_POP_MEAN = 100;
export const IQ_POP_SD = 15;

/** 男性成人の身長（cm）：正規近似。 */
export const HEIGHT_MALE_MEAN_CM = 171;
export const HEIGHT_MALE_SD_CM = 7;

/** 女性成人の身長（cm）：参考。 */
export const HEIGHT_FEMALE_MEAN_CM = 158;
export const HEIGHT_FEMALE_SD_CM = 6;

export interface SceneAgeOption {
  id: SceneAgeId;
  label: string;
  ratio: number;
  note: string;
}

/** 年代感ごとの係数（主観フェルミ）。 */
export const sceneAgeOptions: SceneAgeOption[] = [
  {
    id: 'lateTeens',
    label: '10代後半',
    ratio: 1,
    note: '成人直前イメージ。20代前半と同じ係数に正規化（細かい差は無視）。',
  },
  {
    id: 'early20s',
    label: '20代前半',
    ratio: 1,
    note: 'ベースライン。',
  },
  {
    id: 'late20s',
    label: '20代後半',
    ratio: 0.9,
    note: 'わずかにテンポ・回復の係数を下げる仮定。',
  },
  {
    id: 'early30s',
    label: '30代前半',
    ratio: 0.78,
    note: '主観係数。',
  },
  {
    id: 'late30s',
    label: '30代後半',
    ratio: 0.64,
    note: '同上。',
  },
  {
    id: 'early40sPlus',
    label: '40代以上',
    ratio: 0.5,
    note: '幅が大きい年代を1枠にまとめた粗い近似。',
  },
];

export interface FamilyWealthOption {
  id: FamilyWealthId;
  label: string;
  ratio: number;
  note: string;
}

/** 実家の太さ（係数・尾確率ではない）。 */
export const familyWealthOptions: FamilyWealthOption[] = [
  {
    id: 'modest',
    label: '実家は頼りにくい／ギリギリ',
    ratio: 1,
    note: 'ベースライン。',
  },
  {
    id: 'averageFw',
    label: '一般的な中流',
    ratio: 0.9,
    note: '余裕はあるが自由には使えないイメージ。',
  },
  {
    id: 'comfortable',
    label: '余裕あり（趣味・服にお金が回る）',
    ratio: 0.62,
    note: '主観フェルミ。',
  },
  {
    id: 'wealthy',
    label: 'かなり太い',
    ratio: 0.32,
    note: '上位層イメージ。',
  },
  {
    id: 'dynasty',
    label: '資産家級（想像の範囲）',
    ratio: 0.1,
    note: 'エンタメ係数。',
  },
];

export interface BirthRegionOption {
  id: BirthRegionId;
  label: string;
  ratio: number;
  note: string;
}

/** 育ちの地域イメージ（係数）。 */
export const birthRegionOptions: BirthRegionOption[] = [
  {
    id: 'rural',
    label: '地方（大都市圏以外がベース）',
    ratio: 1,
    note: 'ベースライン。',
  },
  {
    id: 'regionalCity',
    label: '地方中枢・準大都市',
    ratio: 0.88,
    note: '都会感が一段上がるイメージ。',
  },
  {
    id: 'metro',
    label: '大都市圏育ち（関東・関西など）',
    ratio: 0.68,
    note: '人口比をざっくり。',
  },
  {
    id: 'tokyo23',
    label: '東京23区ベース',
    ratio: 0.42,
    note: '狭い定義のため係数は強め。',
  },
  {
    id: 'abroad',
    label: '海外育ち／多文化環境',
    ratio: 0.52,
    note: '母数が曖昧なので中等度に置いた係数。',
  },
];

export function getSceneAgeOption(id: SceneAgeId): SceneAgeOption {
  const option = sceneAgeOptions.find((item) => item.id === id);
  if (!option) {
    throw new Error(`Unknown scene age: ${id}`);
  }
  return option;
}

export function getFamilyWealthOption(id: FamilyWealthId): FamilyWealthOption {
  const option = familyWealthOptions.find((item) => item.id === id);
  if (!option) {
    throw new Error(`Unknown family wealth: ${id}`);
  }
  return option;
}

export function getBirthRegionOption(id: BirthRegionId): BirthRegionOption {
  const option = birthRegionOptions.find((item) => item.id === id);
  if (!option) {
    throw new Error(`Unknown birth region: ${id}`);
  }
  return option;
}
