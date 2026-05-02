import type { AgeBandId, AthleticId, PhysiqueId, RatioOption, VoiceAuraId } from '../types';

/** 顔面スコアのフェルミ近似：平均50・SD10の正規分布として「その偏差値以上」の割合を使う。 */
export const FACE_MEAN = 50;
export const FACE_SD = 10;

/** 男性成人の身長（cm）：正規近似のパラメータ（docs参照）。 */
export const HEIGHT_MALE_MEAN_CM = 171;
export const HEIGHT_MALE_SD_CM = 7;

/** 女性成人の身長（cm）：参考用。 */
export const HEIGHT_FEMALE_MEAN_CM = 158;
export const HEIGHT_FEMALE_SD_CM = 6;

export const physiqueOptions: RatioOption<PhysiqueId>[] = [
  {
    id: 'lean',
    label: '細身寄り',
    ratio: 1,
    note: 'ベースライン（やや主観）。他体型との相対比。',
  },
  {
    id: 'average',
    label: '平均的な筋肉・脂肪バランス',
    ratio: 0.72,
    note: '「平均的に良い」体格が同時に成立する割合の仮定。',
  },
  {
    id: 'athleticBuild',
    label: '引き締まったアスリート型',
    ratio: 0.28,
    note: '界隈で目に止まりやすい体型の仮定（強め）。',
  },
  {
    id: 'stocky',
    label: 'がっしり骨格',
    ratio: 0.38,
    note: '骨格・肉付きの印象が強い層の仮定。',
  },
];

export const athleticOptions: RatioOption<AthleticId>[] = [
  {
    id: 'low',
    label: '運動神経は普通以下',
    ratio: 1,
    note: 'ベースライン。',
  },
  {
    id: 'medium',
    label: 'スポーツやや得意',
    ratio: 0.55,
    note: '平均より動きが良い層の仮定。',
  },
  {
    id: 'high',
    label: 'かなり得意（部活強・ダンス等）',
    ratio: 0.22,
    note: '協調性・瞬発力の先天性寄りの仮定。',
  },
  {
    id: 'elite',
    label: '規格外（天性のタイミング）',
    ratio: 0.07,
    note: '強い仮定。実データではなくシミュ用。',
  },
];

export const voiceAuraOptions: RatioOption<VoiceAuraId>[] = [
  {
    id: 'plain',
    label: '声・オーラは普通',
    ratio: 1,
    note: '先天性×印象の分解は不可能に近い前提でのベース。',
  },
  {
    id: 'pleasant',
    label: '声質が好まれる（聴き心地）',
    ratio: 0.48,
    note: '主観・文化依存が大きい仮定。',
  },
  {
    id: 'magnetic',
    label: '低く響く／空気を締める存在感',
    ratio: 0.18,
    note: '「オーラ」は計測困難。エンタメ寄り係数。',
  },
  {
    id: 'unfair',
    label: '説明がつかないほど刺さる',
    ratio: 0.045,
    note: '極端な仮定。比較・妄想用。',
  },
];

export const ageBandOptions: RatioOption<AgeBandId>[] = [
  {
    id: 'early20s',
    label: '20代前半',
    ratio: 1,
    note: '界隈での「若さボーナス」を1.0に正規化。',
  },
  {
    id: 'late20s',
    label: '20代後半',
    ratio: 0.9,
    note: 'スキン・回復・シーン慣れのトレードオフを粗く潰した係数。',
  },
  {
    id: 'early30s',
    label: '30代前半',
    ratio: 0.78,
    note: '主観係数。実生活のスキルは別次元。',
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
    note: '幅が大きい年代を1枠にまとめた近似。',
  },
];
