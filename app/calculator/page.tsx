import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";

export default function CalculatorPage() {
  return (
    <PageShell>
      <Header
        number="01"
        title="실수령액 계산기"
        description="연봉 또는 월급을 입력하면 세금과 4대보험료를 제외한 실수령액을 계산합니다."
      />
      <div className="rounded-lg border border-ink/10 bg-surface/30 p-8 text-center">
        <p className="text-muted text-sm">계산기 UI가 여기에 들어갑니다.</p>
      </div>
    </PageShell>
  );
}
