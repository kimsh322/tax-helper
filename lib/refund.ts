/** 연말정산 환급액 계산 (2024년 귀속) */

export interface RefundInput {
  /** 총급여 (원) */
  totalSalary: number;
  /** 부양가족 수 (본인 포함) */
  dependents: number;
  /** 장애인 수 */
  disabled: number;
  /** 한부모 (0 or 1) */
  singleParent: number;
  /** 부녀자 (0 or 1) */
  womanDeduction: number;
  /** 경로우대 (70세 이상) 수 */
  seniorCount: number;
  /** 기납부세액 (원천징수된 소득세) */
  prepaidTax: number;

  // 소득공제
  /** 국민연금 보험료 (연간) */
  nationalPension: number;
  /** 건강보험료 (연간, 장기요양 포함) */
  healthInsurance: number;
  /** 고용보험료 (연간) */
  employmentInsurance: number;
  /** 주택임차차입금 원리금상환액 (연간) */
  housingRentLoan: number;
  /** 장기주택저당차입금 이자상환액 (연간) */
  housingMortgage: number;
  /** 신용카드 등 소득공제액 (홈택스 확인값) */
  creditCardDeduction: number;
  /** 기타 소득공제 */
  otherIncomeDeduction: number;

  // 세액공제
  /** 의료비 - 본인/경로/장애 (전액 공제 대상) */
  medicalSelf: number;
  /** 기타 의료비 (연 700만 한도) */
  medicalOther: number;
  /** 교육비 - 본인 (전액) */
  educationSelf: number;
  /** 교육비 - 유치원~고등학교 (연 300만 한도) */
  educationChild: number;
  /** 교육비 - 대학생 (연 900만 한도) */
  educationUniv: number;
  /** 보장성보험료 (연 100만 한도) */
  insurancePremium: number;
  /** 장애인 보장성보험료 (연 100만 한도) */
  disabledInsurance: number;
  /** 기부금 세액공제 (최종 공제액) */
  donationCredit: number;
  /** 중소기업 취업자 소득세 감면 여부 */
  smeReduction: boolean;
  /** 중소기업 감면율 (0.7 or 0.9 or 1.0) */
  smeReductionRate: number;
  /** 월세 연간 지급액 */
  monthlyRent: number;
  /** 연금계좌 세액공제 (퇴직연금 등) */
  pensionAccount: number;
  /** IRP/연금저축 세액공제 */
  irpSavings: number;
  /** 자녀 수 (자녀세액공제 대상) */
  childCount: number;
  /** 결혼세액공제 (0 or 100만) */
  marriageCredit: number;
  /** 기타 세액공제 */
  otherTaxCredit: number;
}

export interface RefundResult {
  // 소득공제 내역
  earnedIncomeDeduction: number;
  earnedIncome: number;
  personalDeduction: number;
  insuranceDeductionTotal: number;
  housingDeduction: number;
  creditCardDeduction: number;
  otherIncomeDeduction: number;
  totalIncomeDeduction: number;
  taxableIncome: number;

  // 세액 내역
  calculatedTax: number;
  specialTaxCredit: number;
  medicalCredit: number;
  educationCredit: number;
  insuranceCredit: number;
  donationCredit: number;
  useStandardCredit: boolean;
  standardCredit: number;
  smeReductionAmount: number;
  monthlyRentCredit: number;
  pensionCredit: number;
  childCredit: number;
  marriageCredit: number;
  earnedIncomeTaxCredit: number;
  otherTaxCredit: number;
  totalTaxCredit: number;
  determinedTax: number;
  prepaidTax: number;

  // 최종 결과
  incomeTaxDiff: number;
  localTaxDiff: number;
  totalDiff: number;
  isRefund: boolean;
}

/** 근로소득공제 (5단계 누진) */
export function calcEarnedIncomeDeduction(salary: number): number {
  if (salary <= 5_000_000) {
    return salary * 0.7;
  } else if (salary <= 15_000_000) {
    return 3_500_000 + (salary - 5_000_000) * 0.4;
  } else if (salary <= 45_000_000) {
    return 7_500_000 + (salary - 15_000_000) * 0.15;
  } else if (salary <= 100_000_000) {
    return 12_000_000 + (salary - 45_000_000) * 0.05;
  } else if (salary <= 362_500_000) {
    return 14_750_000 + (salary - 100_000_000) * 0.02;
  } else {
    return 20_000_000;
  }
}

