import {
  FACE_MEAN,
  FACE_SD,
  HEIGHT_FEMALE_MEAN_CM,
  HEIGHT_FEMALE_SD_CM,
  HEIGHT_MALE_MEAN_CM,
  HEIGHT_MALE_SD_CM,
  ageBandOptions,
  athleticOptions,
  physiqueOptions,
  voiceAuraOptions,
} from '../data/assumptions';
import type {
  GeneticEstimationResult,
  GeneticInput,
  GeneticStep,
  Gender,
  RatioOption,
  RarityTone,
} from '../types';

function erfApprox(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-ax * ax);
  return sign * y;
}

function normalCdf(x: number): number {
  return 0.5 * (1 + erfApprox(x / Math.SQRT2));
}

/**
 * 標準正規の分位点。P(Z <= z) = p となる z。
 * Acklam 近似（極端な p でも破綻しにくい）。
 */
export function inverseStandardNormal(p: number): number {
  const clamped = Math.min(Math.max(p, 1e-15), 1 - 1e-15);

  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2,
    -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609938702942e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734,
    4.374664141464968, 2.938163982698783,
  ];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];

  const plow = 0.02425;
  const phigh = 1 - plow;

  if (clamped < plow) {
    const q = Math.sqrt(-2 * Math.log(clamped));
    return (
      (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }
  if (clamped > phigh) {
    const q = Math.sqrt(-2 * Math.log(1 - clamped));
    return (
      -(((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }
  const q = clamped - 0.5;
  const r = q * q;
  return (
    (((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!) * q /
    (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1)
  );
}

function findById<TId extends string>(options: RatioOption<TId>[], id: TId): RatioOption<TId> {
  const option = options.find((item) => item.id === id);
  if (!option) {
    throw new Error(`Unknown option: ${id}`);
  }
  return option;
}

function tailRatioNormal(threshold: number, mean: number, sd: number): number {
  const z = (threshold - mean) / sd;
  return 1 - normalCdf(z);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function genderLabel(gender: Gender): string {
  return gender === 'male' ? '男性' : '女性';
}

function appendStep(steps: GeneticStep[], id: string, label: string, ratio: number, note: string): void {
  const previous = steps[steps.length - 1]!.remaining;
  steps.push({
    id,
    label,
    ratio,
    remaining: previous * ratio,
    note,
  });
}

function rarityFromRatio(finalRatio: number): { rarityLabel: string; rarityTone: RarityTone } {
  if (finalRatio <= 1e-6) {
    return { rarityLabel: '都市伝説クラス（数値が極小）', rarityTone: 'mythic' };
  }
  if (finalRatio < 1e-4) {
    return { rarityLabel: 'SSR帯：説明つかない残存率', rarityTone: 'mythic' };
  }
  if (finalRatio < 1e-3) {
    return { rarityLabel: 'かなりハイスペ寄り', rarityTone: 'rare' };
  }
  if (finalRatio < 0.01) {
    return { rarityLabel: '絞り込み強めでもまだ現実味', rarityTone: 'rare' };
  }
  if (finalRatio < 0.08) {
    return { rarityLabel: 'コミュニティ平均より上の可能性', rarityTone: 'narrow' };
  }
  return { rarityLabel: '母集団としては広め（技巧・努力別次元）', rarityTone: 'reasonable' };
}

/** 連続比率 p から「遺伝子偏差値」へ：上位側の希少度として z を割り当てる。 */
export function geneticDeviationFromRatio(finalRatio: number): number {
  const p = clamp(finalRatio, 1e-15, 1 - 1e-15);
  const z = inverseStandardNormal(1 - p);
  const raw = 50 + 10 * z;
  return clamp(raw, 15, 92);
}

export function estimateGeneticStrength(input: GeneticInput): GeneticEstimationResult {
  const genderLabelJp = genderLabel(input.gender);
  const steps: GeneticStep[] = [
    {
      id: 'base',
      label: `ベース（${genderLabelJp}・先天性モジュールを独立に掛け合わせる）`,
      ratio: 1,
      remaining: 1,
      note: '娯楽用フェルミ推定。因子間の相関は無視。',
    },
  ];

  const face = clamp(input.faceDeviation, 40, 80);
  const height = clamp(input.heightCm, 150, 190);

  if (input.enabled.face) {
    const ratio = tailRatioNormal(face, FACE_MEAN, FACE_SD);
    appendStep(
      steps,
      'face',
      `顔面偏差値 ${face} 以上（仮定分布の尾）`,
      ratio,
      `顔の総合スコアを N(${FACE_MEAN}, ${FACE_SD}) の偏差値とみなし、片側確率を使用。`,
    );
  }

  if (input.enabled.height) {
    const mean = input.gender === 'male' ? HEIGHT_MALE_MEAN_CM : HEIGHT_FEMALE_MEAN_CM;
    const sd = input.gender === 'male' ? HEIGHT_MALE_SD_CM : HEIGHT_FEMALE_SD_CM;
    const ratio = tailRatioNormal(height, mean, sd);
    appendStep(
      steps,
      'height',
      `身長 ${height}cm 以上（${genderLabelJp}・正規近似）`,
      ratio,
      `平均 ${mean}cm・SD ${sd}cm の正規近似（docs参照）。`,
    );
  }

  if (input.enabled.physique) {
    const option = findById(physiqueOptions, input.physiqueId);
    appendStep(steps, 'physique', `体格：${option.label}`, option.ratio, option.note);
  }

  if (input.enabled.athletic) {
    const option = findById(athleticOptions, input.athleticId);
    appendStep(steps, 'athletic', `運動神経：${option.label}`, option.ratio, option.note);
  }

  if (input.enabled.voiceAura) {
    const option = findById(voiceAuraOptions, input.voiceAuraId);
    appendStep(steps, 'voiceAura', `声・オーラ：${option.label}`, option.ratio, option.note);
  }

  if (input.enabled.age) {
    const option = findById(ageBandOptions, input.ageBandId);
    appendStep(
      steps,
      'age',
      `加齢補正：${option.label}`,
      option.ratio,
      `${option.note}（シーン上の係数であり、人口尾確率ではない）。`,
    );
  }

  const finalRatio = steps[steps.length - 1]!.remaining;
  const geneticDeviation = geneticDeviationFromRatio(finalRatio);
  const rarity = rarityFromRatio(finalRatio);

  return {
    gender: input.gender,
    genderLabel: genderLabelJp,
    finalRatio,
    geneticDeviation,
    steps,
    enabledFactorCount: steps.length - 1,
    rarityLabel: rarity.rarityLabel,
    rarityTone: rarity.rarityTone,
  };
}

export function formatPercent(value: number): string {
  const percent = value * 100;
  if (percent === 0) {
    return '0%';
  }
  if (percent < 0.0001) {
    return `${percent.toExponential(2)}%`;
  }
  if (percent < 0.01) {
    return `${percent.toFixed(4)}%`;
  }
  if (percent < 1) {
    return `${percent.toFixed(3)}%`;
  }
  return `${percent.toFixed(2)}%`;
}

export function logDropContribution(ratio: number): number {
  if (ratio <= 0) {
    return 0;
  }
  return -Math.log10(ratio);
}
