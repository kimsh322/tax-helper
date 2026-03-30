import { useState } from "react";
import { calculateSalary, type SalaryResult } from "@/lib/salary";
import { formatNumber, parseInputNumber } from "@/lib/format";

function getInitialState(searchParams: URLSearchParams) {
  const salaryParam = searchParams.get("salary");
  const salary = salaryParam ? Number(salaryParam) : 0;

  if (salary > 0) {
    const res = calculateSalary({
      annualSalary: salary,
      monthlyNonTaxable: 200_000,
      dependents: 1,
      childrenUnder20: 0,
    });
    return { annualSalary: formatNumber(salary), result: res };
  }

  return { annualSalary: "", result: null as SalaryResult | null };
}

export function useSalaryCalculator(searchParams: URLSearchParams) {
  const initial = getInitialState(searchParams);
  const [annualSalary, setAnnualSalary] = useState(initial.annualSalary);
  const [nonTaxable, setNonTaxable] = useState("200000");
  const [dependents, setDependents] = useState(1);
  const [childrenUnder20, setChildrenUnder20] = useState(0);
  const [result, setResult] = useState<SalaryResult | null>(initial.result);

  function handleAnnualSalaryChange(rawValue: string) {
    const raw = parseInputNumber(rawValue);
    setAnnualSalary(raw > 0 ? formatNumber(raw) : "");
  }

  function handleNonTaxableChange(rawValue: string) {
    const raw = parseInputNumber(rawValue);
    setNonTaxable(raw > 0 ? formatNumber(raw) : rawValue === "" ? "" : "0");
  }

  function handleCalculate() {
    const salary = parseInputNumber(annualSalary);
    if (salary <= 0) return;

    const res = calculateSalary({
      annualSalary: salary,
      monthlyNonTaxable: parseInputNumber(nonTaxable),
      dependents,
      childrenUnder20,
    });
    setResult(res);
  }

  function buildRefundLink(): string {
    if (!result) return "/refund";
    const salary = parseInputNumber(annualSalary);
    const params = new URLSearchParams({
      salary: String(salary),
      pension: String(result.deductions.nationalPension * 12),
      health: String((result.deductions.healthInsurance + result.deductions.longTermCare) * 12),
      employment: String(result.deductions.employmentInsurance * 12),
      prepaid: String(result.deductions.incomeTax * 12),
      dependents: String(dependents),
    });
    return `/refund?${params.toString()}`;
  }

  return {
    annualSalary,
    nonTaxable,
    dependents,
    childrenUnder20,
    result,
    setDependents,
    setChildrenUnder20,
    handleAnnualSalaryChange,
    handleNonTaxableChange,
    handleCalculate,
    buildRefundLink,
  };
}
