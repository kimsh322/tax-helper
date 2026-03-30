"use client";

import Link from "next/link";
import { formatNumber } from "@/lib/format";
import { useQuickSimulation } from "./useQuickSimulation";

export default function QuickSimulation() {
  const { salary, result, handleSalaryChange, handleCalculate } =
    useQuickSimulation();

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
          onChange={(e) => handleSalaryChange(e.target.value)}
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