/** 산출세액 (8단계 누진세율) */
export function calcCalculatedTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  if (taxableIncome <= 14_000_000) {
    return taxableIncome * 0.06;
  } else if (taxableIncome <= 50_000_000) {
    return 840_000 + (taxableIncome - 14_000_000) * 0.15;
  } else if (taxableIncome <= 88_000_000) {
    return 6_240_000 + (taxableIncome - 50_000_000) * 0.24;
  } else if (taxableIncome <= 150_000_000) {
    return 15_360_000 + (taxableIncome - 88_000_000) * 0.35;
  } else if (taxableIncome <= 300_000_000) {
    return 37_060_000 + (taxableIncome - 150_000_000) * 0.38;
  } else if (taxableIncome <= 500_000_000) {
    return 94_060_000 + (taxableIncome - 300_000_000) * 0.40;
  } else if (taxableIncome <= 1_000_000_000) {
    return 174_060_000 + (taxableIncome - 500_000_000) * 0.42;
  } else {
    return 384_060_000 + (taxableIncome - 1_000_000_000) * 0.45;
  }
}

/** 근로소득세액공제 */
export function calcEarnedIncomeTaxCredit(
  calculatedTax: number,
  totalSalary: number,
): number {
  let credit: number;
  if (calculatedTax <= 1_300_000) {
    credit = calculatedTax * 0.55;
  } else {
    credit = 715_000 + (calculatedTax - 1_300_000) * 0.3;
  }

  // 한도
  let limit: number;
  if (totalSalary <= 33_000_000) {
    limit = 740_000;
  } else if (totalSalary <= 70_000_000) {
    limit = 660_000;
  } else {
    limit = 500_000;
  }

  return Math.min(Math.floor(credit), limit);
}

/** 자녀세액공제 */
export function calcChildCredit(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 150_000;
  if (count === 2) return 350_000;
  // 3명 이상: 35만 + (count - 2) × 30만
  return 350_000 + (count - 2) * 300_000;
}

/** 의료비 세액공제 */
function calcMedicalCredit(
  medicalSelf: number,
  medicalOther: number,
  totalSalary: number,
): number {
  const threshold = totalSalary * 0.03;

  // 본인/경로/장애 의료비는 한도 없음, 기타는 연 700만 한도
  const cappedOther = Math.min(medicalOther, 7_000_000);
  const totalMedical = medicalSelf + cappedOther;

  const deductible = Math.max(totalMedical - threshold, 0);
  return Math.floor(deductible * 0.15);
}

/** 교육비 세액공제 */
function calcEducationCredit(
  educationSelf: number,
  educationChild: number,
  educationUniv: number,
): number {
  // 본인: 한도 없음, 유치원~고교: 300만 한도, 대학: 900만 한도
  const cappedChild = Math.min(educationChild, 3_000_000);
  const cappedUniv = Math.min(educationUniv, 9_000_000);
  return Math.floor((educationSelf + cappedChild + cappedUniv) * 0.15);
}

/** 보험료 세액공제 */
function calcInsuranceCredit(
  insurancePremium: number,
  disabledInsurance: number,
): number {
  const capped = Math.min(insurancePremium, 1_000_000);
  const cappedDisabled = Math.min(disabledInsurance, 1_000_000);
  return Math.floor(capped * 0.12 + cappedDisabled * 0.15);
}

/** 월세 세액공제 (총급여 8천만 이하) */
function calcMonthlyRentCredit(
  monthlyRent: number,
  totalSalary: number,
): number {
  if (totalSalary > 80_000_000 || monthlyRent <= 0) return 0;
  const capped = Math.min(monthlyRent, 10_000_000);

  let rate: number;
  if (totalSalary <= 55_000_000) {
    rate = 0.17;
  } else {
    rate = 0.15;
  }
  return Math.floor(capped * rate);
}

/** 연금계좌 세액공제 */
function calcPensionCredit(
  pensionAccount: number,
  irpSavings: number,
  totalSalary: number,
): number {
  // 총급여 5,500만 이하 15%, 초과 12%
  const rate = totalSalary <= 55_000_000 ? 0.15 : 0.12;
  // 연금저축 한도 600만, 합계 한도 900만 (총급여 1.2억 이하 기준)
  const totalLimit = totalSalary <= 120_000_000 ? 9_000_000 : 9_000_000;
  const irpCapped = Math.min(irpSavings, 6_000_000);
  const total = Math.min(pensionAccount + irpCapped, totalLimit);
  return Math.floor(total * rate);
}

/** 10원 미만 버림 */
function roundDown10(value: number): number {
  return Math.trunc(value / 10) * 10;
}

