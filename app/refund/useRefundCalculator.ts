import { useReducer, useState } from "react";
import { calculateRefund, type RefundInput, type RefundResult } from "@/lib/refund";
import { formatNumber, parseInputNumber } from "@/lib/format";

export interface FormState {
  totalSalary: string;
  dependents: number;
  disabled: number;
  singleParent: number;
  womanDeduction: number;
  seniorCount: number;
  prepaidTax: string;

  nationalPension: string;
  healthInsurance: string;
  employmentInsurance: string;
  housingRentLoan: string;
  housingMortgage: string;
  creditCardDeduction: string;
  otherIncomeDeduction: string;

  medicalSelf: string;
  medicalOther: string;
  educationSelf: string;
  educationChild: string;
  educationUniv: string;
  insurancePremium: string;
  disabledInsurance: string;
  donationCredit: string;
  smeReduction: boolean;
  smeReductionRate: number;
  monthlyRent: string;
  pensionAccount: string;
  irpSavings: string;
  childCount: number;
  marriageCredit: number;
  otherTaxCredit: string;
}

const initialState: FormState = {
  totalSalary: "",
  dependents: 1,
  disabled: 0,
  singleParent: 0,
  womanDeduction: 0,
  seniorCount: 0,
  prepaidTax: "",
  nationalPension: "",
  healthInsurance: "",
  employmentInsurance: "",
  housingRentLoan: "",
  housingMortgage: "",
  creditCardDeduction: "",
  otherIncomeDeduction: "",
  medicalSelf: "",
  medicalOther: "",
  educationSelf: "",
  educationChild: "",
  educationUniv: "",
  insurancePremium: "",
  disabledInsurance: "",
  donationCredit: "",
  smeReduction: false,
  smeReductionRate: 0.7,
  monthlyRent: "",
  pensionAccount: "",
  irpSavings: "",
  childCount: 0,
  marriageCredit: 0,
  otherTaxCredit: "",
};

type Action = { type: "update"; payload: Partial<FormState> };

function reducer(state: FormState, action: Action): FormState {
  return { ...state, ...action.payload };
}

function getInitialFormState(searchParams: URLSearchParams): FormState {
  const salary = searchParams.get("salary");
  if (!salary) return initialState;

  const fmt = (v: string | null) =>
    v && Number(v) > 0 ? formatNumber(Number(v)) : "";

  return {
    ...initialState,
    totalSalary: fmt(salary),
    nationalPension: fmt(searchParams.get("pension")),
    healthInsurance: fmt(searchParams.get("health")),
    employmentInsurance: fmt(searchParams.get("employment")),
    prepaidTax: fmt(searchParams.get("prepaid")),
    dependents: Number(searchParams.get("dependents")) || 1,
  };
}

export function useRefundCalculator(searchParams: URLSearchParams) {
  const [state, dispatch] = useReducer(reducer, searchParams, getInitialFormState);
  const [openSections, setOpenSections] = useState<Set<number>>(
    () => new Set([1, 2, 3]),
  );
  const [result, setResult] = useState<RefundResult | null>(null);

  function update(payload: Partial<FormState>) {
    dispatch({ type: "update", payload });
  }

  function toggleSection(n: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }

  function handleCalculate() {
    const salary = parseInputNumber(state.totalSalary);
    if (salary <= 0) return;

    const input: RefundInput = {
      totalSalary: salary,
      dependents: state.dependents,
      disabled: state.disabled,
      singleParent: state.singleParent,
      womanDeduction: state.womanDeduction,
      seniorCount: state.seniorCount,
      prepaidTax: parseInputNumber(state.prepaidTax),
      nationalPension: parseInputNumber(state.nationalPension),
      healthInsurance: parseInputNumber(state.healthInsurance),
      employmentInsurance: parseInputNumber(state.employmentInsurance),
      housingRentLoan: parseInputNumber(state.housingRentLoan),
      housingMortgage: parseInputNumber(state.housingMortgage),
      creditCardDeduction: parseInputNumber(state.creditCardDeduction),
      otherIncomeDeduction: parseInputNumber(state.otherIncomeDeduction),
      medicalSelf: parseInputNumber(state.medicalSelf),
      medicalOther: parseInputNumber(state.medicalOther),
      educationSelf: parseInputNumber(state.educationSelf),
      educationChild: parseInputNumber(state.educationChild),
      educationUniv: parseInputNumber(state.educationUniv),
      insurancePremium: parseInputNumber(state.insurancePremium),
      disabledInsurance: parseInputNumber(state.disabledInsurance),
      donationCredit: parseInputNumber(state.donationCredit),
      smeReduction: state.smeReduction,
      smeReductionRate: state.smeReductionRate,
      monthlyRent: parseInputNumber(state.monthlyRent),
      pensionAccount: parseInputNumber(state.pensionAccount),
      irpSavings: parseInputNumber(state.irpSavings),
      childCount: state.childCount,
      marriageCredit: state.marriageCredit,
      otherTaxCredit: parseInputNumber(state.otherTaxCredit),
    };

    setResult(calculateRefund(input));
  }

  const formatSummary = (v: string) =>
    parseInputNumber(v) > 0 ? `${formatNumber(parseInputNumber(v))}원` : "";

  return {
    state,
    update,
    openSections,
    toggleSection,
    result,
    handleCalculate,
    formatSummary,
  };
}
