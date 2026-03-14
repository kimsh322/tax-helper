"use client";

import { useState } from "react";
import { calculateSalary, type SalaryResult } from "@/lib/salary";

function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}

function parseInputNumber(value: string): number {
  return Number(value.replace(/[^0-9]/g, "")) || 0;
}

export default function SalaryCalculator() {
  const [annualSalary, setAnnualSalary] = useState("");
  const [nonTaxable, setNonTaxable] = useState("200000");
  const [dependents, setDependents] = useState(1);
  const [childrenUnder20, setChildrenUnder20] = useState(0);
  const [result, setResult] = useState<SalaryResult | null>(null);

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

  return (
    <div className="space-y-8">
      {/* 입력 폼 */}
      <div className="rounded-lg border border-ink/10 bg-surface/40 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* 연봉 */}
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5">
              연봉 (원)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={annualSalary}
              onChange={(e) => {
                const raw = parseInputNumber(e.target.value);
                setAnnualSalary(raw > 0 ? formatNumber(raw) : "");
              }}
              placeholder="예: 50,000,000"
              className="w-full rounded-md border border-ink/15 bg-paper px-4 py-3 font-mono text-lg text-ink placeholder:text-muted/50 focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/10"
            />
          </div>

          {/* 비과세액 */}
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5">
              월 비과세액 (원)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={nonTaxable}
              onChange={(e) => {
                const raw = parseInputNumber(e.target.value);
                setNonTaxable(raw > 0 ? formatNumber(raw) : e.target.value === "" ? "" : "0");
              }}
              placeholder="식대 등 (기본 200,000)"
              className="w-full rounded-md border border-ink/15 bg-paper px-4 py-3 font-mono text-sm text-ink placeholder:text-muted/50 focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/10"
            />
            <p className="mt-1 text-xs text-muted">식대 월 20만원 비과세 등</p>
          </div>
        </div>

        {/* 소득세 관련 */}
        <div className="mt-5 border-t border-ink/10 pt-5">
          <p className="text-xs text-muted mb-4">소득세 계산용</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* 부양가족 수 */}
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                부양가족 수 (본인 포함)
              </label>
              <select
                value={dependents}
                onChange={(e) => setDependents(Number(e.target.value))}
                className="w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm text-ink focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/10"
              >
                {Array.from({ length: 11 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}명
                  </option>
                ))}
              </select>
            </div>

            {/* 20세 이하 자녀 수 */}
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                8세 이상 20세 이하 자녀 수
              </label>
              <select
                value={childrenUnder20}
                onChange={(e) => setChildrenUnder20(Number(e.target.value))}
                className="w-full rounded-md border border-ink/15 bg-paper px-4 py-3 text-sm text-ink focus:border-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/10"
              >
                {Array.from({ length: 8 }, (_, i) => i).map((n) => (
                  <option key={n} value={n}>
                    {n}명
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="mt-6 w-full rounded-md bg-ink py-3.5 text-sm font-bold text-paper transition-colors hover:bg-ink/85 active:bg-ink/75 cursor-pointer"
        >
          계산하기
        </button>
      </div>

      {/* 결과 */}
      {result && (
        <div className="space-y-6">
          {/* 실수령액 하이라이트 */}
          <div className="rounded-lg border-2 border-seal/30 bg-seal/5 p-6 text-center">
            <p className="text-sm text-muted mb-1">월 실수령액</p>
            <p className="font-mono text-4xl font-bold text-seal">
              {formatNumber(result.netSalary)}
              <span className="text-lg text-seal/60 ml-1">원</span>
            </p>
            <p className="mt-2 text-xs text-muted">
              월급 {formatNumber(result.monthlySalary)}원 −
              공제합계 {formatNumber(result.totalDeduction)}원
            </p>
          </div>

          {/* 공제 내역 테이블 */}
          <div className="rounded-lg border border-ink/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-ink/10 bg-surface/50">
                  <th className="px-4 py-3 text-left font-bold text-ink">
                    공제 항목
                  </th>
                  <th className="px-4 py-3 text-right font-bold text-ink">
                    월 공제액
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                <tr>
                  <td className="px-4 py-2.5 text-ink/80">국민연금</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink">
                    {formatNumber(result.deductions.nationalPension)}원
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-ink/80">건강보험</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink">
                    {formatNumber(result.deductions.healthInsurance)}원
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-ink/80">장기요양보험</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink">
                    {formatNumber(result.deductions.longTermCare)}원
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-ink/80">고용보험</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink">
                    {formatNumber(result.deductions.employmentInsurance)}원
                  </td>
                </tr>
                <tr className="border-t border-ink/10">
                  <td className="px-4 py-2.5 text-ink/80">소득세</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink">
                    {formatNumber(result.deductions.incomeTax)}원
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-ink/80">지방소득세</td>
                  <td className="px-4 py-2.5 text-right font-mono text-ink">
                    {formatNumber(result.deductions.localIncomeTax)}원
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-ink/15 bg-surface/30">
                  <td className="px-4 py-3 font-bold text-ink">공제합계</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-ink">
                    {formatNumber(result.totalDeduction)}원
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* 요율 안내 */}
          <p className="text-xs text-muted leading-relaxed">
            * 2026년 기준 4대보험 요율 적용 (국민연금 4.75%, 건강보험 3.595%,
            장기요양 13.14%, 고용보험 0.9%). 소득세는 간이세액 산출 공식 기반
            근사값이며 실제와 차이가 있을 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}
