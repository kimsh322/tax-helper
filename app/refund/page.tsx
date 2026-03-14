import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";

export default function RefundPage() {
  return (
    <PageShell>
      <Header
        number="02"
        title="환급액 예상"
        description="소득공제와 세액공제 내역을 입력하면 예상 환급액을 계산합니다."
      />
      <div className="rounded-lg border border-ink/10 bg-surface/30 p-8 text-center">
        <p className="text-muted text-sm">환급액 계산 UI가 여기에 들어갑니다.</p>
      </div>
    </PageShell>
  );
}
