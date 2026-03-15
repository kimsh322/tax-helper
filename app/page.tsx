import Link from "next/link";

const sections = [
  {
    href: "/calculator",
    number: "01",
    title: "실수령액 계산기",
    description: "연봉/월급에서 세금과 4대보험을 제외한 실수령액을 계산합니다.",
  },
  {
    href: "/refund",
    number: "02",
    title: "환급액 예상",
    description: "올해 연말정산에서 돌려받을 수 있는 예상 환급액을 계산합니다.",
  },
  {
    href: "/tips",
    number: "03",
    title: "절세 팁",
    description: "연말정산 환급액을 늘리기 위한 실전 절세 전략을 안내합니다.",
  },
  {
    href: "/deductions",
    number: "04",
    title: "공제 항목 설명",
    description: "소득공제와 세액공제 항목을 쉽게 이해할 수 있도록 정리했습니다.",
  },
];

export default function Home() {
  return (
    <div className="min-h-full px-6 py-8 md:px-10 md:py-16">
      <div className="mx-auto max-w-5xl">
        {/* 히어로 */}
        <div className="mb-12 md:mb-16">
          <p className="font-mono text-xs text-muted mb-3">2026년 귀속</p>
          <h1 className="font-serif text-4xl font-bold text-ink leading-tight md:text-5xl">
            연말정산
            <br />
            <span className="text-seal">미리계산</span>
          </h1>
          <p className="mt-4 text-base text-ink/70 leading-relaxed max-w-md">
            복잡한 연말정산, 미리 계산해보고 절세 전략을 세워보세요.
          </p>
        </div>

        {/* 섹션 카드 그리드 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group block rounded-lg border border-ink/10 bg-surface/50 p-6 transition-all hover:border-ink/20 hover:bg-surface hover:shadow-sm"
            >
              <div className="flex items-baseline justify-between mb-3">
                <span className="font-mono text-xs text-muted">{section.number}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-ink"
                >
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </div>
              <h2 className="font-serif text-lg font-bold text-ink mb-1">{section.title}</h2>
              <p className="text-sm text-muted leading-relaxed">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
