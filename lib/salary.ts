/** 2026년 기준 급여 공제 계산 (간이세액표 기반) */

import { TAX_TABLE } from "./tax-table";

export interface SalaryInput {
  /** 연봉 (원) */
  annualSalary: number;
  /** 비과세액 (월, 원) - 식대 등 */
  monthlyNonTaxable: number;
  /** 부양가족 수 (본인 포함) */
  dependents: number;
  /** 8세 이상 20세 이하 자녀 수 */
  childrenUnder20: number;
}

export interface DeductionDetail {
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  incomeTax: number;
  localIncomeTax: number;
}

export interface SalaryResult {
  monthlySalary: number;
  monthlyTaxable: number;
  deductions: DeductionDetail;
  totalDeduction: number;
  netSalary: number;
}

// 4대보험 요율 (2026년 기준, 근로자 부담분)
const RATES = {
  nationalPension: 0.0475, // 국민연금 4.75%
  healthInsurance: 0.03595, // 건강보험 3.595%
  longTermCareRate: 0.1314, // 장기요양보험 = 건강보험료 × 13.14%
  employmentInsurance: 0.009, // 고용보험 0.9%
};

// 국민연금 상한/하한 (2025.7~2026.6 기준 월 기준소득월액)
const PENSION_MIN = 400_000;
const PENSION_MAX = 6_370_000;

/**
 * 간이세액표 룩업으로 소득세 계산
 * 월급여액(천원 단위)과 공제대상가족 수로 테이블에서 조회
 */
function lookupTaxFromTable(
  monthlyTaxableKW: number,
  dependents: number,
): number {
  // 가족 수 인덱스 (1~11, 테이블 컬럼 index 2~12)
  const famIdx = Math.min(Math.max(dependents, 1), 11);
  const colIdx = famIdx - 1 + 2; // 테이블 배열에서의 인덱스

  // 테이블 범위 내 (770천원 ~ 10,000천원) 룩업
  for (const row of TAX_TABLE) {
    if (monthlyTaxableKW >= row[0] && monthlyTaxableKW < row[1]) {
      return row[colIdx];
    }
  }

  // 테이블 범위 미만 → 세액 0
  if (monthlyTaxableKW < 770) return 0;

  // 10,000천원 이상 → 초과 구간 공식 적용
  // 10,000천원인 경우의 해당 세액 (테이블 마지막 행 기준이 아닌 별도 값)
  const baseTax = getBase10000Tax(famIdx);
  const excess = (monthlyTaxableKW - 10_000) * 1_000; // 초과분 (원)

  if (monthlyTaxableKW <= 14_000) {
    // (10,000천원 세액) + (초과금액 × 98% × 35%) + 25,000원
    return baseTax + Math.floor(excess * 0.98 * 0.35) + 25_000;
  } else if (monthlyTaxableKW <= 28_000) {
    // (10,000천원 세액) + 1,397,000원 + (14,000천원 초과금액 × 98% × 38%)
    const excess14 = (monthlyTaxableKW - 14_000) * 1_000;
    return baseTax + 1_397_000 + Math.floor(excess14 * 0.98 * 0.38);
  } else if (monthlyTaxableKW <= 30_000) {
    // (10,000천원 세액) + 6,610,600원 + (28,000천원 초과금액 × 98% × 40%)
    const excess28 = (monthlyTaxableKW - 28_000) * 1_000;
    return baseTax + 6_610_600 + Math.floor(excess28 * 0.98 * 0.40);
  } else if (monthlyTaxableKW <= 45_000) {
    // (10,000천원 세액) + 7,394,600원 + (30,000천원 초과금액 × 40%)
    const excess30 = (monthlyTaxableKW - 30_000) * 1_000;
    return baseTax + 7_394_600 + Math.floor(excess30 * 0.40);
  } else if (monthlyTaxableKW <= 87_000) {
    // (10,000천원 세액) + 13,394,600원 + (45,000천원 초과금액 × 42%)
    const excess45 = (monthlyTaxableKW - 45_000) * 1_000;
    return baseTax + 13_394_600 + Math.floor(excess45 * 0.42);
  } else {
    // (10,000천원 세액) + 31,034,600원 + (87,000천원 초과금액 × 45%)
    const excess87 = (monthlyTaxableKW - 87_000) * 1_000;
    return baseTax + 31_034_600 + Math.floor(excess87 * 0.45);
  }
}

