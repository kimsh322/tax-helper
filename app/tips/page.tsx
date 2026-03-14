import PageShell from "@/components/layout/PageShell";
import Header from "@/components/layout/Header";

export default function TipsPage() {
  return (
    <PageShell>
      <Header
        number="03"
        title="절세 팁"
        description="연말정산 환급액을 극대화하기 위한 실전 절세 전략을 안내합니다."
      />
      <div className="rounded-lg border border-ink/10 bg-surface/30 p-8 text-center">
        <p className="text-muted text-sm">절세 팁 콘텐츠가 여기에 들어갑니다.</p>
      </div>
    </PageShell>
  );
}
