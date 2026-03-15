"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { calculateSalary, type SalaryResult } from "@/lib/salary";

function formatNumber(n: number): string {
  return n.toLocaleString("ko-KR");
}

const COL_WIDTHS = ["10%", "12%", "12%", "11%", "9%", "9%", "9%", "9%", "10%", "9%"] as const;

function Colgroup() {
  return (
    <colgroup>
      {COL_WIDTHS.map((w, i) => (
        <col key={i} style={{ width: w }} />
      ))}
    </colgroup>
  );
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
  const [collapsed, setCollapsed] = useState<Set<number>>(
    () => new Set(groups.filter((g) => ![3000, 4000, 5000].includes(g.key)).map((g) => g.key)),
  );

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

  const sentinelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setIsStuck(!entry.isIntersecting), {
      threshold: 0,
      rootMargin: "-57px 0px 0px 0px",
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleBodyScroll = useCallback(() => {
    if (headerRef.current && bodyRef.current) {
      headerRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted leading-relaxed">
        * 비과세 월 20만원, 부양가족 1명(본인) 기준. 2026년 4대보험 요율 적용.
      </p>

      <div className="rounded-lg border border-ink/10">
        {/* sentinel: 헤더가 sticky 상태인지 감지 */}
        <div ref={sentinelRef} className="h-0" />
        {/* 고정 헤더 */}
        <div
          ref={headerRef}
          className={`sticky top-14 z-10 bg-paper border-t border-x border-b-2 border-b-ink/10 overflow-hidden ${
            isStuck ? "border-t-ink/10 border-x-ink/10" : "border-t-transparent border-x-transparent rounded-t-lg"
          }`}
        >
          <table className="w-full text-sm whitespace-nowrap min-w-200 table-fixed">
            <Colgroup />
            <thead>
              <tr>
                <th className="px-3 py-3 text-center font-bold text-ink">연봉</th>
                <th className="px-3 py-3 text-center font-bold text-ink">월급</th>
                <th className="px-3 py-3 text-center font-bold text-seal">실수령액</th>
                <th className="px-3 py-3 text-center font-bold text-ink">공제합계</th>
                <th className="px-3 py-3 text-center font-bold text-ink/70">국민연금</th>
                <th className="px-3 py-3 text-center font-bold text-ink/70">건강보험</th>
                <th className="px-3 py-3 text-center font-bold text-ink/70">장기요양</th>
                <th className="px-3 py-3 text-center font-bold text-ink/70">고용보험</th>
                <th className="px-3 py-3 text-center font-bold text-ink/70">소득세</th>
                <th className="px-3 py-3 text-center font-bold text-ink/70">지방소득세</th>
              </tr>
            </thead>
          </table>
        </div>
        {/* 테이블 본문 */}
        <div ref={bodyRef} onScroll={handleBodyScroll} className="overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap min-w-200 table-fixed">
            <Colgroup />
            <tbody>
              {groups.map((group, i) => {
                const isCollapsed = collapsed.has(group.key);
                return (
                  <Group
                    key={group.key}
                    group={group}
                    isFirst={i === 0}
                    isCollapsed={isCollapsed}
                    onToggle={() => toggleGroup(group.key)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Group({
  group,
  isFirst,
  isCollapsed,
  onToggle,
}: {
  group: SalaryGroup;
  isFirst: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={`bg-surface/40 cursor-pointer hover:bg-surface/70 transition-colors ${isFirst ? "" : "border-t border-ink/10"}`}
      >
        <td colSpan={10} className="px-3 py-2.5 font-bold text-ink text-sm">
          <span className="inline-block w-4 mr-1 text-muted">{isCollapsed ? "▸" : "▾"}</span>
          {group.label}
        </td>
      </tr>
      {!isCollapsed &&
        group.rows.map((row) => (
          <tr key={row.annualSalary} className="border-t border-ink/5 hover:bg-surface/30 transition-colors">
            <td className="px-3 py-2 text-center font-mono text-ink">{formatNumber(row.annualSalary / 10_000)}만</td>
            <td className="px-3 py-2 text-center font-mono text-ink">{formatNumber(row.result.monthlySalary)}</td>
            <td className="px-3 py-2 text-center font-mono font-bold text-seal">
              {formatNumber(row.result.netSalary)}
            </td>
            <td className="px-3 py-2 text-center font-mono text-ink">{formatNumber(row.result.totalDeduction)}</td>
            <td className="px-3 py-2 text-center font-mono text-ink/60">
              {formatNumber(row.result.deductions.nationalPension)}
            </td>
            <td className="px-3 py-2 text-center font-mono text-ink/60">
              {formatNumber(row.result.deductions.healthInsurance)}
            </td>
            <td className="px-3 py-2 text-center font-mono text-ink/60">
              {formatNumber(row.result.deductions.longTermCare)}
            </td>
            <td className="px-3 py-2 text-center font-mono text-ink/60">
              {formatNumber(row.result.deductions.employmentInsurance)}
            </td>
            <td className="px-3 py-2 text-center font-mono text-ink/60">
              {formatNumber(row.result.deductions.incomeTax)}
            </td>
            <td className="px-3 py-2 text-center font-mono text-ink/60">
              {formatNumber(row.result.deductions.localIncomeTax)}
            </td>
          </tr>
        ))}
    </>
  );
}
