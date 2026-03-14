"use client";

import { useMemo, useState } from "react";
import { calculateSalary, type SalaryResult } from "@/lib/salary";

function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}

interface SalaryRow {
  annualSalary: number;
  result: SalaryResult;
}

interface SalaryGroup {
  label: string;
  key: number;
  rows: SalaryRow[];
}

function buildGroups(): SalaryGroup[] {
  const groups: SalaryGroup[] = [];

  for (let groupStart = 1000; groupStart <= 15000; groupStart += 1000) {
    const groupEnd = groupStart + 900;
    const rows: SalaryRow[] = [];

    for (let salary = groupStart; salary <= groupEnd; salary += 100) {
      const annualSalary = salary * 10_000;
      const result = calculateSalary({
        annualSalary,
        monthlyNonTaxable: 200_000,
        dependents: 1,
        childrenUnder20: 0,
      });
      rows.push({ annualSalary, result });
    }

    groups.push({
      label: `${formatNumber(groupStart)}만원 ~ ${formatNumber(groupEnd)}만원`,
      key: groupStart,
      rows,
    });
  }

  return groups;
}

export default function SalaryTable() {
  const groups = useMemo(() => buildGroups(), []);
  const [collapsed, setCollapsed] = useState<Set<number>>(() => new Set());

  function toggleGroup(key: number) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted leading-relaxed">
        * 비과세 월 20만원, 부양가족 1명(본인) 기준. 2026년 4대보험 요율 적용.
      </p>

      <div className="overflow-x-auto rounded-lg border border-ink/10">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b-2 border-ink/10 bg-surface/50">
              <th className="px-3 py-3 text-left font-bold text-ink">연봉</th>
              <th className="px-3 py-3 text-right font-bold text-ink">월급</th>
              <th className="px-3 py-3 text-right font-bold text-seal">실수령액</th>
              <th className="px-3 py-3 text-right font-bold text-ink">공제합계</th>
              <th className="px-3 py-3 text-right font-bold text-ink/70">국민연금</th>
              <th className="px-3 py-3 text-right font-bold text-ink/70">건강보험</th>
              <th className="px-3 py-3 text-right font-bold text-ink/70">장기요양</th>
              <th className="px-3 py-3 text-right font-bold text-ink/70">고용보험</th>
              <th className="px-3 py-3 text-right font-bold text-ink/70">소득세</th>
              <th className="px-3 py-3 text-right font-bold text-ink/70">지방소득세</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const isCollapsed = collapsed.has(group.key);
              return (
                <Group
                  key={group.key}
                  group={group}
                  isCollapsed={isCollapsed}
                  onToggle={() => toggleGroup(group.key)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Group({
  group,
  isCollapsed,
  onToggle,
}: {
  group: SalaryGroup;
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      {/* 그룹 헤더 */}
      <tr
        onClick={onToggle}
        className="bg-surface/40 border-t border-ink/10 cursor-pointer hover:bg-surface/70 transition-colors"
      >
        <td colSpan={10} className="px-3 py-2.5 font-bold text-ink text-sm">
          <span className="inline-block w-4 mr-1 text-muted">
            {isCollapsed ? "▸" : "▾"}
          </span>
          {group.label}
        </td>
      </tr>
      {/* 행 */}
      {!isCollapsed &&
        group.rows.map((row) => (
          <tr
            key={row.annualSalary}
            className="border-t border-ink/5 hover:bg-surface/30 transition-colors"
          >
            <td className="px-3 py-2 font-mono text-ink">
              {formatNumber(row.annualSalary / 10_000)}만
            </td>
            <td className="px-3 py-2 text-right font-mono text-ink">
              {formatNumber(row.result.monthlySalary)}
            </td>
            <td className="px-3 py-2 text-right font-mono font-bold text-seal">
              {formatNumber(row.result.netSalary)}
            </td>
            <td className="px-3 py-2 text-right font-mono text-ink">
              {formatNumber(row.result.totalDeduction)}
            </td>
            <td className="px-3 py-2 text-right font-mono text-ink/60">
              {formatNumber(row.result.deductions.nationalPension)}
            </td>
            <td className="px-3 py-2 text-right font-mono text-ink/60">
              {formatNumber(row.result.deductions.healthInsurance)}
            </td>
            <td className="px-3 py-2 text-right font-mono text-ink/60">
              {formatNumber(row.result.deductions.longTermCare)}
            </td>
            <td className="px-3 py-2 text-right font-mono text-ink/60">
              {formatNumber(row.result.deductions.employmentInsurance)}
            </td>
            <td className="px-3 py-2 text-right font-mono text-ink/60">
              {formatNumber(row.result.deductions.incomeTax)}
            </td>
            <td className="px-3 py-2 text-right font-mono text-ink/60">
              {formatNumber(row.result.deductions.localIncomeTax)}
            </td>
          </tr>
        ))}
    </>
  );
}