/** 메인 계산 함수 */
export function calculateRefund(input: RefundInput): RefundResult {
  // 1. 근로소득공제 → 근로소득금액
  const earnedIncomeDeduction = Math.floor(
    calcEarnedIncomeDeduction(input.totalSalary),
  );
  const earnedIncome = input.totalSalary - earnedIncomeDeduction;

  // 2. 인적공제
  const personalDeduction =
    input.dependents * 1_500_000 +
    input.disabled * 2_000_000 +
    input.singleParent * 1_000_000 +
    input.womanDeduction * 500_000 +
    input.seniorCount * 1_000_000;

  // 3. 보험료 소득공제 (국민연금 + 건강보험 + 고용보험 — 전액 공제)
  const insuranceDeductionTotal =
    input.nationalPension + input.healthInsurance + input.employmentInsurance;

  // 4. 주택공제 = MIN(2000만, MIN(400만, 주택임차×40%) + MIN(2000만, 장기주택))
  const housingRentDeduction = Math.min(
    4_000_000,
    Math.floor(input.housingRentLoan * 0.4),
  );
  const housingMortgageDeduction = Math.min(
    20_000_000,
    input.housingMortgage,
  );
  const housingDeduction = Math.min(
    20_000_000,
    housingRentDeduction + housingMortgageDeduction,
  );

  // 5. 신용카드 + 기타 소득공제
  const creditCardDeduction = input.creditCardDeduction;
  const otherIncomeDeduction = input.otherIncomeDeduction;

  // 공제 합계
  const totalIncomeDeduction =
    personalDeduction +
    insuranceDeductionTotal +
    housingDeduction +
    creditCardDeduction +
    otherIncomeDeduction;

  // 6. 과세표준
  const taxableIncome = Math.max(0, earnedIncome - totalIncomeDeduction);

  // 7. 산출세액
  const calculatedTax = Math.floor(calcCalculatedTax(taxableIncome));

  // 8. 특별세액공제 (의료비, 교육비, 보험료, 기부금)
  const medicalCredit = calcMedicalCredit(
    input.medicalSelf,
    input.medicalOther,
    input.totalSalary,
  );
  const educationCredit = calcEducationCredit(
    input.educationSelf,
    input.educationChild,
    input.educationUniv,
  );
  const insuranceCredit = calcInsuranceCredit(
    input.insurancePremium,
    input.disabledInsurance,
  );
  const donationCredit = input.donationCredit;

  const specialTotal =
    medicalCredit + educationCredit + insuranceCredit + donationCredit;

  // 합계 < 13만이면 표준세액공제 13만 적용
  const useStandardCredit = specialTotal < 130_000;
  const specialTaxCredit = useStandardCredit ? 0 : specialTotal;
  const standardCredit = useStandardCredit ? 130_000 : 0;

  // 9. 추가 세액공제
  const smeReductionAmount =
    input.smeReduction
      ? Math.floor(calculatedTax * input.smeReductionRate)
      : 0;

  const monthlyRentCredit = calcMonthlyRentCredit(
    input.monthlyRent,
    input.totalSalary,
  );

  const pensionCredit = calcPensionCredit(
    input.pensionAccount,
    input.irpSavings,
    input.totalSalary,
  );

  const childCredit = calcChildCredit(input.childCount);
  const marriageCredit = input.marriageCredit;

  const earnedIncomeTaxCredit = calcEarnedIncomeTaxCredit(
    calculatedTax,
    input.totalSalary,
  );

  const otherTaxCredit = input.otherTaxCredit;

  // 세액공제 합계
  const totalTaxCredit =
    specialTaxCredit +
    standardCredit +
    smeReductionAmount +
    monthlyRentCredit +
    pensionCredit +
    childCredit +
    marriageCredit +
    earnedIncomeTaxCredit +
    otherTaxCredit;

  // 10. 결정세액
  const determinedTax = Math.max(0, calculatedTax - totalTaxCredit);

  // 11. 차감소득세 (10원 미만 버림)
  const incomeTaxDiff = roundDown10(determinedTax - input.prepaidTax);

  // 12. 차감주민세 (10원 미만 버림)
  const localTaxDiff = roundDown10(incomeTaxDiff * 0.1);

  const totalDiff = incomeTaxDiff + localTaxDiff;

  return {
    earnedIncomeDeduction,
    earnedIncome,
    personalDeduction,
    insuranceDeductionTotal,
    housingDeduction,
    creditCardDeduction,
    otherIncomeDeduction,
    totalIncomeDeduction,
    taxableIncome,
    calculatedTax,
    specialTaxCredit,
    medicalCredit,
    educationCredit,
    insuranceCredit,
    donationCredit,
    useStandardCredit,
    standardCredit,
    smeReductionAmount,
    monthlyRentCredit,
    pensionCredit,
    childCredit,
    marriageCredit,
    earnedIncomeTaxCredit,
    otherTaxCredit,
    totalTaxCredit,
    determinedTax,
    prepaidTax: input.prepaidTax,
    incomeTaxDiff,
    localTaxDiff,
    totalDiff,
    isRefund: totalDiff < 0,
  };
}
