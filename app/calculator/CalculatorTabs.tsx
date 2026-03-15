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
      <div className="flex gap-2 sticky top-0 z-10 bg-paper py-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-ink text-paper"
                : "bg-ink/5 text-muted hover:bg-ink/10 hover:text-ink/70"
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
