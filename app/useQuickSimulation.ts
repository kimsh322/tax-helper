import { useState } from "react";
import { calculateSalary } from "@/lib/salary";
import { calculateRefund } from "@/lib/refund";
import { formatNumber, parseInputNumber } from "@/lib/format";

export interface QuickResult {
  monthlySalary: number;
  netSalary: number;
  totalDeduction: number;
  refundAmount: number;
  isRefund: boolean;
  refundLink: string;
  salaryLink: string;
}

export function useQuickSimulation() {
  const [salary, setSalary] = useState("");
  const [result, setResult] = useState<QuickResult | null>(null);

  function handleSalaryChange(rawValue: string) {
    const raw = parseInputNumber(rawValue);
    setSalary(raw > 0 ? formatNumber(raw) : "");
  }

  function handleCalculate() {
    const annual = parseInputNumber(salary);
    if (annual <= 0) return;

    const salaryResult = calculateSalary({
      annualSalary: annual,
      monthlyNonTaxable: 200_000,
      dependents: 1,
      childrenUnder20: 0,
    });

    const d = salaryResult.deductions;
    const annualPension = d.nationalPension * 12;
    const annualHealth = (d.healthInsurance + d.longTermCare) * 12;
    const annualEmployment = d.employmentInsurance * 12;
    const annualPrepaid = d.incomeTax * 12;

    const refundResult = calculateRefund({
      totalSalary: annual,
      dependents: 1,
      disabled: 0,
      singleParent: 0,
      womanDeduction: 0,
      seniorCount: 0,
      prepaidTax: annualPrepaid,
      nationalPension: annualPension,
      healthInsurance: annualHealth,
      employmentInsurance: annualEmployment,
      housingRentLoan: 0,
      housingMortgage: 0,
      creditCardDeduction: 0,
      otherIncomeDeduction: 0,
      medicalSelf: 0,
      medicalOther: 0,
      educationSelf: 0,
      educationChild: 0,
      educationUniv: 0,
      insurancePremium: 0,
      disabledInsurance: 0,
      donationCredit: 0,
      smeReduction: false,
      smeReductionRate: 0,
      monthlyRent: 0,
      pensionAccount: 0,
      irpSavings: 0,
      childCount: 0,
      marriageCredit: 0,
      otherTaxCredit: 0,
    });

    const params = new URLSearchParams({
      salary: String(annual),
      pension: String(annualPension),
      health: String(annualHealth),
      employment: String(annualEmployment),
      prepaid: String(annualPrepaid),
      dependents: "1",
    });

    setResult({
      monthlySalary: salaryResult.monthlySalary,
      netSalary: salaryResult.netSalary,
      totalDeduction: salaryResult.totalDeduction,
      refundAmount: refundResult.totalDiff,
      isRefund: refundResult.isRefund,
      refundLink: `/refund?${params.toString()}`,
      salaryLink: `/calculator?salary=${annual}`,
    });
  }

  return { salary, result, handleSalaryChange, handleCalculate };
}
