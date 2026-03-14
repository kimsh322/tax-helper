"use client";

import { useState } from "react";
import SalaryCalculator from "./SalaryCalculator";
import SalaryTable from "./SalaryTable";

const TABS = [
  { id: "calculator", label: "계산기" },
  { id: "table", label: "실수령액 표" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function CalculatorTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("calculator");

  return (
    <div className="space-y-8">
      {/* 탭 버튼 */}
      <div className="flex border-b-2 border-ink/10 sticky top-0 z-10 bg-paper">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-bold transition-colors cursor-pointer -mb-[2px] ${
              activeTab === tab.id
                ? "border-b-2 border-ink text-ink"
                : "border-b-2 border-transparent text-muted hover:text-ink/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === "calculator" ? <SalaryCalculator /> : <SalaryTable />}
    </div>
  );
}
