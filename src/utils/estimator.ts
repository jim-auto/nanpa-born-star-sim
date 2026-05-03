import {
  HEIGHT_FEMALE_MEAN_CM,
  HEIGHT_FEMALE_SD_CM,
  HEIGHT_MALE_MEAN_CM,
  HEIGHT_MALE_SD_CM,
  IQ_POP_MEAN,
  IQ_POP_SD,
  TRAIT_DEV_MEAN,
  TRAIT_DEV_SD,
  getBirthRegionOption,
  getFamilyWealthOption,
  getSceneAgeOption,
} from '../data/assumptions';
import type {
  GeneticEstimationResult,
  GeneticInput,
  GeneticStep,
  Gender,
  RarityTone,
} from '../types';
import { DEVIATION_MAX, DEVIATION_MIN, PULLDOWN_DEVIATION_MIN } from '../types';

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

function tailRatioNormal(threshold: number, mean: number, sd: number): number {
  const z = (threshold - mean) / sd;
  return 1 - normalCdf(z);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function clampDeviation(n: number): number {
  return clamp(n, DEVIATION_MIN, DEVIATION_MAX);
}

function clampPulldownDeviation(n: number): number {
  return clamp(n, PULLDOWN_DEVIATION_MIN, DEVIATION_MAX);
}

/** 年齢帯・実家・地域プルダウンの表示偏差値用（30–85）。スライダーは 35–85。 */
function ratioFromPulldownDeviation(deviation: number): number {
  const d = clampPulldownDeviation(deviation);
  return tailRatioNormal(d, TRAIT_DEV_MEAN, TRAIT_DEV_SD);
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

/**
 * レア度コピー。「生まれた星偏差値」と同じく joint を q = p^(1/n) に直してから段階を付ける。
 * 生の joint p だけで見ると因子数が増えるほど平均付近でも極端に小さくなり、偏差値表示と矛盾するため。
 */
function rarityFromPerFactorEquivalent(q: number): { rarityLabel: string; rarityTone: RarityTone } {
  const pq = clamp(q, 1e-15, 1 - 1e-15);
  if (pq <= 1e-6) {
    return { rarityLabel: '都市伝説級：全部そろうと割合がとてつもなく小さい', rarityTone: 'mythic' };
  }
  if (pq < 1e-4) {
    return { rarityLabel: 'かなり狭い：全部そろうとめったにいないイメージ', rarityTone: 'mythic' };
  }
  if (pq < 1e-3) {
    return { rarityLabel: 'ハイスペ寄り（この診断の目安）', rarityTone: 'rare' };
  }
  if (pq < 0.05) {
    return { rarityLabel: '条件はキツめでも「あり得る」側の帯', rarityTone: 'rare' };
  }
  if (pq < 0.15) {
    return { rarityLabel: '条件を足すと、だいぶ絞られるイメージ', rarityTone: 'narrow' };
  }
  return {
    rarityLabel: 'この診断だと、めずらしすぎない組み合わせ',
    rarityTone: 'reasonable',
  };
}

/** スライダー値を「平均50・幅10」くらいの釣り合いで見て、「その数以上がどれくらいいそうか」。 */
export function ratioFromTraitDeviation(deviation: number): number {
  const d = clampDeviation(deviation);
  return tailRatioNormal(d, TRAIT_DEV_MEAN, TRAIT_DEV_SD);
}

function perFactorEquivalentRatio(finalRatio: number, enabledFactorCount: number): number {
  const n = Math.max(1, enabledFactorCount);
  const clampedJoint = clamp(finalRatio, 1e-200, 1 - 1e-15);
  return Math.pow(clampedJoint, 1 / n);
}

export function modelTierShortJapanese(deviation: number): string {
  const d = clampDeviation(deviation);
  const pGe = ratioFromTraitDeviation(d);
  if (pGe >= 0.35 && pGe <= 0.65) {
    return '中央付近';
  }
  if (d >= TRAIT_DEV_MEAN) {
    return `約上位 ${formatTierPercentPiece(pGe * 100)}`;
  }
  const pLo = (1 - pGe) * 100;
  return `約下位 ${formatTierPercentPiece(pLo)}`;
}

function formatTierPercentPiece(x: number): string {
  if (x >= 10) {
    return `${x.toFixed(0)}%`;
  }
  if (x >= 1) {
    return `${x.toFixed(1)}%`;
  }
  if (x >= 0.1) {
    return `${x.toFixed(2)}%`;
  }
  return `${x.toPrecision(2)}%`;
}

/** 身長偏差値から目安 cm（表示用）。スライダーと身長の平均・幅をつなぐ。 */
export function approximateHeightCmFromDeviation(deviation: number, gender: Gender): number {
  const d = clampDeviation(deviation);
  const z = (d - TRAIT_DEV_MEAN) / TRAIT_DEV_SD;
  const mean = gender === 'male' ? HEIGHT_MALE_MEAN_CM : HEIGHT_FEMALE_MEAN_CM;
  const sd = gender === 'male' ? HEIGHT_MALE_SD_CM : HEIGHT_FEMALE_SD_CM;
  return mean + z * sd;
}

/** スライダーから IQ の雰囲気（平均100・ばらつき15 くらい）を出す。 */
export function approximateIqFromDeviation(deviation: number): number {
  const d = clampDeviation(deviation);
  const z = (d - TRAIT_DEV_MEAN) / TRAIT_DEV_SD;
  return IQ_POP_MEAN + IQ_POP_SD * z;
}

/**
 * 表示用「生まれた星偏差値」。各モジュールの比を掛けた積 p は因子が増えるほど極端に小さくなるため、
 * 独立近似の下で p^(1/n) を「典型的な一因子あたりの尾イメージ」に写像してから z を取る。
 * 各因子が中央（尾～0.5）なら出力が～50付近に寄る。
 */
export function geneticDeviationFromRatio(finalRatio: number, enabledFactorCount: number): number {
  const perFactorEquivalent = perFactorEquivalentRatio(finalRatio, enabledFactorCount);
  const p = clamp(perFactorEquivalent, 1e-15, 1 - 1e-15);
  const z = inverseStandardNormal(1 - p);
  const raw = 50 + 10 * z;
  return clamp(raw, 15, 92);
}

export function estimateGeneticStrength(input: GeneticInput): GeneticEstimationResult {
  const genderLabelJp = genderLabel(input.gender);
  const steps: GeneticStep[] = [
    {
      id: 'base',
      label: `ベース（${genderLabelJp}・星モジュールを順に掛け合わせ）`,
      ratio: 1,
      remaining: 1,
      note: '項目どうしのつながりは見ず、バラバラに割合だけを掛けていきます。',
    },
  ];

  if (input.enabled.face) {
    const d = clampDeviation(input.faceDeviation);
    const ratio = ratioFromTraitDeviation(d);
    appendStep(
      steps,
      'face',
      `顔：偏差値 ${d} 以上のライン`,
      ratio,
      `「ここまで立っている人がどれくらいいそうか」の割合として掛けます。`,
    );
  }

  if (input.enabled.height) {
    const d = clampDeviation(input.heightDeviation);
    const mean = input.gender === 'male' ? HEIGHT_MALE_MEAN_CM : HEIGHT_FEMALE_MEAN_CM;
    const sd = input.gender === 'male' ? HEIGHT_MALE_SD_CM : HEIGHT_FEMALE_SD_CM;
    const thresholdCm = approximateHeightCmFromDeviation(d, input.gender);
    const ratio = tailRatioNormal(thresholdCm, mean, sd);
    appendStep(
      steps,
      'height',
      `身長：偏差値 ${d}（目安 ${thresholdCm.toFixed(1)} cm・${genderLabelJp}）`,
      ratio,
      `スライダーを身長の目安に置き換え、「その身長以上がどれくらいいそうか」の割合です（平均おおよそ ${mean}cm・幅 ${sd}cm くらいと仮定）。`,
    );
  }

  if (input.enabled.physique) {
    const d = clampDeviation(input.physiqueDeviation);
    const ratio = ratioFromTraitDeviation(d);
    appendStep(
      steps,
      'physique',
      `体格：偏差値 ${d} 以上`,
      ratio,
      `骨格・筋肉の印象を、他の項目と同じ目安のスライダーでざっくり数えています。`,
    );
  }

  if (input.enabled.athletic) {
    const d = clampDeviation(input.athleticDeviation);
    const ratio = ratioFromTraitDeviation(d);
    appendStep(
      steps,
      'athletic',
      `運動神経：偏差値 ${d} 以上`,
      ratio,
      `協調・瞬発などの生素質イメージを、他と同じ尺でざっくり数えています。`,
    );
  }

  if (input.enabled.voiceAura) {
    const d = clampDeviation(input.voiceAuraDeviation);
    const ratio = ratioFromTraitDeviation(d);
    appendStep(
      steps,
      'voiceAura',
      `声：偏差値 ${d} 以上`,
      ratio,
      `聞き手の主観が大きいので、他の項目と同じざっくり仮定にそろえています。`,
    );
  }

  if (input.enabled.iq) {
    const d = clampDeviation(input.iqDeviation);
    const iqLine = approximateIqFromDeviation(d);
    const ratio = tailRatioNormal(iqLine, IQ_POP_MEAN, IQ_POP_SD);
    appendStep(
      steps,
      'iq',
      `IQ：目安 ${iqLine.toFixed(0)} 以上`,
      ratio,
      `スライダーから IQ の雰囲気を出し、「そのくらい以上がどれくらいいそうか」の割合です。本物の検査や診断ではありません。`,
    );
  }

  if (input.enabled.age) {
    const option = getSceneAgeOption(input.sceneAgeId);
    const ratio = ratioFromPulldownDeviation(option.displayDeviation);
    appendStep(
      steps,
      'age',
      `年齢帯：${option.label}（偏差値 ${option.displayDeviation}）`,
      ratio,
      `${option.note} 表示の偏差値 ${option.displayDeviation} と同じ掛かり方です。`,
    );
  }

  if (input.enabled.familyWealth) {
    const option = getFamilyWealthOption(input.familyWealthId);
    const ratio = ratioFromPulldownDeviation(option.displayDeviation);
    appendStep(
      steps,
      'familyWealth',
      `実家の太さ：${option.label}（偏差値 ${option.displayDeviation}）`,
      ratio,
      `${option.note} 表示の偏差値 ${option.displayDeviation} と同じ掛かり方です。`,
    );
  }

  if (input.enabled.birthRegion) {
    const option = getBirthRegionOption(input.birthRegionId);
    const ratio = ratioFromPulldownDeviation(option.displayDeviation);
    appendStep(
      steps,
      'birthRegion',
      `地域：${option.label}（偏差値 ${option.displayDeviation}）`,
      ratio,
      `${option.note} 表示の偏差値 ${option.displayDeviation} と同じ掛かり方です。`,
    );
  }

  const finalRatio = steps[steps.length - 1]!.remaining;
  const enabledFactorCount = steps.length - 1;
  const geneticDeviation =
    enabledFactorCount <= 0
      ? 50
      : geneticDeviationFromRatio(finalRatio, enabledFactorCount);
  const perFactorEq =
    enabledFactorCount <= 0 ? 0.5 : perFactorEquivalentRatio(finalRatio, enabledFactorCount);
  const rarity = rarityFromPerFactorEquivalent(perFactorEq);

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

  const formatFixed = (digits: number) =>
    percent
      .toFixed(digits)
      .replace(/\.?0+$/, '');

  if (percent < 0.000001) {
    return '< 0.000001%';
  }
  if (percent < 0.0001) {
    return `${formatFixed(6)}%`;
  }
  if (percent < 0.01) {
    return `${formatFixed(4)}%`;
  }
  if (percent < 1) {
    return `${formatFixed(3)}%`;
  }
  return `${formatFixed(2)}%`;
}

export function logDropContribution(ratio: number): number {
  if (ratio <= 0) {
    return 0;
  }
  return -Math.log10(ratio);
}
