import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { calculateSalary, type SalaryResult } from "@/lib/salary";
import { formatNumber } from "@/lib/format";

export interface SalaryRow {
  annualSalary: number;
  result: SalaryResult;
}

export interface SalaryGroup {
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

export function useSalaryTable() {
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

  return {
    groups,
    collapsed,
    toggleGroup,
    sentinelRef,
    headerRef,
    bodyRef,
    isStuck,
    handleBodyScroll,
  };
}
