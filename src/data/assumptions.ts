/**
 * 分布パラメータ（フェルミ用）。UI の短文説明・estimator と共有。
 */

/** 顔・体格・運動・声など「偏差値スライダー」共通の仮定分布（尾確率用）。 */
export const TRAIT_DEV_MEAN = 50;
export const TRAIT_DEV_SD = 10;

/** 男性成人の身長（cm）：正規近似。 */
export const HEIGHT_MALE_MEAN_CM = 171;
export const HEIGHT_MALE_SD_CM = 7;

/** 女性成人の身長（cm）：参考。 */
export const HEIGHT_FEMALE_MEAN_CM = 158;
export const HEIGHT_FEMALE_SD_CM = 6;

/**
 * 若さ・持久（界隈）係数: Φ((D - VITALITY_CENTER_DEV) / VITALITY_SPREAD_DEV)
 * D が高いほど係数は大きくなり、連乗を緩める（若め・スタミナ有利の解釈）。
 */
export const VITALITY_CENTER_DEV = 40;
export const VITALITY_SPREAD_DEV = 14;
