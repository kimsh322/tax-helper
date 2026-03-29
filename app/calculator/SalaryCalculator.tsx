"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { calculateSalary, type SalaryResult } from "@/lib/salary";
import CustomSelect from "@/components/ui/CustomSelect";

function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}

function parseInputNumber(value: string): number {
  return Number(value.replace(/[^0-9]/g, "")) || 0;
}

export default function SalaryCalculator() {
  const searchParams = useSearchParams();
  const [annualSalary, setAnnualSalary] = useState("");
  const [nonTaxable, setNonTaxable] = useState("200000");
  const [dependents, setDependents] = useState(1);
  const [childrenUnder20, setChildrenUnder20] = useState(0);
  const [result, setResult] = useState<SalaryResult | null>(null);

  // URL params로 전달된 데이터로 자동 계산
  useEffect(() => {
    const salaryParam = searchParams.get("salary");
    if (!salaryParam) return;
    const salary = Number(salaryParam);
    if (salary <= 0) return;

    setAnnualSalary(formatNumber(salary));
    const res = calculateSalary({
      annualSalary: salary,
      monthlyNonTaxable: 200_000,
      dependents: 1,
      childrenUnder20: 0,
    });
    setResult(res);
  }, [searchParams]);

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
              <CustomSelect
                value={dependents}
                onChange={setDependents}
                options={Array.from({ length: 11 }, (_, i) => ({
                  value: i + 1,
                  label: `${i + 1}명`,
                }))}
              />
            </div>

            {/* 20세 이하 자녀 수 */}
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">
                8세 이상 20세 이하 자녀 수
              </label>
              <CustomSelect
                value={childrenUnder20}
                onChange={setChildrenUnder20}
                options={Array.from({ length: 8 }, (_, i) => ({
                  value: i,
                  label: `${i}명`,
                }))}
              />
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

          {/* 환급액 계산 연동 */}
          <Link
            href={buildRefundLink()}
            className="block w-full rounded-md border-2 border-seal/20 bg-seal/5 py-3.5 text-center text-sm font-bold text-seal transition-colors hover:bg-seal/10"
          >
            이 정보로 환급액 계산하기 →
          </Link>

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
