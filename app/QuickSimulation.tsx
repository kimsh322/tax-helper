"use client";

import { useState } from "react";
import Link from "next/link";
import { calculateSalary } from "@/lib/salary";
import { calculateRefund } from "@/lib/refund";

function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}

function parseInputNumber(value: string): number {
  return Number(value.replace(/[^0-9]/g, "")) || 0;
}

interface QuickResult {
  monthlySalary: number;
  netSalary: number;
  totalDeduction: number;
  refundAmount: number;
  isRefund: boolean;
  refundLink: string;
  salaryLink: string;
}

export default function QuickSimulation() {
  const [salary, setSalary] = useState("");
  const [result, setResult] = useState<QuickResult | null>(null);

  function handleCalculate() {
    const annual = parseInputNumber(salary);
    if (annual <= 0) return;

    // 실수령액 계산 (부양가족 1명, 비과세 20만)
    const salaryResult = calculateSalary({
      annualSalary: annual,
      monthlyNonTaxable: 200_000,
      dependents: 1,
      childrenUnder20: 0,
    });

    // 환급액 계산 (기본공제만, 기납부세액 = 소득세×12)
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

  return (
    <div className="rounded-lg border border-ink/10 bg-surface/40 p-6">
      <p className="text-xs text-muted mb-3">연봉만 입력하면 바로 확인</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCalculate();
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          inputMode="numeric"
          value={salary}
          onChange={(e) => {
            const raw = parseInputNumber(e.target.value);
            setSalary(raw > 0 ? formatNumber(raw) : "");
          }}
          placeholder="연봉 입력 (예: 50,000,000)"
          className="w-full rounded-md border border-ink/15 bg-paper px-4 py-3 font-mono text-sm text-ink placeholder:text-muted/50 focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/10 sm:flex-1"
        />
        <button
          type="submit"
          className="w-full rounded-md bg-ink px-6 py-3 text-sm font-bold text-paper transition-colors hover:bg-ink/85 active:bg-ink/75 cursor-pointer sm:w-auto"
        >
          계산
        </button>
      </form>

      {result && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {/* 실수령액 카드 */}
          <Link
            href={result.salaryLink}
            className="group rounded-lg border border-ink/10 bg-paper p-5 transition-colors hover:border-ink/20"
          >
            <p className="text-xs text-muted mb-1">월 실수령액</p>
            <p className="font-mono text-2xl font-bold text-seal">
              {formatNumber(result.netSalary)}
              <span className="text-sm text-seal/60 ml-1">원</span>
            </p>
            <p className="mt-1 text-xs text-muted">
              월급 {formatNumber(result.monthlySalary)}원 − 공제 {formatNumber(result.totalDeduction)}원
            </p>
            <p className="mt-2 text-xs text-muted group-hover:text-ink transition-colors">
              자세히 계산하기 →
            </p>
          </Link>

          {/* 환급액 카드 */}
          <Link
            href={result.refundLink}
            className="group rounded-lg border border-ink/10 bg-paper p-5 transition-colors hover:border-ink/20"
          >
            <p className="text-xs text-muted mb-1">
              {result.isRefund ? "예상 환급액" : "예상 추가징수액"}
            </p>
            <p
              className={`font-mono text-2xl font-bold ${
                result.isRefund ? "text-accent" : "text-ink"
              }`}
            >
              {result.isRefund ? "−" : "+"}
              {formatNumber(Math.abs(result.refundAmount))}
              <span
                className={`text-sm ml-1 ${
                  result.isRefund ? "text-accent/60" : "text-ink/60"
                }`}
              >
                원
              </span>
            </p>
            <p className="mt-1 text-xs text-muted">
              기본공제만 적용한 추정치
            </p>
            <p className="mt-2 text-xs text-muted group-hover:text-ink transition-colors">
              공제 항목 추가하여 정확히 계산 →
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
