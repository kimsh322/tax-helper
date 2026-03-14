import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";

export default function DeductionsPage() {
  return (
    <PageShell>
      <Header
        number="04"
        title="공제 항목 설명"
        description="소득공제와 세액공제 항목을 쉽게 이해할 수 있도록 정리했습니다."
      />
      <div className="rounded-lg border border-ink/10 bg-surface/30 p-8 text-center">
        <p className="text-muted text-sm">공제 항목 설명이 여기에 들어갑니다.</p>
      </div>
    </PageShell>
  );
}
