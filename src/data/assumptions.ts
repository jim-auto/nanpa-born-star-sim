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
  displayDeviation: number;
  note: string;
}

/** 年代感ごとの偏差値目安。 */
export const sceneAgeOptions: SceneAgeOption[] = [
  {
    id: 'lateTeens',
    label: '10代後半',
    displayDeviation: 75,
    note: '成人直前寄りの見た目イメージ。',
  },
  {
    id: 'early20s',
    label: '20代前半',
    displayDeviation: 75,
    note: '若めに見える中心帯。',
  },
  {
    id: 'late20s',
    label: '20代後半',
    displayDeviation: 65,
    note: '少し落ち着いた印象。',
  },
  {
    id: 'early30s',
    label: '30代前半',
    displayDeviation: 55,
    note: '大人っぽさが出る帯。',
  },
  {
    id: 'late30s',
    label: '30代後半',
    displayDeviation: 45,
    note: 'さらに落ち着いた印象。',
  },
  {
    id: 'early40sPlus',
    label: '40代以上',
    displayDeviation: 35,
    note: '40代以上に見える帯をまとめた粗い近似。',
  },
];

export interface FamilyWealthOption {
  id: FamilyWealthId;
  label: string;
  displayDeviation: number;
  note: string;
}

/** 実家の太さの偏差値目安。 */
export const familyWealthOptions: FamilyWealthOption[] = [
  {
    id: 'modestAbsolute',
    label: '実家は頼れないと言い切れる',
    displayDeviation: 35,
    note: 'このアプリの実家オプションでは最下位帯。',
  },
  {
    id: 'modest',
    label: '実家は頼りにくい／ギリギリ',
    displayDeviation: 40,
    note: '余裕が少ない寄りの帯。',
  },
  {
    id: 'averageFw',
    label: '一般的な中流',
    displayDeviation: 47,
    note: '平均的な中流イメージ。',
  },
  {
    id: 'comfortable',
    label: '余裕あり（趣味・服にお金が回る）',
    displayDeviation: 54,
    note: 'やや余裕がある帯。',
  },
  {
    id: 'wealthy',
    label: 'かなり太い',
    displayDeviation: 62,
    note: 'かなり恵まれた帯。',
  },
  {
    id: 'dynasty',
    label: '資産家級（想像の範囲）',
    displayDeviation: 72,
    note: 'かなり強い上位帯のイメージ。',
  },
];

export interface BirthRegionOption {
  id: BirthRegionId;
  label: string;
  displayDeviation: number;
  note: string;
}

/** 地域イメージの偏差値目安。 */
export const birthRegionOptions: BirthRegionOption[] = [
  {
    id: 'ruralRemote',
    label: '僻地・田舎寄り',
    displayDeviation: 35,
    note: 'このアプリの地域オプションでは最下位帯。',
  },
  {
    id: 'rural',
    label: '地方（地方都市以外）',
    displayDeviation: 40,
    note: '地方寄りの帯。',
  },
  {
    id: 'regionalCity',
    label: '地方都市',
    displayDeviation: 47,
    note: '地方の中では都会寄り。',
  },
  {
    id: 'metro',
    label: '大都市圏（関東・関西など）',
    displayDeviation: 54,
    note: '大都市圏寄りの帯。',
  },
  {
    id: 'abroad',
    label: '海外／多文化環境',
    displayDeviation: 62,
    note: 'かなりレア寄りの帯。',
  },
  {
    id: 'tokyo23',
    label: '東京23区ベース',
    displayDeviation: 73,
    note: 'かなり都市寄りの帯。',
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
