/**
 * 分布パラメータ（フェルミ用）。UI の短文説明・estimator と共有。
 */

import type { SceneAgeId } from '../types';

/** 顔・体格・運動・声など「偏差値スライダー」共通の仮定分布（尾確率用）。 */
export const TRAIT_DEV_MEAN = 50;
export const TRAIT_DEV_SD = 10;

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

/** 年代感ごとの係数（主観フェルミ）。若いほどかけ算を緩めるイメージで 1.0 に近づける。 */
export const sceneAgeOptions: SceneAgeOption[] = [
  {
    id: 'early20s',
    label: '20代前半',
    ratio: 1,
    note: 'ベースライン。「界隈で若く見える・キレがある」の係数を 1 に正規化。',
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
    note: '主観係数。実際の魅力や経験値は別次元。',
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

export function getSceneAgeOption(id: SceneAgeId): SceneAgeOption {
  const option = sceneAgeOptions.find((item) => item.id === id);
  if (!option) {
    throw new Error(`Unknown scene age: ${id}`);
  }
  return option;
}