/** 10,000천원인 경우의 가족 수별 세액 (간이세액표 마지막 고정행) */
function getBase10000Tax(dependents: number): number {
  const base = [
    1_507_400, 1_431_570, 1_200_840, 1_170_840, 1_140_840,
    1_110_840, 1_080_840, 1_050_840, 1_020_840, 990_840, 960_840,
  ];
  const idx = Math.min(Math.max(dependents, 1), 11) - 1;
  return base[idx];
}

/**
 * 간이세액표 기반 소득세 계산
 * - 테이블 룩업 후 자녀세액공제 적용
 * - 가족 수 11명 초과 시 별도 공식 적용
 */
function calculateIncomeTax(
  monthlyTaxable: number,
  dependents: number,
  childrenUnder20: number,
): number {
  if (monthlyTaxable <= 0) return 0;

  // 월급여액을 천원 단위로 변환 (천원 미만 절사)
  const monthlyTaxableKW = Math.floor(monthlyTaxable / 1_000);

  let tax: number;

  if (dependents <= 11) {
    tax = lookupTaxFromTable(monthlyTaxableKW, dependents);
  } else {
    // 11명 초과: (11명 세액) - (10명 세액 - 11명 세액) × 초과 가족 수
    const tax11 = lookupTaxFromTable(monthlyTaxableKW, 11);
    const tax10 = lookupTaxFromTable(monthlyTaxableKW, 10);
    const diff = tax10 - tax11;
    tax = tax11 - diff * (dependents - 11);
  }

  // 8세 이상 20세 이하 자녀 공제
  if (childrenUnder20 >= 1) {
    let childDeduction = 0;
    if (childrenUnder20 === 1) {
      childDeduction = 20_830;
    } else if (childrenUnder20 === 2) {
      childDeduction = 45_830;
    } else {
      childDeduction = 45_830 + (childrenUnder20 - 2) * 33_330;
    }
    tax -= childDeduction;
  }

  return Math.max(tax, 0);
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  const { annualSalary, monthlyNonTaxable, dependents, childrenUnder20 } = input;

  const monthlySalary = Math.floor(annualSalary / 12);
  const monthlyTaxable = Math.max(monthlySalary - monthlyNonTaxable, 0);

  // 국민연금 (기준소득월액 상한/하한 적용)
  const pensionBase = Math.min(Math.max(monthlyTaxable, PENSION_MIN), PENSION_MAX);
  const nationalPension =
    monthlyTaxable > 0 ? Math.floor(pensionBase * RATES.nationalPension / 10) * 10 : 0;

  // 건강보험
  const healthInsurance = Math.floor(monthlyTaxable * RATES.healthInsurance / 10) * 10;

  // 장기요양보험
  const longTermCare = Math.floor(healthInsurance * RATES.longTermCareRate / 10) * 10;

  // 고용보험
  const employmentInsurance = Math.floor(monthlyTaxable * RATES.employmentInsurance / 10) * 10;

  // 소득세
  const incomeTax = calculateIncomeTax(monthlyTaxable, dependents, childrenUnder20);

  // 지방소득세 (소득세의 10%)
  const localIncomeTax = Math.floor(incomeTax * 0.1);

  const deductions: DeductionDetail = {
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTax,
    localIncomeTax,
  };

  const totalDeduction =
    nationalPension +
    healthInsurance +
    longTermCare +
    employmentInsurance +
    incomeTax +
    localIncomeTax;

  const netSalary = monthlySalary - totalDeduction;

  return {
    monthlySalary,
    monthlyTaxable,
    deductions,
    totalDeduction,
    netSalary,
  };
}
